import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faEnvelope, faTrash, faSortUp, faSortDown, faPlusCircle, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CandidateDataModal from './CandidateByDataModal.js'

let downloadCount = 0;

// import lib

const CandidateByApiModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [message, setMessage] = useState('');

    const [modalIsOpen, setModalIsOpen] = useState(false);
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
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([]); // Initialize data with an empty array

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const handleSort = async (column) => {
        console.log("Sort column clicked:", column);
        console.log("Current sort direction:", sortDirection);
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

            try {
                const response = await axios.get(`${BASE_API_URL}candidatethirdparty/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
            const response = await axios.delete(`${BASE_API_URL}candidatethirdparty/multi-delete`, {
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
        if (!formData.student_name.trim()) {
            newErrors.student_name = "student_name is required";
            isValid = false;
        }

        if (!formData.student_email.trim()) {
            newErrors.student_email = "student_email is required";
            isValid = false;
        }

        if (!formData.student_mobile.trim()) {
            newErrors.student_mobile = "student_mobile number is required";
            isValid = false;
        } else {
            const mobileNumberRegex = /^\d{10}$/; // Match exactly 10 digits
            if (!mobileNumberRegex.test(formData.student_mobile.trim())) {
                newErrors.student_mobile = "Please enter a valid 10-digit mobile number";
                isValid = false;
            }
        }

        if (!formData.student_qualification.trim()) {
            newErrors.student_qualification = "student_qualification is required";
            isValid = false;
        }

        if (!formData.student_exp.trim()) {
            newErrors.student_exp = "student_exp is required";
            isValid = false;
        }

        if (!formData.student_position.trim()) {
            newErrors.student_position = "student_position is required";
            isValid = false;
        }
        if (!formData.student_intdate.length) {
            newErrors.student_intdate = "student_intdate is required";
            isValid = false;
        }
        if (!formData.student_time.length) {
            newErrors.student_time = "student_time is required";
            isValid = false;
        }
        if (!formData.student_resume.length) {
            newErrors.student_resume = "student_resume is required";
            isValid = false;
        }
        if (!formData.date_time.length) {
            newErrors.date_time = "date_time is required";
            isValid = false;
        }
        if (!formData.status.length) {
            newErrors.status = "status is required";
            isValid = false;
        }
        if (!formData.technologies.length) {
            newErrors.technologies = "technologies is required";
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
        student_name: "",
        student_email: "",
        student_mobile: "",
        student_qualification: "",
        student_exp: "",
        student_position: "",
        student_intdate: "",
        student_time: "",
        student_resume: "",
        date_time: "",
        status: "",
        technologies: "",


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


    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}candidatethirdparty/listing`);

            console.log(response.data.data.data); // Handle the response as needed
            settableData(response.data.data.data)

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
            student_name: '',
            student_email: '',
            student_mobile: '',
            student_qualification: '',
            student_exp: '',
            student_position: '',
            student_intdate: '',
            student_time: '',
            student_resume: '',
            date_time: '',
            status: '',
            technologies: '',
            resumePdfName: "pdf",

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

        formData.student_resume = selectedFile;

        // Handle form submission here, for example, send data to backend or perform validation
        console.log('Form Data:', formData);

        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}candidatethirdparty/create`, formData);
                settogle(!togle);
                console.log(response.data); // Handle the response as needed
                
                setMessage(response.data.msg);
                if (response.data.success) {
                    closePopup();
                }
                setTimeout(() => setMessage(''), 3000);

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
                const response = axios.delete(`${BASE_API_URL}candidatethirdparty/deleting?id=${id}`)

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
        const searchTerm = event.target.value;
        setQuery(searchTerm);

        if (searchTerm !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}candidatethirdparty/search?searchKey=${searchTerm}`);
                settableData(response.data.data); // Assuming response has a data property
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            try {
                const response = await axios.get(`${BASE_API_URL}candidatethirdparty/list`);
                settableData(response.data.data); // Assuming response has a data property
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
        fetch(`${BASE_API_URL}candidatethirdparty/export-data`, {
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

    const openView = () => {
        const csv = convertToCSV(tableData);
        downloadCount += 1; // Increment the download count
        const filename = `can_third_data${downloadCount}.csv`; // Dynamic filename
        downloadCSV(csv, filename);
    };

    // Import the data
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_API_URL}candidatethirdparty/import-data`, formData, {
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
    const openModal1 = (candidateThirdId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [candidateThirdId]: true // Set modal open for this recruitment ID
        }));
        fetchCandidateData(candidateThirdId);
    };

    // Function to close modal for a specific recruitment ID
    const closeModal1 = (candidateThirdId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [candidateThirdId]: false // Set modal closed for this recruitment ID
        }));
    };

    const fetchCandidateData = async (id) => {
        try {
            const response = await axios.get(`${BASE_API_URL}candidatethirdparty/listing_data/${id}`);
            setModalData(response.data.data); // Adjust based on the actual structure of the response
            setModalIsOpen1(prevState => ({
                ...prevState,
                [id]: true // Open the modal for the given ID
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
            // Handle error (e.g., set an error state or show an error message)
        }
    };
    // const handleButtonClick = (student_resume) => {
    //     const resumeUrl = `https://www.reinforcewebsol.com/${student_resume}`;
    //     window.open(resumeUrl, '_blank');
    // };
    const handleButtonClick = (student_resume) => {
        const resumeUrl = `https://www.reinforcewebsol.com/${student_resume}`;
        const viewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(resumeUrl)}`;
        window.open(viewerUrl, '_blank');
    };

    // mail
    const handleCheckboxChangeEmail = (email) => {
        setSelectedEmails(prevSelectedEmails =>
            prevSelectedEmails.includes(email)
                ? prevSelectedEmails.filter(e => e !== email)
                : [...prevSelectedEmails, email]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmails([]); // Deselect all

        } else {
            setSelectedEmails(data.map(data => data.student_email)); // Select all
        }
        setSelectAll(!selectAll); // Toggle selectAll state
    };


    const sendEmails = async () => {
        if (selectedEmails.length === 0) {
            setMessage('Please select at least one email to send.');
            return;
        }
        setMessage('Sending emails...');
        try {
            const response = await axios.post(`${BASE_API_URL}candidatethirdparty/send-mail`, { emails: selectedEmails });
            console.log('Response:', response.data);
            setMessage(response.data.msg);
            setTimeout(() => setMessage(''), 2000);
            // Reset selected emails and checkboxes after sending emails
            setSelectedEmails([]);
            setSelectAll(false);
        } catch (error) {
            console.error('Error sending emails:', error);
            setMessage('Error sending emails.');
        }
    };


    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO CANDIDATEBYAPI PAGE</h1>
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
                                        </button></span>
                                        <span>   <button onClick={sendEmails} className='button_design'>Send Emails &nbsp; <FontAwesomeIcon icon={faEnvelope} /></button>
                                        </span>
                                    </div>
                                    {message && <div className="mt-3 alert alert-success">{message}</div>}


                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div class="row">
                                                        <div class="col-md-6 offset-md-3">
                                                            <div class="signup-form">


                                                                <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                    <div className="addHeading">
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Create Your Account</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Student_name*</b></label>
                                                                            <input type="text" name="student_name" value={formData.student_name} onChange={handleInputChange} class="form-control" placeholder="student_name" />
                                                                            {errors.student_name && <span className="error" style={{ color: 'red' }}>{errors.student_name}</span>}
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Student Mobile No*</b></label>
                                                                            <input type="text" name="student_mobile" value={formData.student_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                                                            {errors.student_mobile && <span className="error" style={{ color: 'red' }}>{errors.student_mobile}</span>}
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>student_email*</b></label>
                                                                            <input type="email" name="student_email" value={formData.student_email} onChange={handleInputChange} class="form-control" placeholder="student_email" />
                                                                            {errors.student_email && <span className="error" style={{ color: 'red' }}>{errors.student_email}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>student_qualification  *</b></label>
                                                                            <input type="text" name="student_qualification" value={formData.student_qualification} onChange={handleInputChange} class="form-control" placeholder="student_qualification" />
                                                                            {errors.student_qualification && <span className="error" style={{ color: 'red' }}>{errors.student_qualification}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>student_exp*</b></label>
                                                                            <select
                                                                                name="student_exp"
                                                                                value={formData.student_exp}
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



                                                                            {errors.student_exp && <span className="error" style={{ color: 'red' }}>{errors.student_exp}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>student_position</b></label>
                                                                            <input type="text" name="student_position" value={formData.student_position} onChange={handleInputChange} class="form-control" placeholder="student_position" />
                                                                            {errors.student_position && <span className="error" style={{ color: 'red' }}>{errors.student_position}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>student_intdate</b></label>
                                                                            <input type="date" name="student_intdate" value={formData.student_intdate} onChange={handleInputChange} class="form-control" placeholder="student_intdate" />
                                                                            {errors.student_intdate && <span className="error" style={{ color: 'red' }}>{errors.student_intdate}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>student_time</b></label>
                                                                            <input type="date" name="student_time" value={formData.student_time} onChange={handleInputChange} class="form-control" placeholder="student_time" />
                                                                            {errors.student_time && <span className="error" style={{ color: 'red' }}>{errors.student_time}</span>}

                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Resume</b></label>
                                                                            <input type="file" onChange={handleFileChange} class="form-control" placeholder='resume file' name="student_resume" />
                                                                        </div>


                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add CandidateByApi</button>
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
                                                {/* <th scope="col" >Id  </th> */}

                                                <th scope="col" onClick={() => handleSort('id')}><b>ID</b> {sortColumn === 'id' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('student_name')}><b>Name</b> {sortColumn === 'student_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('student_email')}><b>Email </b>{sortColumn === 'student_email' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>


                                                <th scope="col" onClick={() => handleSort('student_mobile')}> <b>Mobile</b> {sortColumn === 'student_mobile' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  ><b>Hiring Status</b>  </th>
                                                <th scope="col" onClick={() => handleSort('student_resume')}><b>Document Proof </b>{sortColumn === 'student_resume' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  ><b>Actions</b></th>

                                                <th scope="col"  ><b> </b></th>
                                                <th>
                                                    <button style={{
                                                        border: 'none',
                                                        backgroundColor: 'white'
                                                    }} title="Send Mail"><FontAwesomeIcon icon={faEnvelope} /></button>


                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>

                                                    <td>{data.id}</td>
                                                    <td>{data.student_name}</td>
                                                    <td>{data.student_email}</td>
                                                    <td>{data.student_mobile}</td>
                                                    <td>
                                                        {data.hiringStatus ? data.hiringStatus : "Not Applicable"}
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="editButton"
                                                            onClick={() => handleButtonClick(data.student_resume)}
                                                            style={{ color: 'rgb(40, 118, 154)', background: 'none', border: 'none', cursor: 'pointer' }}
                                                            title="Show Pdf"
                                                        >
                                                            <FontAwesomeIcon icon={faFilePdf} />
                                                        </button>
                                                    </td>

                                                    <td>
                                                        <button className="editButton" onClick={() => DeleteData(data.id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button
                                                            className="editButton"
                                                            onClick={() => openModal1(data.id)}
                                                        >
                                                            <FontAwesomeIcon icon={faEye} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <label className="customcheckbox">
                                                            <input
                                                                type="checkbox"
                                                                className="listCheckbox"
                                                                checked={ids.includes(data._id)}
                                                                onChange={(e) => handleCheckboxChange(e, data._id)}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input style={{ marginLeft: "18px" }}
                                                            type="checkbox"
                                                            checked={selectedEmails.includes(data.student_email)}
                                                            onChange={() => handleCheckboxChangeEmail(data.student_email)}
                                                        />
                                                    </td>
                                                    {modalIsOpen1[data.id] && (
                                                        <CandidateDataModal isOpen1={modalIsOpen1[data.id]} onRequestClose={() => closeModal1(data.id)} data={modalData} />
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

export default CandidateByApiModule;
