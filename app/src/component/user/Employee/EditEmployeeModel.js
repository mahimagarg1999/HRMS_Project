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
    const [pancard, setPancard] = useState('');
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
                    setPancard(reader.result);
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
            setSelectedFile('')
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
        if (selectedFile !== '') {
            mydata.employee_resume = selectedFile
        }
        if (idproof !== '') {
            mydata.employee_id_proof = idproof
        } if (marksheet !== '') {
            mydata.employee_marksheet = marksheet
        } if (pancard !== '') {
            mydata.employee_pan_card = pancard
        } if (e_letter !== '') {
            mydata.employee_experience_letter = e_letter
        }



        const pdfdoc = {
            resumePdfName: "pdf",
            proofPdfName: "pdf",
            panPdfName: "pdf",
            marksheetPdfName: "pdf",
            experiencePdfName: 'pdf',
            id: employeeId
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
        >
            <button onClick={onRequestClose}>Close</button>

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.employee_first_name} Profile</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Code</b></label>
                                    <input type="text" name="employee_code" value={data.employee_code} onChange={handleInputChange} class="form-control" placeholder="Emp Code" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee First Name</b></label>
                                    <input type="text" name="employee_first_name" value={data.employee_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Last Name</b></label>
                                    <input type="text" name="employee_last_name" value={data.employee_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Mobile No</b></label>
                                    <input type="text" name="employee_mobile" value={data.employee_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Alternate Mobile No</b></label>
                                    <input type="text" name="employee_alternate_mobile" value={data.employee_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Email</b></label>
                                    <input type="email" name="employee_email" value={data.employee_email} onChange={handleInputChange} class="form-control" placeholder="Email" />
                                </div>


                                <div class="mb-3 col-md-6">
                                    <label><b>Id Proof</b></label>
                                    <input type="file" name="id" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_id_proof}`} target="_blank">{data.employee_id_proof == '' ? '' : 'Show Id Proof'}</a>

                                    {/* {setidproofFile && <p>Selected PDF: {setidproofFile.name}</p>} */}
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Resume</b></label>
                                    <input type="file" name="resume_file" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_resume}`} target="_blank">{data.employee_resume == '' ? '' : 'Show Resume'}</a>

                                    {/* {setidproofFile && <p>Selected PDF: {setidproofFile.name}</p>} */}
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Highest Education</b></label>
                                    <input type="file" name="mark" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_marksheet
                                        }`} target="_blank">{data.employee_marksheet == '' ? '' : 'Show Marksheet'
                                        }</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Pan Card</b></label>
                                    <input type="file" name="pancard" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_pan_card
                                        }`} target="_blank">{data.employee_pan_card == '' ? '' : 'Show Pan Card'
                                        }</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b> Expirence Letter</b></label>
                                    <input type="file" name="e_letter" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'red' }} href={`http://localhost:5000/${data.employee_experience_letter
                                        }`} target="_blank">{data.employee_experience_letter == '' ? '' : 'Show Experience Letter'
                                        }</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Password</b></label>
                                    <input type="text" name="employee_password" value={data.employee_password} onChange={handleInputChange} class="form-control" placeholder="Password" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Address</b></label>
                                    <input type="text" name="employee_address" value={data.employee_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee City</b></label>
                                    <input type="text" name="employee_city" value={data.employee_city} onChange={handleInputChange} class="form-control" placeholder="City" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee State</b></label>
                                    <input type="text" name="employee_state" value={data.employee_state} onChange={handleInputChange} class="form-control" placeholder="State" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Other Info</b></label>
                                    <input type="text" name="employee_other_info" value={data.employee_other_info} onChange={handleInputChange} class="form-control" placeholder="Employee Other Info" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Date of Birth</b></label>
                                    <input type="date" name="employee_dob" value={data.employee_dob} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Date of Joining</b></label>
                                    <input type="date" name="employee_doj" value={data.employee_doj} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Skills</b></label>
                                    <input type="text" name="employee_skills" value={data.employee_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Experience</b></label>
                                    <input type="text" name="employee_experience" value={data.employee_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
                                </div>

                                <div class="mb-3 col-md-6">
                                    <label><b>Address Proof</b></label>
                                    <input type="text" name="employee_permanant_address_proof" value={data.employee_permanant_address_proof} onChange={handleInputChange} class="form-control" placeholder="Permanant Address Proof" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Local Address Proof</b></label>
                                    <input type="text" name="employee_local_address_proof" value={data.employee_local_address_proof} onChange={handleInputChange} class="form-control" placeholder="Local Address Proof" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>First Reference Name</b></label>
                                    <input type="text" name="employee_reference_one_name" value={data.employee_reference_one_name} onChange={handleInputChange} class="form-control" placeholder="Reference One Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>First Reference Mobile No.</b></label>
                                    <input type="text" name="employee_reference_one_mobile" value={data.employee_reference_one_mobile} onChange={handleInputChange} class="form-control" placeholder="Reference One Mobile" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Second Reference Name</b></label>
                                    <input type="text" name="employee_reference_two_name" value={data.employee_reference_two_name} onChange={handleInputChange} class="form-control" placeholder="Reference Two Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Second Reference Mobile No.</b></label>
                                    <input type="text" name="employee_reference_two_mobile" value={data.employee_reference_two_mobile} onChange={handleInputChange} class="form-control" placeholder="Reference Two Mobile" />
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