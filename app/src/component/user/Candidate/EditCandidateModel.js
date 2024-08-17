// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, candidateId }) => {
    const [data, setData] = useState([]);
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [newdata, setnewdata] = useState('');

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = arrayBufferToBase64(reader.result);
                setResume(base64String);
                console.log('resume', base64String);
            };
            reader.readAsArrayBuffer(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };

    useEffect(() => {
        if (isOpen && candidateId) {
            setMessage("");
            setnewdata('');
            setResume("");
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}candidate/get?candidateid=${candidateId}`);
                    const candidateData = response.data.data;
                    setData(candidateData);
                    setSelectedSkills(candidateData.candidate_skills || []);
                    setAvailableSkills(availableSkills.filter(skill => !candidateData.candidate_skills.includes(skill)));
                } catch (error) {
                    console.error('Error fetching candidate data:', error);
                }
            };
            fetchData();
        }
    }, [isOpen, candidateId]);
    useEffect(() => {
        const fetchSkillsByProfile = async () => {
            if (data.profile) {
                setAvailableSkills([]); // Clear available skills before fetching new ones

                try {
                    const response = await axios.get(`${BASE_API_URL}/skills/getskillbyprofile`, {
                        params: { profile: data.profile }
                    });
                    if (response.data.success) {
                        const skills = response.data.data.map(item => item.skills);
                        setAvailableSkills(skills); // Set filtered skills based on selected profile
                    } else {
                        console.error('Failed to fetch skills:', response.data.msg);
                    }
                } catch (error) {
                    console.error('Error fetching skills:', error);
                }
            } else {
                setAvailableSkills([]); // If no profile is selected, ensure skills are empty
            }
        };

        fetchSkillsByProfile();
    }, [data.profile]);
    const handleProfileChange = (event) => {
        setData({ ...data, profile: event.target.value });
    };



    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/profiles/list`);
                if (response.data.success) {
                    setProfiles(response.data.data); // Set profiles in state
                } else {
                    console.error('Failed to fetch profiles:', response.data.msg);
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setnewdata((prevState) => ({
            ...prevState,
            [name]: value
        }));
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const mydata = { ...newdata, candidate_skills: selectedSkills, id: data._id };

        if (resume !== '') {
            mydata.candidate_document_proof = resume;
        }

        const pdfdoc = { resumePdfName: "pdf", id: candidateId };
        const mergedData = { ...mydata, ...pdfdoc };
        console.log("mergedData", mergedData);

        try {
            const response = await axios.put(`${BASE_API_URL}candidate/edit`, mergedData);
            console.log(response.data);
            setMessage(response.data.msg);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    // useEffect(() => {
    //     const fetchSkills = async () => {
    //         try {
    //             const response = await axios.get(`${BASE_API_URL}/skills/get_skills`);
    //             if (response.data.success) {
    //                 const skills = response.data.data.map(item => item.skills);
    //                 setAvailableSkills(skills);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching skills:", error);
    //         }
    //     };
    //     fetchSkills();
    // }, []);

    const handleAddSkill = (skill) => {
        const updatedSelectedSkills = [...selectedSkills, skill];
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills(availableSkills.filter(item => item !== skill));
        setData({ ...data, candidate_skills: updatedSelectedSkills });
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setData({ ...data, candidate_skills: updatedSelectedSkills });
    };

    const SkillTag = ({ skill, onRemove }) => (
        <div className="skill-tag">
            {skill}
            <button onClick={() => onRemove(skill)}>x</button>
        </div>
    );

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {

                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    width: '100%',
                    height: '100%',
                    margin: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',

                }
            }}
        >

            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="signup-form">

                        <form onSubmit={handleSubmit} className="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.candidate_first_name} profile</h4>

                            </div>
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label><b>Candidate ID*</b></label>
                                    <input type="text" name="candidate_id" value={data.candidate_id} onChange={handleInputChange} className="form-control" placeholder="Candidate" />

                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>First Name</b></label>
                                    <input type="text" name="candidate_first_name" value={data.candidate_first_name} onChange={handleInputChange} className="form-control" placeholder="Full Name" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Last Name</b></label>
                                    <input type="text" name="candidate_last_name" value={data.candidate_last_name} onChange={handleInputChange} className="form-control" placeholder="Last Name" />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>Profile*</b></label>
                                    <select name="profile"
                                        value={data.profile}
                                        onChange={handleInputChange}
                                        className="form-control">
                                        <option value="">Select a Profile</option>
                                        {profiles.map(profile => (
                                            <option key={profile.profile_id} value={profile.profile_id}>
                                                {profile.profile}
                                            </option>
                                        ))}
                                    </select>

                                    <div className="mb-3 col-md-6">
                                        <label><b>Skills</b></label>
                                        <div className="skills-container">
                                            <div className="available-skills">
                                                <select className="form-control" multiple size="4">
                                                    {availableSkills.length === 0 ? (
                                                        <option disabled>No skills available</option>
                                                    ) : (
                                                        availableSkills.map(skill => (
                                                            <option key={skill} onClick={() => handleAddSkill(skill)}>
                                                                {skill}
                                                            </option>
                                                        ))
                                                    )}
                                                </select>
                                            </div>
                                            <div className="selected-skills">
                                                <label>Selected Skills</label>
                                                <div>
                                                    {selectedSkills.map(skill => (
                                                        <SkillTag key={skill} skill={skill} onRemove={handleRemoveSkill} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Mobile No</b></label>
                                    <input type="text" name="candidate_mobile" value={data.candidate_mobile} onChange={handleInputChange} className="form-control" placeholder="Mobile Number" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Alternate Mobile No</b></label>
                                    <input type="text" name="candidate_alternate_mobile" value={data.candidate_alternate_mobile} onChange={handleInputChange} className="form-control" placeholder="Alternate Mobile Number" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Email</b></label>
                                    <input type="email" name="candidate_email" value={data.candidate_email} onChange={handleInputChange} className="form-control" placeholder="Email" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Skype Id</b></label>
                                    <input type="text" name="candidate_skype" value={data.candidate_skype} onChange={handleInputChange} className="form-control" placeholder="Skype ID" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>LinkedIn Profile</b></label>
                                    <input type="text" name="candidate_linkedIn_profile" value={data.candidate_linkedIn_profile} onChange={handleInputChange} className="form-control" placeholder="LinkedIn Profile" />
                                </div>



                                <div className="mb-3 col-md-6">
                                    <label><b>Experience</b></label>
                                    <select
                                        name="candidate_experience"
                                        value={data.candidate_experience}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value=""> Select Experience </option>
                                        <option value="0-1">0 - 1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                        <option value="6">6</option>
                                        <option value="7">7</option>
                                        <option value="8">8</option>
                                        <option value="9">9</option>
                                        <option value="10">10 +</option>

                                    </select>

                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Expected Salary</b></label>
                                    <input type="text" name="candidate_expected_salary" value={data.candidate_expected_salary} onChange={handleInputChange} className="form-control" placeholder="Expected Salary" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Joining Date</b></label>
                                    <input type="date" name="candidate_expected_joining_date" value={data.candidate_expected_joining_date} onChange={handleInputChange} className="form-control" />
                                </div>

                                {/* <div className="mb-3 col-md-6">
                                    <label><b>Marrital Status</b></label>
                                    <input type="text" name="candidate_marrital_status" value={data.candidate_marrital_status} onChange={handleInputChange} className="form-control" placeholder="Marrital Status" />
                                </div> */}
                                <div className="mb-3 col-md-6">
                                    <label><b>Marital Status</b></label>
                                    <select
                                        name="candidate_marrital_status"
                                        value={data.candidate_marrital_status}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Married">Married</option>
                                        <option value="Unmarried">Unmarried</option>
                                    </select>
                                </div>


                                <div className="mb-3 col-md-6">
                                    <label><b>Interview Rounds</b></label>
                                    <select
                                        name="interview_rounds"
                                        value={data.interview_rounds}
                                        onChange={handleInputChange}
                                        className="form-control" >
                                        <option value=""> Select Round </option>
                                        <option value="Telephonic Round">Telephonic Round</option>
                                        <option value="Machine Round">Machine Round
                                        </option>
                                        <option value="Face-to-Face Round">Face-to-Face Round</option>
                                        <option value="HR Round">HR Round</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Selection Status</b></label>
                                    <select
                                        name="candidate_selection_status"
                                        value={data.candidate_selection_status}
                                        onChange={handleInputChange}
                                        className="form-control" >
                                        <option value=""> Selection Status </option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Hired">Hired</option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="NA">NA</option>


                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Feedback</b></label>
                                    <input type="text" name="candidate_feedback" value={data.candidate_feedback} onChange={handleInputChange} className="form-control" placeholder="Feedback" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Source of candidate</b></label>
                                    <select
                                        name="source_of_candidate"
                                        value={data.source_of_candidate}
                                        onChange={handleInputChange}
                                        className="form-control" >
                                        <option value=""> Selection Of Candidate </option>
                                        <option value="Consultancy">Consultancy</option>
                                        <option value="LinkedIn">LinkedIn</option>
                                        <option value="Direct">Direct</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Candidate Address</b></label>
                                    <input type="text" name="candidate_address" value={data.candidate_address} onChange={handleInputChange} className="form-control" placeholder="Address" />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label>Document Proof </label>
                                    <input type="file" name="resume" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.candidate_document_proof}`} target="_blank">{data.candidate_document_proof == '' ? '' : 'Show Document proof'}</a>

                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>10th  Percentage</b></label>
                                    <input type="number" name="tenth_percentage" value={data.tenth_percentage} onChange={handleInputChange} className="form-control" placeholder="Tenth Percentage" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>12th  Percentage</b></label>
                                    <input type="number" name="twelfth_percentage" value={data.twelfth_percentage} onChange={handleInputChange} className="form-control" placeholder="Twelfth Percentage" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Graduation  Percentage</b></label>
                                    <input type="number" name="graduationPercentage" value={data.graduationPercentage} onChange={handleInputChange} className="form-control" placeholder="Graduation Percentage" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Post Graduation Per</b></label>
                                    <input type="number" name="postGraduationPercentage" value={data.postGraduationPercentage} onChange={handleInputChange} className="form-control" placeholder="Post Graduation %" />
                                </div>
                            </div>

                            <div className="col-md-12">
                                <button type="submit">Edit here</button>
                            </div>
                            <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalBox;




