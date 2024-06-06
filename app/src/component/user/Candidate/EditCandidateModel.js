// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
const ModalBox = ({ isOpen, onRequestClose, candidateId }) => {

    const [data, setData] = useState([])
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');

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
    useEffect(() => {
        if (isOpen) {
            setMessage('')
            setResume('')
            console.log('model open', candidateId)
            // Fetch data for the given candidateId
            if (candidateId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`${BASE_API_URL}candidate/get?candidateid=${candidateId}`);
                        setData(response.data.data)
                        console.log('data', data)

                    } catch (error) {
                        console.log('model open error')

                        console.error('Error fetching candidate data:', error);
                    }
                };

                fetchData();
            }
        }
    }, [isOpen]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        const mydata = data;
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

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {

                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    width: '90%',
                    height: '90%',
                    margin: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    padding: '20px'
                }
            }}
        >
            <button onClick={onRequestClose}>Close</button>

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
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
                                <div class="mb-3 col-md-6">
                                    <label><b>Skills</b></label>
                                    <input type="text" name="candidate_skills" value={data.candidate_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Experience</b></label>
                                    <input type="text" name="candidate_experience" value={data.candidate_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
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
                                    <input type="text" name="candidate_selection_status" value={data.candidate_selection_status} onChange={handleInputChange} class="form-control" placeholder="Selection Status" />
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
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.candidate_document_proof}`} target="_blank">{data.candidate_document_proof == '' ? '' : 'Show Document proof'}</a>

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