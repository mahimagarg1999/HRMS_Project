// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';

const ModalBox = ({ isOpen, onRequestClose, employeeId }) => {
    const [selectedFile, setSelectedFile] = useState('');
    const [idproof, setidproofFile] = useState('');
    const [marksheet, setmarksheet] = useState('');
    const [e_letter, seteletter] = useState('');
    const [pencard, setPencard] = useState('');
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            console.log("e----->", e.target.name);
            reader.onloadend = () => {
                if (e.target && e.target.name === 'id') {
                    console.log('hii')
                    setidproofFile(reader.result);
                } else if (e.target && e.target.name === 'resume_file') {
                    setSelectedFile(reader.result);
                }
                else if (e.target && e.target.name === 'mark') {
                    setmarksheet(reader.result);
                }
                else if (e.target && e.target.name === 'pancard') {
                    setPencard(reader.result);
                }
                else {
                    seteletter(reader.result);
                    console.log('', e_letter)
                }
                console.log('idproof', idproof)
                console.log('selectedFile', selectedFile)

            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };
    useEffect(() => {

        if (isOpen) {
            setMessage('')
            console.log('model open', employeeId)
            // Fetch data for the given employeeId
            if (employeeId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`${BASE_API_URL}employee/get?employeeid=${employeeId}`);
                        setData(response.data.data)
                        console.log('data-----', data)

                    } catch (error) {
                        console.log('model open error')
                        console.error('Error fetching employee data:', error);
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
        mydata.employee_id_proof = idproof
        mydata.employee_resume = selectedFile
        mydata.employee_marksheet = marksheet
        mydata.employee_pan_card = pencard
        mydata.employee_experience_letter = e_letter


        const pdfdoc = {
            resumePdfName: "pdf",
            proofPdfName: "pdf",
            panPdfName: "pdf",
            marksheetPdfName: "pdf",
            experiencePdfName: 'pdf',
            _id: employeeId
        };
        const mergedData = { ...mydata, ...pdfdoc };


        console.log("data", mergedData)
        e.preventDefault();
        // Handle form submission here
        try {
            const response = await axios.put(`${BASE_API_URL}employee/edit`, mergedData);
            console.log(response.data); // Handle the response as needed
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
            // style={{
            //     overlay: {

            //         backgroundColor: 'rgba(0, 0, 0, 0.5)'
            //     },
            //     content: {
            //         width: '90%',
            //         height: '90%',
            //         margin: 'auto',
            //         borderRadius: '8px',
            //         boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            //         padding: '20px'
            //     }
            // }}
        >
            <button onClick={onRequestClose}>Close</button>

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit  {data.employee_first_name} profile</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                               <b> <label>First Name</label></b>
                                    <input type="text" name="employee_first_name" value={data.employee_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Last Name</label></b>

                                    <input type="text" name="employee_last_name" value={data.employee_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Mobile</label></b>

                                    <input type="text" name="employee_mobile" value={data.employee_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Alternate_mobile</label></b>

                                    <input type="text" name="employee_alternate_mobile" value={data.employee_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Email</label></b>


                                    <input type="email" name="employee_email" value={data.employee_email} onChange={handleInputChange} class="form-control" placeholder="Email" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Proof Id</label></b>

                                    <input type="file" name="id" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_id_proof}`} target="_blank">{data.employee_id_proof==''?'':'show  id proof'} </a>

                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Resume</label></b>
                                    <input type="file" name="resume_file" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_resume}`} target="_blank">{data.employee_resume==''?'':'show resume'} </a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <b> <label>Marksheet</label></b>

                                    <input type="file" name="mark" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_marksheet
                                        }`} target="_blank"> {data.employee_marksheet==''?'':'show  marksheet'} </a>

                                 </div>
                                <div class="mb-3 col-md-6">
                                <b> <label>Pan Card</label></b>
                                    <input type="file" name="pancard" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_pan_card
                                        }`} target="_blank">  {data.employee_pan_card==''?'':'show  pan_card'}</a>

                                 </div>
                                <div class="mb-3 col-md-6">
                                    <b> <label>Experience Letter</label></b>

                                    <input type="file" name="e_letter" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_experience_letter
                                        }`} target="_blank">{data.employee_experience_letter==''?'':'show experience_letter'} </a>

                                 </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Password</label></b>

                                    <input type="text" name="employee_password" value={data.employee_password} onChange={handleInputChange} class="form-control" placeholder="Password" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Address</label></b>

                                    <input type="text" name="employee_address" value={data.employee_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> City</label></b>

                                    <input type="text" name="employee_city" value={data.employee_city} onChange={handleInputChange} class="form-control" placeholder="City" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> State</label></b>

                                    <input type="text" name="employee_state" value={data.employee_state} onChange={handleInputChange} class="form-control" placeholder="State" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Other_info</label></b>

                                    <input type="text" name="employee_other_info" value={data.employee_other_info} onChange={handleInputChange} class="form-control" placeholder="Employee Other Info" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Date of birth</label></b>

                                    <input type="date" name="employee_dob" value={data.employee_dob} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Date of Joininng </label></b>

                                    <input type="date" name="employee_doj" value={data.employee_doj} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Skills </label></b>

                                    <input type="text" name="employee_skills" value={data.employee_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Experience </label></b>

                                    <input type="text" name="employee_experience" value={data.employee_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Resume </label></b>

                                    <input type="text" name="employee_resume" value={data.employee_resume} onChange={handleInputChange} class="form-control" placeholder="Resume" />
                                </div>
                              
                                <div class="mb-3 col-md-6">
                                <b> <label> Permanant_address_proof </label></b>


                                    <input type="text" name="employee_permanant_address_proof" value={data.employee_permanant_address_proof} onChange={handleInputChange} class="form-control" placeholder="Permanant Address Proof" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Local_address_proof </label></b>

                                    <input type="text" name="employee_local_address_proof" value={data.employee_local_address_proof} onChange={handleInputChange} class="form-control" placeholder="Local Address Proof" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Reference_one_name </label></b>

                                    <input type="text" name="employee_reference_one_name" value={data.employee_reference_one_name} onChange={handleInputChange} class="form-control" placeholder="Reference One Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Reference_one_mobile </label></b>

                                    <input type="text" name="employee_reference_one_mobile" value={data.employee_reference_one_mobile} onChange={handleInputChange} class="form-control" placeholder="Reference One Mobile" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Reference_two_name </label></b>

                                    <input type="text" name="employee_reference_two_name" value={data.employee_reference_two_name} onChange={handleInputChange} class="form-control" placeholder="Reference Two Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b> <label> Reference_two_mobile </label></b>

                                    <input type="text" name="employee_reference_two_mobile" value={data.employee_reference_two_mobile} onChange={handleInputChange} class="form-control" placeholder="Reference Two Mobile" />
                                </div>

                            </div>
                            <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>

                            <div class="col-md-12">
                                <button type="submit">EDit here</button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default ModalBox;