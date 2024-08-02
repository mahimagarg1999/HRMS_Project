import React, { useState, useEffect } from 'react';
import './Employee.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditEmployeeModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import EmployeeDataModal from './EmployeeDataModal'
let downloadCount = 0;

// import lib

const EmployeeModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [message, setMessage] = useState('');

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const [ids, setIds] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [idproof, setidproofFile] = useState('');
    const [marksheet, setmarksheet] = useState('');
    const [e_letter, seteletter] = useState('');
    const [pancard, setPancard] = useState('');
    const [image, setImage] = useState('');
    const [query, setQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalData, setModalData] = useState(null);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const openModal = (employeeId) => {
        console.log('employeeId', employeeId)
        setModalIsOpen(true);
        setSelectedEmployeeId(employeeId);

    };
    const handleSort = async (column) => {
        console.log("Sort column clicked:", column);
        console.log("Current sort direction:", sortDirection);
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

            try {
                const response = await axios.get(`${BASE_API_URL}employee/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // If a new column is clicked, set it as the sorting column and reset the direction
            setSortColumn(column);
            setSortDirection('asc');
        }
    };


    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setIds(prevIds => [...prevIds, id]);
        } else {
            setIds(prevIds => prevIds.filter(prevId => prevId !== id));
        }
    };
    const Deletemulti = async () => {
        const data = {
            "ids": ids
        };
        console.log('ids', data);

        try {
            const response = await axios.delete(`${BASE_API_URL}employee/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([])
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (!formData.employee_code.trim()) {
            newErrors.employee_code = "employee_code is required";
            isValid = false;
        }

        if (!formData.employee_first_name.trim()) {
            newErrors.employee_first_name = "employee_first_name is required";
            isValid = false;
        }

        if (!formData.employee_last_name.trim()) {
            newErrors.employee_last_name = "employee_last_name is required";
            isValid = false;
        }

        if (!formData.employee_mobile.trim()) {
            newErrors.employee_mobile = "Employee mobile number is required";
            isValid = false;
        } else {
            const mobileNumberRegex = /^\d{10}$/; // Match exactly 10 digits
            if (!mobileNumberRegex.test(formData.employee_mobile.trim())) {
                newErrors.employee_mobile = "Please enter a valid 10-digit mobile number";
                isValid = false;
            }
        }

        if (!formData.employee_email.trim()) {
            newErrors.employee_email = "employee_email is required";
            isValid = false;
        }

        if (!formData.employee_password.trim()) {
            newErrors.employee_password = "employee_password is required";
            isValid = false;
        }

        if (!formData.employee_experience.trim()) {
            newErrors.employee_experience = "employee_experience is required";
            isValid = false;
        }
        if (!formData.employee_skills.length) {
            newErrors.employee_skills = "employee_skills is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const [errors, setErrors] = useState({
        employee_code: "",
        employee_first_name: "",
        employee_last_name: "",
        employee_mobile: "",
        employee_email: "",
        employee_password: "",
        employee_experience: "",
        employee_skills: ""


    });

    const [formData, setFormData] = useState({});
    const handleFileChange = (e) => {
        console.log('e', e); // Check if file is valid

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
                    console.log(selectedFile)
                }
                else if (e.target && e.target.name === 'mark') {
                    setmarksheet(reader.result);
                }
                else if (e.target && e.target.name === 'pancard') {
                    setPancard(reader.result);
                }
                else if (e.target && e.target.name === 'image') {
                    setImage(reader.result);
                    console.log('image', image)

                }
                else {
                    seteletter(reader.result);
                    console.log('', e_letter)
                }
            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };
    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file instanceof Blob) {
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             if (e.target && e.target.name === 'id') {
    //                 setidproofFile(reader.result);
    //             } else if (e.target && e.target.name === 'resume_file') {
    //                 setSelectedFile(reader.result);
    //             } else if (e.target && e.target.name === 'mark') {
    //                 setmarksheet(reader.result);
    //             } else if (e.target && e.target.name === 'pancard') {
    //                 setPancard(reader.result);
    //             } else if (e.target && e.target.name === 'image') {
    //                 setImage(reader.result);
    //             } else {
    //                 seteletter(reader.result);
    //             }
    //             console.log('idproof', idproof);
    //             console.log('selectedFile', selectedFile);
    //         };

    //         // reader.readAsDataURL(file);
    //         if (e.target.name === 'image') {
    //             reader.readAsDataURL(file); // Read image files as Data URL
    //         } else {
    //             reader.readAsArrayBuffer(file); // Read non-image files as ArrayBuffer
    //         }
    //     } else {
    //         console.error("The selected file is not a Blob.");
    //     }
    // };

    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}employee/list`);

            console.log(response.data.data); // Handle the response as needed
            settableData(response.data.data)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [togle]);

    const openPopup = () => {
        setMessage('');
        setFormData('');
        let formDataNew = {
            employee_code: '',
            employee_first_name: '',
            employee_last_name: '',
            employee_mobile: '',
            employee_alternate_mobile: '',
            employee_email: '',
            employee_password: '',
            employee_address: '',
            employee_city: '',
            employee_state: '',
            employee_other_info: '',
            employee_dob: '',
            employee_doj: '',
            employee_skills: [],
            employee_experience: '',
            employee_resume: '',
            employee_id_proof: '',
            employee_permanant_address_proof: '',

            employee_local_address_proof: '',
            employee_reference_one_name: '',
            employee_reference_one_mobile: '',
            employee_reference_two_name: '',
            employee_reference_two_mobile: '',

            employee_pan_card: '',
            employee_marksheet: '',
            employee_experience_letter: '',
            image: '',
            resumePdfName: "pdf",
            proofPdfName: "pdf",
            panPdfName: "pdf",
            marksheetPdfName: "pdf",
            experiencePdfName: "pdf",
            imageName: "png"
        }
        setFormData(formDataNew);
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors({
            ...errors,
            [name]: "",
        });
    };


    // Function to handle form submission
    const handleSubmit = async (e) => {
        console.log("check resume", selectedFile);
        e.preventDefault();
        formData.employee_skills = selectedSkills; // Add selected skills to form data
        formData.employee_resume = selectedFile;
        formData.employee_id_proof = idproof;
        formData.employee_marksheet = marksheet;
        formData.employee_pan_card = pancard;
        formData.employee_experience_letter = e_letter;
        formData.employee_marksheet = marksheet;
        formData.image = image.split(',')[1]

        // mydata.image.split(',')[1]

        // Handle form submission here, for example, send data to backend or perform validation
        console.log('Form Data:', formData);

        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}employee/create`, formData);
                settogle(!togle);
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg);
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const DeleteData = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = axios.delete(`${BASE_API_URL}employee/delete?id=${id}`)

                console.log(response.data); // Handle the response as needed
                settogle(!togle)

            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // User canceled the action
            console.log('Deletion canceled');
        } console.log('', id)

    }

    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}employee/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}employee/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
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
        if (!selectedSkills.includes(skill)) {
            const updatedSelectedSkills = [...selectedSkills, skill];
            setSelectedSkills(updatedSelectedSkills);
            setAvailableSkills(availableSkills.filter(item => item !== skill));
            setFormData({ ...formData, employee_skills: updatedSelectedSkills });

            // Clear the error for requiredSkills if at least one skill is selected
            if (updatedSelectedSkills.length > 0) {
                setErrors((prevErrors) => {
                    const { employee_skills, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setFormData({ ...formData, employee_skills: updatedSelectedSkills });

        // Set the error for requiredSkills if no skills are left
        if (updatedSelectedSkills.length === 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                employee_skills: "At least one skill is required"
            }));
        }
    };
    const SkillTag = ({ skill, onRemove }) => (
        <div className="skill-tag">
            {skill}
            <button onClick={() => onRemove(skill)}>x</button>
        </div>
    );
    const convertToCSV = (data) => {
        if (data.length === 0) {
            return '';
        }
        // Get headers
        const header = Object.keys(data[0]).join(',');

        // Convert rows
        const rows = data.map(row => {
            return Object.values(row).map(value => {
                // Check if the value is an array (like candidate_skills)
                if (Array.isArray(value)) {
                    return `"${value.join(', ')}"`; // Join array elements into a single string with commas
                }
                return value;
            }).join(',');
        }).join('\n');

        return `${header}\n${rows}`;
    };

    const downloadCSV = (csv, filename) => {
        fetch(`${BASE_API_URL}employee/export-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ csvData: csv, filename: filename }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.path) {
                    if (window.confirm('Data exported successfully. Do you want to download the file now?')) {

                        // Construct the full URL for the download
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url); // Clean up the URL.createObjectURL resource
                    }
                } else {
                    console.error('Failed to download CSV');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    // const openView = () => {
    //     const csv = convertToCSV(tableData);
    //     downloadCSV(csv, 'data.csv');
    // };
    const openView = () => {
        const csv = convertToCSV(tableData);
        downloadCount += 1; // Increment the download count
        const filename = `emp_data${downloadCount}.csv`; // Dynamic filename
        downloadCSV(csv, filename);
    };

    // Import the data
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_API_URL}employee/import-data`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Data imported successfully', response.data);
            if (window.confirm('Data imported successfully. Do you want to fetch the data now?')) {
                // Call function to fetch data here
                fetchData();
            }
        } catch (error) {
            console.error('Error importing data:', error);
        }
    };
    const openModal1 = (candidateId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [candidateId]: true // Set modal open for this recruitment ID
        }));
        fetchEmployeeData(candidateId);
    };
    const closeModal1 = (candidateId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [candidateId]: false // Set modal closed for this recruitment ID
        }));
    };

    const fetchEmployeeData = async (id) => {
        try {
            const response = await axios.get(`${BASE_API_URL}employee/get?employeeid=${id}`);
            setModalData(response.data); // Ensure response.data contains the correct data structure
            setModalIsOpen1(prevState => ({
                ...prevState,
                [id]: true // Set modal open for this recruitment ID
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    {/* <h1 className='headerData'>Welcome To Employee Page</h1> */}
                    <h1 className='headerData'>WELCOME TO EMPLOYEE PAGE</h1>
                </div>
                <div >
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body text-center">

                                    <div className='icon_manage'>
                                        <button onClick={openView} title="View Data" className='button_design_view'>
                                            Export&nbsp; <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="button_design" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>
                                        <span> <button className="button_design" onClick={() => { Deletemulti() }}    >
                                            MultiDel&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                                        </button></span></div>

                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div class="row">
                                                        <div class="col-md-6 offset-md-3">
                                                            <div class="signup-form">


                                                                <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Create Your Account</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Code*</b></label>
                                                                            <input type="text" name="employee_code" value={formData.employee_code} onChange={handleInputChange} class="form-control" placeholder="Emp Code" />
                                                                            {errors.employee_code && <span className="error" style={{ color: 'red' }}>{errors.employee_code}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee First Name*</b></label>
                                                                            <input type="text" name="employee_first_name" value={formData.employee_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                                                            {errors.employee_first_name && <span className="error" style={{ color: 'red' }}>{errors.employee_first_name}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Last Name*</b></label>
                                                                            <input type="text" name="employee_last_name" value={formData.employee_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                                                            {errors.employee_last_name && <span className="error" style={{ color: 'red' }}>{errors.employee_last_name}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Mobile No*</b></label>
                                                                            <input type="text" name="employee_mobile" value={formData.employee_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                                                            {errors.employee_mobile && <span className="error" style={{ color: 'red' }}>{errors.employee_mobile}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Alternate Mo. No.</b></label>
                                                                            <input type="text" name="employee_alternate_mobile" value={formData.employee_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Email*</b></label>
                                                                            <input type="email" name="employee_email" value={formData.employee_email} onChange={handleInputChange} class="form-control" placeholder="Email" />
                                                                            {errors.employee_email && <span className="error" style={{ color: 'red' }}>{errors.employee_email}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Password*</b></label>
                                                                            <input type="text" name="employee_password" value={formData.employee_password} onChange={handleInputChange} class="form-control" placeholder="Password" />
                                                                            {errors.employee_password && <span className="error" style={{ color: 'red' }}>{errors.employee_password}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Address</b></label>
                                                                            {/* <input type="text" name="employee_address" value={formData.employee_address} onChange={handleInputChange} class="form-control" placeholder="Address" /> */}
                                                                            <textarea name="employee_address" value={formData.employee_address} onChange={handleInputChange} class="form-control" placeholder="Address"></textarea>

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee City</b></label>
                                                                            <input type="text" name="employee_city" value={formData.employee_city} onChange={handleInputChange} class="form-control" placeholder="City" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee State</b></label>
                                                                            <input type="text" name="employee_state" value={formData.employee_state} onChange={handleInputChange} class="form-control" placeholder="State" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Other Info</b></label>
                                                                            <input type="text" name="employee_other_info" value={formData.employee_other_info} onChange={handleInputChange} class="form-control" placeholder="Employee Info" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6"  >
                                                                            <label><b>Date of Birth</b></label>
                                                                            <input type="date" name="employee_dob" value={formData.employee_dob} onChange={handleInputChange} class="form-control" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6" >
                                                                            <label ><b>Date of Joining</b></label>
                                                                            <input type="date" name="employee_doj" value={formData.employee_doj} onChange={handleInputChange} class="form-control" />
                                                                        </div>
                                                                        {/* <div className="row"> */}
                                                                        {/* <div className="mb-3 col-md-6">
                                                                            <label><b>Skills</b></label>
                                                                            <select className="form-control" multiple size="3">
                                                                                {availableSkills.map(skill => (
                                                                                    <option key={skill} onClick={() => handleAddSkill(skill)}>
                                                                                        {skill}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Selected Skills</b></label>
                                                                            <div className="selected-skills">
                                                                                {selectedSkills.map(skill => (
                                                                                    <SkillTag key={skill} skill={skill} onRemove={handleRemoveSkill} />
                                                                                ))}
                                                                            </div>
                                                                        </div> */}
                                                                        {/* <div className="mb-3 col-md-12">
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

                                                                            {errors.employee_skills && <span className="error" style={{ color: 'red' }}>{errors.employee_skills}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Experience*</b></label>
                                                                            {/* <input type="text" name="employee_experience" value={formData.employee_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" /> */}
                                                                            <select
                                                                                name="employee_experience"
                                                                                value={formData.employee_experience}
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



                                                                            {errors.employee_experience && <span className="error" style={{ color: 'red' }}>{errors.employee_experience}</span>}
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Resume</b></label>
                                                                            <input type="file" onChange={handleFileChange} class="form-control" placeholder='resume file' name="resume_file" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Id Proof</b></label>

                                                                            <input type="file" name="id" onChange={handleFileChange} class="form-control" placeholder="Id Proof" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Highest Education</b></label>
                                                                            <input type="file" name="mark" onChange={handleFileChange} class="form-control" placeholder="Highest Education" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Pan Card</b></label>
                                                                            <input type="file" name="pancard" onChange={handleFileChange} class="form-control" placeholder="Pan Card" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Image</b></label>
                                                                            <input type="file" name="image" onChange={handleFileChange} class="form-control" placeholder="Image" />
                                                                        </div>


                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b> Expirence Letter</b></label>
                                                                            <input type="file" name="e_letter" onChange={handleFileChange} class="form-control" placeholder="Experience Letter" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Address Proof</b></label>

                                                                            <input type="text" name="employee_permanant_address_proof" value={formData.employee_permanant_address_proof} onChange={handleInputChange} class="form-control" placeholder="Permanant address proof" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Local Address Proof</b></label>
                                                                            <input type="text" name="employee_local_address_proof" value={formData.employee_local_address_proof} onChange={handleInputChange} class="form-control" placeholder="Local address proof" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>First Reference Name</b></label>
                                                                            <input type="text" name="employee_reference_one_name" value={formData.employee_reference_one_name} onChange={handleInputChange} class="form-control" placeholder="Reference One Name" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>First Reference Mobile No.</b></label>
                                                                            <input type="text" name="employee_reference_one_mobile" value={formData.employee_reference_one_mobile} onChange={handleInputChange} class="form-control" placeholder="Reference One Mobile" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Second Reference Name</b></label>
                                                                            <input type="text" name="employee_reference_two_name" value={formData.employee_reference_two_name} onChange={handleInputChange} class="form-control" placeholder="Reference Two Name" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Second Reference Mobile No.</b></label>
                                                                            <input type="text" name="employee_reference_two_mobile" value={formData.employee_reference_two_mobile} onChange={handleInputChange} class="form-control" placeholder="Reference Two Mobile" />
                                                                        </div>


                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Employee</button>
                                                                    </div>
                                                                    <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>       </div>
                                        </div>
                                    )}
                                </div>
                                <div class="containerOnce">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={handleChange}
                                        placeholder="Search "
                                    />&nbsp;
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileUpload}
                                    />
                                </div>
                                <div className="table-responsive">

                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>

                                                <th scope="col" onClick={() => handleSort('employee_code')}><b>Emp Code</b>{sortColumn === 'employee_code' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('employee_first_name')}><b>Name </b>{sortColumn === 'employee_first_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('employee_email')}><b>Email </b>{sortColumn === 'employee_email' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('employee_mobile')}><b> Mobile</b> {sortColumn === 'employee_mobile' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th  ><b> Image</b>  </th>
                                                <th scope="col" onClick={() => handleSort('employee_resume')}><b> Resume</b> {sortColumn === 'employee_resume' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" ><b>Actions</b></th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                    </label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>

                                                    <td>{data.employee_code}</td>
                                                    <td>{data.employee_first_name}&nbsp;{data.employee_last_name}</td>
                                                    <td>{data.employee_email}</td>
                                                    <td>{data.employee_mobile}</td>
                                                    <td>
                                                        <img
                                                            src={`http://localhost:5000/${data.image}`} // Image URL
                                                            alt="Employee"
                                                            style={{
                                                                width: '80px',
                                                                height: '80px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover'
                                                            }} // Adjust size as needed
                                                        />
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="editButton"
                                                            onClick={() => window.open(`http://localhost:5000/${data.employee_resume}`, '_blank')}
                                                            style={{ color: 'rgb(40, 118, 154)', background: 'none', border: 'none', cursor: 'pointer' }} title="Show Pdf"
                                                        >
                                                            <FontAwesomeIcon icon={faFilePdf} />

                                                        </button>
                                                    </td>

                                                    <td>

                                                        <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                        <button
                                                            className="editButton"
                                                            onClick={() => openModal1(data._id)}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <label className="customcheckbox">
                                                            {/* <input type="checkbox" className="listCheckbox" onChange={(e) => handleCheckboxChange(e, data._id)} /> */}
                                                            <input
                                                                type="checkbox"
                                                                className="listCheckbox"
                                                                checked={ids.includes(data._id)}
                                                                onChange={(e) => handleCheckboxChange(e, data._id)}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <ModalBox isOpen={modalIsOpen} employeeId={selectedEmployeeId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                    {modalIsOpen1[data._id] && (
                                                        <EmployeeDataModal isOpen1={modalIsOpen1[data._id]} onRequestClose={() => closeModal1(data._id)} data={modalData} />
                                                    )}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {tableData.length > itemsPerPage && (
                                    <div className="pagination-container">
                                        <ReactPaginate
                                            pageCount={pageCount}
                                            onPageChange={handlePageChange}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div >

                <div>

                </div>


            </div >
            <Footer />        </>
    );
}

export default EmployeeModule;
