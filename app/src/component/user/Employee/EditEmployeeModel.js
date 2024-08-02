// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import './Employee.css'
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, employeeId }) => {
    const [selectedFile, setSelectedFile] = useState('');
    const [idproof, setidproofFile] = useState('');
    const [marksheet, setmarksheet] = useState('');
    const [e_letter, seteletter] = useState('');
    const [pancard, setPancard] = useState('')
    const [data, setData] = useState([]);
    const [message, setMessage] = useState('');
    const [image, setImage] = useState('');
    const [newdata, setnewdata] = useState('');
    // Define available and selected skills
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
 

    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file instanceof Blob) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             if (e.target.name === 'image') {
    //                 setImage(reader.result); // Set the image Data URL
    //             } else if (e.target.name === 'id') {
    //                 setidproofFile(reader.result);
    //             } else if (e.target.name === 'resume_file') {
    //                 setSelectedFile(reader.result);
    //             } else if (e.target.name === 'mark') {
    //                 setmarksheet(reader.result);
    //             } else if (e.target.name === 'pancard') {
    //                 setPancard(reader.result);
    //             } else if (e.target.name === 'e_letter') {
    //                 seteletter(reader.result);
    //             }
    //         };
    //         if (e.target.name === 'image') {
    //             reader.readAsDataURL(file); // Read image files as Data URL
    //         } else {
    //             reader.readAsArrayBuffer(file); // Read non-image files as ArrayBuffer
    //         }
    //     } else {
    //         console.error("The selected file is not a Blob.");
    //     }
    // };

    // const handleFileChange = (e) => {
    //     console.log('e', e); // Check if file is valid

    //     const file = e.target.files[0];
    //     console.log('Selected file:', file); // Check if file is valid

    //     if (file) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             console.log('File result:', reader.result); // Check what is being read
    //             if (e.target.name === 'image') {
    //                 setImage(reader.result);
    //             } else if (e.target.name === 'id') {
    //                 setidproofFile(reader.result);
    //             } else if (e.target.name === 'resume_file') {
    //                 setSelectedFile(reader.result);
    //             } else if (e.target.name === 'mark') {
    //                 setmarksheet(reader.result);
    //             } else if (e.target.name === 'pancard') {
    //                 setPancard(reader.result);
    //             } else if (e.target.name === 'e_letter') {
    //                 seteletter(reader.result);
    //             }
    //         };

    //         if (e.target.name === 'image') {
    //             reader.readAsDataURL(file); // For images
    //         } else {
    //             reader.readAsArrayBuffer(file); // For other files
    //         }
    //     } else {
    //         console.error("The selected file is not a valid file.");
    //     }
    // };




    useEffect(() => {
        if (isOpen && employeeId) {
            setMessage("")
            setnewdata('')
            setSelectedFile('')
            setImage('')
            setMessage('')
            setmarksheet('')
            setPancard('')
            setidproofFile('')
            seteletter('')
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}employee/get?employeeid=${employeeId}`);
                    const employeeData = response.data.data;
                    // delete employeeData.employee_resume;

                    setData(employeeData);
                    setSelectedSkills(employeeData.employee_skills || []);
                    setAvailableSkills(availableSkills.filter(skill => !employeeData.employee_skills.includes(skill)));
                } catch (error) {
                    console.error('Error fetching employee data:', error);
                }
            };
            fetchData();
        }
    }, [isOpen, employeeId]);

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
        console.log("e->", e);
        const file = e.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (e.target.name === 'image') {
                    setImage(reader.result); // Set the image Data URL
                } else {
                    const base64String = arrayBufferToBase64(reader.result);
                    if (e.target.name === 'id') {
                        setidproofFile(base64String);
                    } else if (e.target && e.target.name === 'resume_file') {
                        setSelectedFile(base64String);
                        console.log('selectfile', base64String);
                    } else if (e.target.name === 'mark') {
                        setmarksheet(base64String);
                    } else if (e.target.name === 'pancard') {
                        setPancard(base64String);
                    } else if (e.target.name === 'e_letter') {
                        seteletter(base64String);
                    }
                }
            };
            if (e.target.name === 'image') {
                reader.readAsDataURL(file); // Read image files as Data URL
            } else {
                reader.readAsArrayBuffer(file); // Read non-image files as ArrayBuffer
            }
        } else {
            console.error("The selected file is not a Blob.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const mydata = { ...newdata, employee_skills: selectedSkills, _id: data._id };

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
        if (image !== '') {
            mydata.image = image
            mydata.image = mydata.image.split(',')[1]
            console.log("mydata.image", mydata.image)
        }
        const pdfdoc = {
            resumePdfName: "pdf",
            proofPdfName: "pdf",
            panPdfName: "pdf",
            marksheetPdfName: "pdf",
            experiencePdfName: 'pdf',
            imageName: 'png',
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
            // setImage('');
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
        setData({ ...data, employee_skills: updatedSelectedSkills });
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setData({ ...data, employee_skills: updatedSelectedSkills });
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
            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />
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
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.employee_id_proof}`} target="_blank">{data.employee_id_proof == '' ? '' : 'Show Id Proof'}</a>

                                    {/* {setidproofFile && <p>Selected PDF: {setidproofFile.name}</p>} */}
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Resume</b></label>
                                    <input type="file" name="resume_file" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.employee_resume}`} target="_blank">{data.employee_resume == '' ? '' : 'Show Resume'}</a>

                                    {/* {setidproofFile && <p>Selected PDF: {setidproofFile.name}</p>} */}
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Highest Education</b></label>
                                    <input type="file" name="mark" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.employee_marksheet
                                        }`} target="_blank">{data.employee_marksheet == '' ? '' : 'Show Marksheet'
                                        }</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Pan Card</b></label>
                                    <input type="file" name="pancard" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.employee_pan_card
                                        }`} target="_blank">{data.employee_pan_card == '' ? '' : 'Show Pan Card'
                                        }</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b> Expirence Letter</b></label>
                                    <input type="file" name="e_letter" onChange={handleFileChange} accept=".pdf" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.employee_experience_letter
                                        }`} target="_blank">{data.employee_experience_letter == '' ? '' : 'Show Experience Letter'
                                        }</a>

                                </div>
                                <div class="mb-3 col-md-6">
                                    {/* <label><b>Image</b></label>
                                    <input type="file" name="image" onChange={handleFileChange} accept=".png" />
                                    <a style={{ color: 'green' }} href={`http://localhost:5000/${data.image
                                        }`} target="_blank">{data.image == '' ? '' : 'Show image'
                                        }</a> */}

                                    <label><b>Image</b></label>
                                    <input type="file" name="image" onChange={handleFileChange} accept=".png" />
                                    {data.image && (
                                        <a style={{ color: 'green' }} href={`http://localhost:5000/${data.image}`} target="_blank" rel="noopener noreferrer">
                                            {data.image ? 'Show Image' : ''}
                                        </a>
                                    )}

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
                                {/* <div class="mb-3 col-md-6">
                                    <label><b>Employee Skills</b></label>
                                    <input type="text" name="employee_skills" value={data.employee_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
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
                                    <label><b>Employee Experience</b></label>
                                    <select
                                        name="employee_experience"
                                        value={data.employee_experience}
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
                            {/* <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span> */}
                            {message && <div className="mt-3 alert alert-success">{message}</div>}

                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default ModalBox;