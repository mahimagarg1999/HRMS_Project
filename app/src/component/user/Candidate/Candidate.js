import React, { useState, useEffect } from 'react';
import './Candidate.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditCandidateModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown, faFilePdf, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CandidateDataModal from './CandidateDataModal.js'
let downloadCount = 0;

const CandidateModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [ids, setIds] = useState([]);
    const [resume, setResume] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [query, setQuery] = useState('');
    const [profiles, setProfiles] = useState([]);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [data, setData] = useState([]); // Initialize data with an empty array
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [modalData, setModalData] = useState(null);


    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    // const currentItems = tableData.slice(offset, offset + itemsPerPage);
    const openModal = (candidateId) => {
        console.log('candidateId', candidateId)
        setModalIsOpen(true);
        setSelectedCandidateId(candidateId);

    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const handleSort = async (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            try {
                const response = await axios.get(`${BASE_API_URL}candidate/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // If a new column is clicked, set it as the sorting column and reset the direction
            setSortColumn(column);
            setSortDirection('ascending');
        }
    };

    const [formData, setFormData] = useState({

    });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            console.log("e----->", e.target.name);
            reader.onloadend = () => {
                if (e.target && e.target.name === 'candidate_document_proof') {
                    console.log('hii')
                    setResume(reader.result);
                }

                console.log('idproof', resume)
                console.log('selectedFile', selectedFile)

            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };
    const [errors, setErrors] = useState({
        candidate_id: "",
        candidate_first_name: "",
        candidate_last_name: "",
        candidate_mobile: '',
        candidate_email: '',
        candidate_experience: '',
        candidate_expected_salary: '',
        profile: ''

    });
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}candidate/list`);
            console.log(response.data.data); // Handle the response as needed
            settableData(response.data.data)
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(() => {
        console.log('Table Data:', tableData); // Check tableData in the console

        fetchData();
    }, [togle]);
    // =============check
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
    const openPopup = () => {
        setMessage('')
        setFormData('')
        let formDataNew = {
            candidate_id: '',
            candidate_first_name: '',
            candidate_last_name: '',
            candidate_mobile: '',
            candidate_alternate_mobile: '',
            candidate_email: '',
            candidate_skype: '',
            candidate_linkedIn_profile: '',
            candidate_skills: [],
            candidate_experience: '',
            candidate_expected_salary: '',
            candidate_expected_joining_date: '',
            candidate_marrital_status: '',
            candidate_machine_round: '',
            candidate_technical_interview_round: '',
            candidate_hr_interview_round: '',
            candidate_selection_status: '',
            candidate_feedback: '',
            source_of_candidate: '',
            candidate_address: '',
            candidate_document_proof: '',
            resumePdfName: "pdf",
            tenth_percentage: '',
            twelfth_percentage: '',
            graduationPercentage: '',
            profile: ''
        }
        setFormData(formDataNew)
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


    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.candidate_id.trim()) {
            newErrors.candidate_id = "candidate_id is required";
            isValid = false;
        }
        if (!formData.candidate_first_name.trim()) {
            newErrors.candidate_first_name = "candidate_last_name is required";
            isValid = false;
        }

        if (!formData.candidate_last_name.trim()) {
            newErrors.candidate_last_name = "candidate_last_name is required";
            isValid = false;
        }

        if (!formData.candidate_mobile.trim()) {
            newErrors.candidate_mobile = "candidate_mobile is required";
            isValid = false;
        }
        if (!formData.candidate_email.trim()) {
            newErrors.candidate_email = "candidate_email is required";
            isValid = false;
        }
        // if (!formData.candidate_skills.trim()) {
        //     newErrors.candidate_skills = "candidate_skills is required";
        //     isValid = false;
        // }
        if (!formData.candidate_skills.length) {
            newErrors.candidate_skills = "Candidate skills are required";
            isValid = false;
        }
        if (!formData.candidate_experience.trim()) {
            newErrors.candidate_experience = "candidate_experience is required";
            isValid = false;
        }
        if (!formData.candidate_expected_salary.trim()) {
            newErrors.candidate_expected_salary = "candidate_expected_salary is required";
            isValid = false;
        }
        if (!formData.profile.trim()) {
            newErrors.profile = "Profile is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.candidate_document_proof = resume

        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}candidate/create`, formData);
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg);
                settogle(!togle)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };



    const DeleteData = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = await axios.delete(`${BASE_API_URL}candidate/delete?id=${id}`)

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
            const response = await axios.delete(`${BASE_API_URL}candidate/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleChange = async (event) => {
        const searchQuery = event.target.value;
        setQuery(searchQuery);
    };

    // useEffect(() => {
    //     const updateUrlAndFetchData = async () => {
    //         if (query !== '') {
    //             try {
    //                 // Update the URL with the search parameter
    //                 const newUrl = new URL(window.location.href);
    //                 newUrl.searchParams.set('profile', query);
    //                 window.history.pushState({ path: newUrl.href }, '', newUrl.href);
    //                 // Send the request to the backend with the search parameter
    //                 const response = await axios.get(`${BASE_API_URL}candidate/search`, {
    //                     params: { profile: query }
    //                 });
    //                 settableData(response.data);
    //             } catch (error) {
    //                 console.error('Error:', error);
    //             }
    //         } else {
    //             try {
    //                 // Remove the search parameter from the URL
    //                 const newUrl = new URL(window.location.href);
    //                 newUrl.searchParams.delete('profile');
    //                 window.history.pushState({ path: newUrl.href }, '', newUrl.href);

    //                 // Send the request to get the full list
    //                 const response = await axios.get(`${BASE_API_URL}candidate/list`);
    //                 settableData(response.data.data);
    //             } catch (error) {
    //                 console.error('Error:', error);
    //             }
    //         }
    //     };

    //     updateUrlAndFetchData();
    // }, [query]);
    useEffect(() => {
        const updateUrlAndFetchData = async () => {
            if (query !== '') {
                try {
                    // Update the URL with the search parameter
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.set('profile', query);
                    window.history.replaceState({ path: newUrl.href }, '', newUrl.href); // Use replaceState to avoid adding new history entry

                    // Send the request to the backend with the search parameter
                    const response = await axios.get(`${BASE_API_URL}candidate/search`, {
                        params: { profile: query }
                    });
                    settableData(response.data);
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                try {
                    // Remove the search parameter from the URL
                    const newUrl = new URL(window.location.href);
                    newUrl.searchParams.delete('profile');
                    window.history.replaceState({ path: newUrl.href }, '', newUrl.href);

                    // Send the request to get the full list
                    const response = await axios.get(`${BASE_API_URL}candidate/list`);
                    settableData(response.data.data);
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        updateUrlAndFetchData();
    }, [query]);


    const handleAddSkill = (skill) => {
        if (!selectedSkills.includes(skill)) {
            const updatedSelectedSkills = [...selectedSkills, skill];
            setSelectedSkills(updatedSelectedSkills);
            setAvailableSkills(availableSkills.filter(item => item !== skill));
            setFormData({ ...formData, candidate_skills: updatedSelectedSkills });

            // Clear the error for requiredSkills if at least one skill is selected
            if (updatedSelectedSkills.length > 0) {
                setErrors((prevErrors) => {
                    const { candidate_skills, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setFormData({ ...formData, candidate_skills: updatedSelectedSkills });

        // Set the error for requiredSkills if no skills are left
        if (updatedSelectedSkills.length === 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                candidate_skills: "At least one skill is required"
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
        fetch(`${BASE_API_URL}candidate/export-data`, {
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
        const filename = `can_data${downloadCount}.csv`; // Dynamic filename
        downloadCSV(csv, filename);
    };
    // Import the data
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_API_URL}candidate/import-data`, formData, {
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
            setSelectedEmails(data.map(data => data.candidate_email)); // Select all
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
            const response = await axios.post(`${BASE_API_URL}candidate/send-mail`, { emails: selectedEmails });
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
    const openModal1 = (candidateId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [candidateId]: true // Set modal open for this recruitment ID
        }));
        fetchCandidateData(candidateId);
    };
    const closeModal1 = (candidateId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [candidateId]: false // Set modal closed for this recruitment ID
        }));
    };

    const fetchCandidateData = async (id) => {
        try {
            const response = await axios.get(`${BASE_API_URL}candidate/get?candidateid=${id}`);
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
                    <h1 className='headerUser'>WELCOME TO CANDIDATE PAGE</h1>
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
                                        <span>
                                            <button onClick={openPopup} className='button_design'>
                                                Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                            </button>
                                        </span>
                                        <span> <button onClick={() => { Deletemulti() }} className='button_design'  >
                                            MultiDel&nbsp;  <FontAwesomeIcon icon={faTrashAlt} />
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
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Create Your Account</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>

                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Candidate ID*</b></label>
                                                                            <input type="text" name="candidate_id" value={formData.candidate_id} onChange={handleInputChange} class="form-control" placeholder="Candidate" />
                                                                            {errors.candidate_id && <span className="error" style={{ color: 'red' }}>{errors.candidate_id}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>First Name*</b></label>
                                                                            <input type="text" name="candidate_first_name" value={formData.candidate_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                                                            {errors.candidate_first_name && <span className="error" style={{ color: 'red' }}>{errors.candidate_first_name}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Last Name*</b></label>
                                                                            <input type="text" name="candidate_last_name" value={formData.candidate_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                                                            {errors.candidate_last_name && <span className="error" style={{ color: 'red' }}>{errors.candidate_last_name}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Mobile No*</b></label>
                                                                            <input type="text" name="candidate_mobile" value={formData.candidate_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                                                            {errors.candidate_mobile && <span className="error" style={{ color: 'red' }}>{errors.candidate_mobile}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Alternate Mobile No</b></label>
                                                                            <input type="text" name="candidate_alternate_mobile" value={formData.candidate_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Email*</b></label>
                                                                            <input type="email" name="candidate_email" value={formData.candidate_email} onChange={handleInputChange} class="form-control" placeholder="Email" />
                                                                            {errors.candidate_email && <span className="error" style={{ color: 'red' }}>{errors.candidate_email}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Skype Id</b></label>
                                                                            <input type="text" name="candidate_skype" value={formData.candidate_skype} onChange={handleInputChange} class="form-control" placeholder="Skype ID" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>LinkedIn Profile</b></label>
                                                                            <input type="text" name="candidate_linkedIn_profile" value={formData.candidate_linkedIn_profile} onChange={handleInputChange} class="form-control" placeholder="LinkedIn Profile" />
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

                                                                            {errors.candidate_skills && <span className="error" style={{ color: 'red' }}>{errors.candidate_skills}</span>}
                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Profile*</b></label>

                                                                            <select name="profile"
                                                                                value={formData.profile}
                                                                                onChange={handleInputChange}
                                                                                className="form-control">
                                                                                {profiles.map(profile => (
                                                                                    <option key={profile.profile_id} value={profile.profile_id}>
                                                                                        {profile.profile}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.profile && <span className="error" style={{ color: 'red' }}>{errors.profile}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Experience*</b></label>
                                                                            <select
                                                                                name="candidate_experience"
                                                                                value={formData.candidate_experience}
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
                                                                            {errors.candidate_experience && <span className="error" style={{ color: 'red' }}>{errors.candidate_experience}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expected Salary*</b></label>
                                                                            <input type="text" name="candidate_expected_salary" value={formData.candidate_expected_salary} onChange={handleInputChange} class="form-control" placeholder="Expected Salary" />
                                                                            {errors.candidate_expected_salary && <span className="error" style={{ color: 'red' }}>{errors.candidate_expected_salary}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Joining Date</b></label>
                                                                            <input type="date" name="candidate_expected_joining_date" value={formData.candidate_expected_joining_date} onChange={handleInputChange} class="form-control" />
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Marrital Status</b></label>
                                                                            <input type="text" name="candidate_marrital_status" value={formData.candidate_marrital_status} onChange={handleInputChange} class="form-control" placeholder="Marrital Status" />
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Machine Round</b></label>
                                                                            <input type="text" name="candidate_machine_round" value={formData.candidate_machine_round} onChange={handleInputChange} class="form-control" placeholder="Machine Round" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Technical Round</b></label>
                                                                            <input type="text" name="candidate_technical_interview_round" value={formData.candidate_technical_interview_round} onChange={handleInputChange} class="form-control" placeholder="Technical Interview Round" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Interview Round</b></label>
                                                                            <input type="text" name="candidate_hr_interview_round" value={formData.candidate_hr_interview_round} onChange={handleInputChange} class="form-control" placeholder="HR Interview Round" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Selection Status</b></label>
                                                                            {/* <input type="text" name="candidate_selection_status" value={formData.candidate_selection_status} onChange={handleInputChange} class="form-control" placeholder="Selection Status" /> */}
                                                                            <select
                                                                                name="candidate_selection_status"
                                                                                value={formData.candidate_selection_status}
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
                                                                            <input type="text" name="candidate_feedback" value={formData.candidate_feedback} onChange={handleInputChange} class="form-control" placeholder="Feedback" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Source of candidate</b></label>
                                                                            <input type="text" name="source_of_candidate" value={formData.source_of_candidate} onChange={handleInputChange} class="form-control" placeholder="From Consultancy" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Candidate Address</b></label>
                                                                            <input type="text" name="candidate_address" value={formData.candidate_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Document Proof</b></label>
                                                                            <input type="file" onChange={handleFileChange} class="form-control" placeholder='candidate document proof' name="candidate_document_proof" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>10th  Percentage</b></label>
                                                                            <input type="number" name="tenth_percentage" value={formData.tenth_percentage} onChange={handleInputChange} class="form-control" placeholder="Tenth Percentage" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>12th  Percentage</b></label>
                                                                            <input type="number" name="twelfth_percentage" value={formData.twelfth_percentage} onChange={handleInputChange} class="form-control" placeholder="Twelfth Percentage" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Graduation  Percentage</b></label>
                                                                            <input type="number" name="graduationPercentage" value={formData.graduationPercentage} onChange={handleInputChange} class="form-control" placeholder="Graduation Percentage" />
                                                                        </div>


                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Candidate</button>
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

                                                <th scope="col" onClick={() => handleSort('candidate_id')}><b>ID</b> {sortColumn === 'candidate_id' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_first_name')}><b>Name</b> {sortColumn === 'candidate_first_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_email')}><b>Email </b>{sortColumn === 'candidate_email' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>


                                                <th scope="col" onClick={() => handleSort('candidate_mobile')}> <b>Mobile</b> {sortColumn === 'candidate_mobile' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_selection_status')}><b>Hiring Status</b> {sortColumn === 'candidate_selection_status' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_document_proof')}><b>Document Proof </b>{sortColumn === 'candidate_document_proof' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  ><b>Actions</b></th>
                                                <th></th>
                                                <th>
                                                    <button style={{
                                                        border: 'none',
                                                        backgroundColor: 'white'
                                                    }} title="Send Mail"><FontAwesomeIcon icon={faEnvelope} /></button>
                                                    {/* <input
                                                        type="checkbox"
                                                        checked={selectAll}
                                                        onChange={handleSelectAll}
                                                    /> */}

                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className="customtable">

                                            {/* {tableData.map((data, index) => ( */}
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>

                                                    {/* <td>{data._id}</td> */}
                                                    <td>{data.candidate_id}</td>
                                                    <td>{data.candidate_first_name}&nbsp;{data.candidate_last_name} </td>
                                                    <td>{data.candidate_email}</td>


                                                    <td>{data.candidate_mobile}</td>

                                                    <td>{data.candidate_selection_status}</td>
                                                    <td>
                                                        {/* <a style={{ color: 'rgb(40, 118, 154)' }} href={`http://localhost:5000/${data.candidate_document_proof}`} target="_blank">{data.candidate_document_proof}</a> */}
                                                        <button
                                                            className="editButton"
                                                            onClick={() => window.open(`http://localhost:5000/${data.candidate_document_proof}`, '_blank')}
                                                            style={{ color: 'rgb(40, 118, 154)', background: 'none', border: 'none', cursor: 'pointer' }} title="Show Pdf"
                                                        >
                                                            <FontAwesomeIcon icon={faFilePdf} />

                                                        </button>
                                                    </td>
                                                    <td>
                                                        <button className="editButton" onClick={() => DeleteData(data._id)} title="Delete Data">  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} title="Edit Data">

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
                                                            checked={selectedEmails.includes(data.candidate_email)}
                                                            onChange={() => handleCheckboxChangeEmail(data.candidate_email)}
                                                        />
                                                    </td>
                                                    <ModalBox isOpen={modalIsOpen} candidateId={selectedCandidateId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                    {modalIsOpen1[data._id] && (
                                                        <CandidateDataModal isOpen1={modalIsOpen1[data._id]} onRequestClose={() => closeModal1(data._id)} data={modalData} />
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
            <Footer />
        </>
    );
}

export default CandidateModule;
