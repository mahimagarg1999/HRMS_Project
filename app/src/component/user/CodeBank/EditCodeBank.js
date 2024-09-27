// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const ModalBox = ({ isOpen, onRequestClose, CodebankId }) => {
    const [data, setData] = useState([]);
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
     const [newdata, setnewdata] = useState('');
     const [skillsList, setSkillsList] = useState([]);

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
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();
            if (['pdf', 'txt'].includes(extension)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result;  // Base64 encoded string
                    setCode(base64String);  // Save the base64 data in the state
                    setData(prevState => ({
                        ...prevState,
                        code_file: base64String,  // Include base64 data in the form
                        codebankPdfName: file.name  // Save the file name dynamically
                    }));
                };
                reader.readAsDataURL(file);  // Convert file to base64
            } else {
                console.error("Only PDF and TXT files are allowed");
            }
        } else {
            console.error("No file selected.");
        }
    };
    
   
    useEffect(() => {
        if (isOpen && CodebankId) {
            setMessage("");
            setnewdata('');
            setCode("");
            const fetchData = async () => {
                try {
                    const response = await axios.get(`${BASE_API_URL}codebank/get?codebankid=${CodebankId}`);
                    const candidateData = response.data.data;
                    setData(candidateData);
                 } catch (error) {
                    console.error('Error fetching candidate data:', error);
                }
            };
            fetchData();
        }
    }, [isOpen, CodebankId]);
     
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
    const handleCodeChange = (newValue) => {
        console.log('New code value:', newValue); // Debugging
        setData(prevData => ({
            ...prevData,
            code: newValue
        }));
    };
    
    useEffect(() => {
        console.log('Data:', data); // Check data.state for debugging
    }, [data]);
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = {
            ...data,
            id: CodebankId,
            code_file: code || data.code_file,  // Use uploaded file or existing file
            codebankPdfName: data.codebankPdfName  // File name should be sent
        };
    
        try {
            const response = await axios.put(`${BASE_API_URL}codebank/edit`, formData);
            console.log(response.data);
            setMessage(response.data.msg);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    
    
   
    const fetchSkills = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}skills/get_skills`);
            console.log("Fetched Skills Data:", response.data);

            if (response.data.success) {
                // Set the skills list
                setSkillsList(response.data.data); // Update skills list state
                // Optionally set the default skill if needed
                setData(prevData => ({
                    ...prevData,
                    skills: response.data.data[0]?.skills || '' // Set the default skill
                }));
            }
        } catch (error) {
            console.error("Error fetching skills data:", error);
        }
    };
    useEffect(() => {
        fetchSkills();
    }, []);
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
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.title} profile</h4>

                            </div>
                            <div className="row">
                            <div className="mb-3 col-md-6">
                                                                            <label><b>Skills*</b></label>
                                                                            <select
                                                                                name="skills"
                                                                                value={data.skills}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Skill</option>
                                                                                {skillsList.map(skill => (
                                                                                    <option key={skill.skills} value={skill.skills}>
                                                                                        {skill.skills}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                         </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Title</b></label>
                                    <input type="text" name="title" value={data.title} onChange={handleInputChange} className="form-control" placeholder="Title" />
                                </div>
                               

                                <div className="mb-3">
                                    <ReactQuill
                                    name="code"
                                        value={data.code || ''}
                                        onChange={handleCodeChange}
                                        theme="snow"
                                    />
                                </div>
                             
 

                                <div className="mb-3 col-md-6">
                                    <label>Code file</label>
                                    <input
                                                                                type="file"
                                                                                accept=".pdf, .txt"
                                                                                onChange={handleFileChange}
                                                                                className="form-control"
                                                                                name="code_file"
                                                                            />                                     
<a style={{ color: 'green' }} href={`http://localhost:5000/${data.code_file}`} target="_blank">
  {data.code_file ? 'Show Document proof' : ''}
</a>
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













 