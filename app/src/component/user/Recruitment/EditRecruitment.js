import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, recruitmentId }) => {
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    useEffect(() => {
        if (isOpen) {
            setMessage('');
            console.log('modal open', recruitmentId);

            if (recruitmentId) {
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${BASE_API_URL}recruitment/get?recruitmentid=${recruitmentId}`);
                        const recruitmentData = response.data.data;
                        console.log('data', response.data.data);
                        setData(recruitmentData);
                        setSelectedSkills(recruitmentData.requiredSkills || []);
                        setAvailableSkills(availableSkills.filter(skill => !recruitmentData.requiredSkills.includes(skill)));

                    } catch (error) {
                        console.error('Error fetching data:', error);
                    }
                };

                fetchData();
            }
        }
    }, [isOpen, recruitmentId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleInterviewChange = (index, field, value) => {
        const newInterviews = data.interviews.map((interview, i) => (
            i === index ? { ...interview, [field]: value } : interview
        ));
        setData((prevState) => ({
            ...prevState,
            interviews: newInterviews,
        }));
        console.log("newInterviews", newInterviews)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        // const mydata = { ...data, requiredSkills: selectedSkills };

        try {
            const response = await axios.put(`${BASE_API_URL}recruitment/edit`, data);
            console.log(response.data);
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
        setData({ ...data, requiredSkills: updatedSelectedSkills });
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setData({ ...data, requiredSkills: updatedSelectedSkills });
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
            {/* <button onClick={onRequestClose}>Close</button> */}
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <div className="signup-form">
                        <form onSubmit={handleSubmit} className="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Recruitment</h4>
                            </div>
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label><b>Candidate ID</b></label>
                                    <input type="text" name="profile_id" value={data.profile_id} onChange={handleInputChange} className="form-control" placeholder="profile_id ID" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Title</b></label>
                                    <input type="text" name="title" value={data.title || ''} onChange={handleInputChange} className="form-control" placeholder="Title" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Description</b></label>
                                    <input type="text" name="description" value={data.description || ''} onChange={handleInputChange} className="form-control" placeholder="Description" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Experience*</b></label>
                                    {/* <input type="text" name="candidate_experience" value={formData.candidate_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
                                                                            {errors.candidate_experience && <span className="error" style={{ color: 'red' }}>{errors.candidate_experience}</span>} */}
                                    <select
                                        name="experience"
                                        value={data.experience}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value=""> Select Experience </option>
                                        <option value="0-1">0 - 1 Year</option>
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
                                    <label><b>Salary</b></label>
                                    <input type="text" name="salary" value={data.salary} onChange={handleInputChange} className="form-control" placeholder="Salary" />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>Location</b></label>
                                    <input type="text" name="location" value={data.location} onChange={handleInputChange} className="form-control" placeholder="Location" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>EmailId</b></label>
                                    <input type="email" name="emailId" value={data.emailId} onChange={handleInputChange} className="form-control" placeholder="emailId" />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>Responsibilities</b></label>
                                    <textarea type="text" name="responsibilities" value={data.responsibilities} onChange={handleInputChange} className="form-control" placeholder="Responsibilities" />
                                </div>

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
                                <div className="mb-3 col-md-6">
                                    <label><b>ApplyNowLink</b></label>
                                    <input type="text" name="applyNowLink" value={data.applyNowLink} onChange={handleInputChange} className="form-control" placeholder="ApplyNowLink" />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>WhatsappNumber</b></label>
                                    <input type="text" name="whatsappNumber" value={data.whatsappNumber} onChange={handleInputChange} className="form-control" placeholder="whatsappNumber" />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>interviewer</b></label>
                                    <select name="interviewer" value={data.interviewer || ''} onChange={handleInputChange} className="form-control">
                                        <option value="Mr. Arun Sharma">Mr. Arun Sharma</option>
                                        <option value="Mr. Anil Tiwari">Mr. Anil Tiwari</option>
                                        <option value="Mr. Pawan Patel">Mr. Pawan Patel</option>
                                        <option value="Mr. Manoj Sahu">Mr. Manoj Sahu</option>
                                        <option value="Ms. Geetanjali P">Ms. Geetanjali P</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Interview Date</b></label>
                                    <input type="date" name="interview_date" value={data.interview_date || ''} onChange={handleInputChange} className="form-control" placeholder="Interview Date" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Notes</b></label>
                                    <input type="text" name="notes" value={data.notes || ''} onChange={handleInputChange} className="form-control" placeholder="Notes" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>No. Of Candidate</b></label>
                                    <input type="text" name="no_of_candidate" value={data.no_of_candidate} onChange={handleInputChange} className="form-control" placeholder="no_of_candidate" />
                                </div>

                            </div>
                            <div className="mb-3 col-md-6">
                                <button type="submit" className="btn btn-primary float-end">Save</button>
                                {message && <p>{message}</p>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ModalBox;
