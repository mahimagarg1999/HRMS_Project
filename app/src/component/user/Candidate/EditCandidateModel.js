// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, candidateId }) => {

    const [data, setData] = useState([])
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(''); // State to store selected profile
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            console.log("e----->", e.target.name);
            reader.onloadend = () => {
                if (e.target && e.target.name === 'resume') {
                    console.log('hii')
                    setResume(reader.result);
                }
                console.log('idproof', resume)

            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };
    // useEffect(() => {
    //     if (isOpen && candidateId) {
    //         setMessage('')
    //         setResume('')
    //         console.log('model open', candidateId)
    //         // Fetch data for the given candidateId
    //         if (candidateId) {
    //             const fetchData = async () => {
    //                 try {

    //                     const response = await axios.get(`${BASE_API_URL}candidate/get?candidateid=${candidateId}`);
    //                     const candidateData = response.data.data;
    //                     setData(candidateData);
    //                     setSelectedSkills(candidateData.candidate_skills || []);
    //                     setAvailableSkills(availableSkills.filter(skill => !candidateData.candidate_skills.includes(skill)));
    //                     // setSelectedSkills(Array.isArray(candidateData.candidate_skills) ? candidateData.candidate_skills : []);
    //                     // setAvailableSkills(prevAvailableSkills =>
    //                     //     prevAvailableSkills.filter(skill =>
    //                     //         !Array.isArray(candidateData.candidate_skills) || !candidateData.candidate_skills.includes(skill)
    //                     //     )
    //                     // );
    //                     console.log('data', data)

    //                 } catch (error) {
    //                     console.log('model open error')

    //                     console.error('Error fetching candidate data:', error);
    //                 }
    //             };

    //             fetchData();
    //         }
    //     }
    // }, [isOpen,candidateId]);
    useEffect(() => {
        if (isOpen && candidateId) {
            setMessage("")
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    useEffect(() => {
        // Fetch profiles from API when the component mounts
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/recruitment/get_profile`);
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
    const handleSubmit = async (e) => {
        // const mydata = data;
        const mydata = { ...data, candidate_skills: selectedSkills };

        if (resume !== '') {
            mydata.candidate_document_proof = resume
        }

        console.log("data", data)

        const pdfdoc = {
            resumePdfName: "pdf",
            id: candidateId
        };
        const mergedData = { ...mydata, ...pdfdoc };
        console.log("data", mergedData)
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response = await axios.put(`${BASE_API_URL}candidate/edit`, mergedData);
            console.log(response.data); // Handle the response as needed
            // onRequestClose(); // Close the modal if request is successful

            setMessage(response.data.msg);

        } catch (error) {

            console.error('Error:', error);
        }
    };
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/skills/get_skills`);
                if (response.data.success) {
                    const skills = response.data.data.map(item => item.skills);
                    setAvailableSkills(skills);
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };

        fetchSkills();
    }, []);
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
                    // overflow: 'hidden', // Prevent scroll

                }
            }}
        >

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">

                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.candidate_first_name} profile</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label><b>Candidate ID*</b></label>
                                    <input type="text" name="candidate_id" value={data.candidate_id} onChange={handleInputChange} class="form-control" placeholder="Candidate" />

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>First Name</b></label>
                                    <input type="text" name="candidate_first_name" value={data.candidate_first_name} onChange={handleInputChange} class="form-control" placeholder="Full Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Last Name</b></label>
                                    <input type="text" name="candidate_last_name" value={data.candidate_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Profile</b></label>
                                    {/* <input type="text" name="profile" value={data.profile} onChange={handleInputChange} class="form-control" placeholder="Profile" /> */}
                                    <select name="profile"
                                        value={data.profile}
                                        onChange={handleInputChange}
                                        className="form-control">
                                        {profiles.map(profile => (
                                            <option key={profile.profile_id} value={profile.profile_id}>
                                                {profile.profile}
                                            </option>
                                        ))}
                                    </select>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Mobile No</b></label>
                                    <input type="text" name="candidate_mobile" value={data.candidate_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Alternate Mobile No</b></label>
                                    <input type="text" name="candidate_alternate_mobile" value={data.candidate_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Email</b></label>
                                    <input type="email" name="candidate_email" value={data.candidate_email} onChange={handleInputChange} class="form-control" placeholder="Email" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Skype Id</b></label>
                                    <input type="text" name="candidate_skype" value={data.candidate_skype} onChange={handleInputChange} class="form-control" placeholder="Skype ID" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>LinkedIn Profile</b></label>
                                    <input type="text" name="candidate_linkedIn_profile" value={data.candidate_linkedIn_profile} onChange={handleInputChange} class="form-control" placeholder="LinkedIn Profile" />
                                </div>
                                {/* <div class="mb-3 col-md-6">
                                    <label><b>Skills</b></label>
                                    <div className="skills-container">
                                        <div className="available-skills">
                                            <select className="form-control" multiple size="4">
                                                {availableSkills.map(skill => (
                                                    <option key={skill} onClick={() => handleAddSkill(skill)}>
                                                        {skill}
                                                    </option>
                                                ))}
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

                                </div> */}
                                <div class="mb-3 col-md-6">
                                    <label><b>Skills</b></label>
                                    <div className="skills-container">
                                        <div className="available-skills">
                                            <select className="form-control" multiple size="4">
                                                {availableSkills.map(skill => (
                                                    <option key={skill} onClick={() => handleAddSkill(skill)}>
                                                        {skill}
                                                    </option>
                                                ))}
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

                                <div class="mb-3 col-md-6">
                                    <label><b>Experience</b></label>
                                    {/* <input type="text" name="candidate_experience" value={data.candidate_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" /> */}
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
                                <div class="mb-3 col-md-6">
                                    <label><b>Expected Salary</b></label>
                                    <input type="text" name="candidate_expected_salary" value={data.candidate_expected_salary} onChange={handleInputChange} class="form-control" placeholder="Expected Salary" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Joining Date</b></label>
                                    <input type="date" name="candidate_expected_joining_date" value={data.candidate_expected_joining_date} onChange={handleInputChange} class="form-control" />
                                </div>

                                <div class="mb-3 col-md-6">
                                    <label><b>Marrital Status</b></label>
                                    <input type="text" name="candidate_marrital_status" value={data.candidate_marrital_status} onChange={handleInputChange} class="form-control" placeholder="Marrital Status" />
                                </div>

                                <div class="mb-3 col-md-6">
                                    <label><b>Machine Round</b></label>
                                    <input type="text" name="candidate_machine_round" value={data.candidate_machine_round} onChange={handleInputChange} class="form-control" placeholder="Machine Round" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Technical Round</b></label>
                                    <input type="text" name="candidate_technical_interview_round" value={data.candidate_technical_interview_round} onChange={handleInputChange} class="form-control" placeholder="Technical Interview Round" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Interview Round</b></label>
                                    <input type="text" name="candidate_hr_interview_round" value={data.candidate_hr_interview_round} onChange={handleInputChange} class="form-control" placeholder="HR Interview Round" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Selection Status</b></label>
                                    {/* <input type="text" name="candidate_selection_status" value={data.candidate_selection_status} onChange={handleInputChange} class="form-control" placeholder="Selection Status" /> */}
                                    <select
                                        name="candidate_selection_status"
                                        value={data.candidate_selection_status}
                                        onChange={handleInputChange}
                                        className="form-control" >
                                        <option value=""> Selection Status </option>
                                        <option value="Rejected">Rejected</option>
                                        <option value="On Hold">On Hold</option>
                                        <option value="Hired">Hired</option>
                                        <option value="NA">NA</option>


                                    </select>
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Feedback</b></label>
                                    <input type="text" name="candidate_feedback" value={data.candidate_feedback} onChange={handleInputChange} class="form-control" placeholder="Feedback" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Source of candidate</b></label>
                                    <input type="text" name="source_of_candidate" value={data.source_of_candidate} onChange={handleInputChange} class="form-control" placeholder="From Consultancy" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Candidate Address</b></label>
                                    <input type="text" name="candidate_address" value={data.candidate_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                </div>

                                <div class="mb-3 col-md-6">
                                    <label>Document Proof </label>
                                    <input type="file" name="resume" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.candidate_document_proof}`} target="_blank">{data.candidate_document_proof == '' ? '' : 'Show Document proof'}</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>10th  Percentage</b></label>
                                    <input type="number" name="tenth_percentage" value={data.tenth_percentage} onChange={handleInputChange} class="form-control" placeholder="Tenth Percentage" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>12th  Percentage</b></label>
                                    <input type="number" name="twelfth_percentage" value={data.twelfth_percentage} onChange={handleInputChange} class="form-control" placeholder="Twelfth Percentage" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Graduation  Percentage</b></label>
                                    <input type="number" name="graduationPercentage" value={data.graduationPercentage} onChange={handleInputChange} class="form-control" placeholder="Graduation Percentage" />
                                </div>
                            </div>

                            <div class="col-md-12">
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