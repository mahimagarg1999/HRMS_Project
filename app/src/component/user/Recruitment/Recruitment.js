import React, { useState, useEffect } from 'react';
import './Recruitment.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-modal';
import axios from 'axios'; // For Axios
import ModalBox from './EditRecruitment.js';
import Nav from '../../navComponent/Nav.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown, faEye, faList } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import Footer from '../../FooterModule/Footer.js'
import ModalComponent from './ModelComponent.js'; // Adjust the import path as needed
import CloseButton from 'react-bootstrap/CloseButton';
const RecruitmentModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalIsOpen1, setModalIsOpen1] = useState(false);
    const [selectedRecruitmentId, setSelectedRecruitmentId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [ids, setIds] = useState([]);
    const [agreement, setAgreement] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [query, setQuery] = useState('');
    const [expandedRows, setExpandedRows] = useState([]);
    const [expandedNotesRows, setExpandedNotesRows] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [isOpen1, setIsOpen1] = useState(false);
    const [data, setData] = useState([]);
    const [modalData2, setModalData2] = useState(null);
    const [isModalOpen2, setIsModalOpen2] = useState(false);
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const fetchCanData = async (profileId) => {
        try {
            // Ensure profileId is passed correctly formatted
            const response = await axios.get(`${BASE_API_URL}recruitment/recruitment-candidate?profileId=${profileId}`);
            // const result = await response.json();
            const result = response.data;
            console.log("Fetched Data:", result);
            setModalData2(result);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };


    const openModal2 = async (profileId) => {
        await fetchCanData(profileId);
        setIsModalOpen2(true);
        console.log("fetchCanData", fetchCanData)
    };
    const closeModal2 = () => {
        setIsModalOpen2(false);
        setModalData2(null);
    };



    const openModal = (recruitmentId) => {
        console.log('recruitmentId', recruitmentId)
        setModalIsOpen(true);
        setSelectedRecruitmentId(recruitmentId);
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
                const response = await axios.get(`${BASE_API_URL}recruitment/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}recruitment/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    const openPopup = () => {
        setMessage('')
        setFormData('')
        let formDataNew = {
            profile_id: '',
            profile: '',
            description: '',
            interviewer: "",
            interview_date: "",
            notes: "",
            no_of_candidate: "",
            location: "",
            experience: "",
            salary: "",
            responsibilities: "",
            requiredSkills: [],
            applyNowLink: "",
            whatsappNumber: "",
            emailId: "",

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
        })
        );
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.contract_agreement = agreement
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}recruitment/create`, formData);
                settogle(!togle)
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg);

            } catch (error) {
                console.error('Error:', error);
                // setMessage("Add consultancy failed");

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
                const response = axios.delete(`${BASE_API_URL}recruitment/delete?id=${id}`)

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

    // multidelete
    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setIds(prevIds => [...prevIds, id]);
        } else {
            setIds(prevIds => prevIds.filter(prevId => prevId !== id));
        }
    };
    const DEletemulti = async () => {
        const data = {
            "ids": ids
        };
        console.log('ids', data);
        try {
            const response = await axios.delete(`${BASE_API_URL}recruitment/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // =====
    const [errors, setErrors] = useState({
        profile_id: "",
        profile: "",
        description: "",
        interviewer: "",
        experience: "",
        salary: "",
        responsibilities: "",
        requiredSkills: [],
        applyNowLink: "",
        whatsappNumber: "",
        emailId: "",

    });
    const validateForm = () => {

        let isValid = true;
        const newErrors = {};
        if (!formData.profile_id.trim()) {
            newErrors.profile_id = "profile_id is required";
            isValid = false;
        }

        if (!formData.profile.trim()) {
            newErrors.profile = "Profile is required";
            isValid = false;
        }

        if (!formData.description.trim()) {
            newErrors.description = "Description is required";
            isValid = false;
        }

        if (!formData.interviewer.trim()) {
            newErrors.interviewer = "Interviewer is required";
            isValid = false;
        }
        if (!formData.experience.trim()) {
            newErrors.experience = "Experience is required";
            isValid = false;
        }
        if (!formData.salary.trim()) {
            newErrors.salary = "Salary is required";
            isValid = false;
        }
        if (!formData.responsibilities.trim()) {
            newErrors.responsibilities = "Responsibilities is required";
            isValid = false;
        }
        if (!formData.requiredSkills.length) {
            newErrors.requiredSkills = "RequiredSkills is required";
            isValid = false;
        }
        if (!formData.applyNowLink.trim()) {
            newErrors.applyNowLink = "ApplyNowLink is required";
            isValid = false;
        }
        if (!formData.whatsappNumber.trim()) {
            newErrors.whatsappNumber = "WhatsappNumber is required";
            isValid = false;
        }
        if (!formData.emailId.trim()) {
            newErrors.emailId = "EmailId is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}recruitment/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}recruitment/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const toggleRow = (id) => {
        setExpandedRows(prevRows =>
            prevRows.includes(id) ? prevRows.filter(rowId => rowId !== id) : [...prevRows, id]
        );
    };
    const toggleNotesRow = (id) => {
        setExpandedNotesRows(expandedNotesRows.includes(id)
            ? expandedNotesRows.filter(rowId => rowId !== id)
            : [...expandedNotesRows, id]);
    };

    const openModal1 = (recruitmentId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [recruitmentId]: true // Set modal open for this recruitment ID
        }));
        fetchRecruitmentData(recruitmentId);
    };

    // Function to close modal for a specific recruitment ID
    const closeModal1 = (recruitmentId) => {
        setModalIsOpen1(prevState => ({
            ...prevState,
            [recruitmentId]: false // Set modal closed for this recruitment ID
        }));
    };

    const fetchRecruitmentData = async (id) => {
        try {
            const response = await axios.get(`${BASE_API_URL}recruitment/get?recruitmentid=${id}`);
            setModalData(response.data); // Ensure response.data contains the correct data structure
            setModalIsOpen1(prevState => ({
                ...prevState,
                [id]: true // Set modal open for this recruitment ID
            }));
        } catch (error) {
            console.error('Error fetching data:', error);
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
            setFormData({ ...formData, requiredSkills: updatedSelectedSkills });

            // Clear the error for requiredSkills if at least one skill is selected
            if (updatedSelectedSkills.length > 0) {
                setErrors((prevErrors) => {
                    const { requiredSkills, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setFormData({ ...formData, requiredSkills: updatedSelectedSkills });

        // Set the error for requiredSkills if no skills are left
        if (updatedSelectedSkills.length === 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                requiredSkills: "At least one skill is required"
            }));
        }
    };
    const SkillTag = ({ skill, onRemove }) => (
        <div className="skill-tag">
            {skill}
            <button onClick={() => onRemove(skill)}>x</button>
        </div>
    );



    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO RECRUITMENT PAGE</h1>
                </div>
                <div >
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body text-center">

                                    <div className='icon_manage'>
                                        <button className="button_design" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>

                                        <span> <button className="button_design" onClick={() => { DEletemulti() }}    >
                                            MultiDel&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                                        </button></span>
                                        
                                    </div>
                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div class="row">
                                                        <div class="col-md-6 offset-md-3">
                                                            <div class="signup-form">
                                                                <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Recruitment</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  profile_id*</b></label>
                                                                            <input type="text" name="profile_id" value={formData.profile_id} onChange={handleInputChange} class="form-control" placeholder="profile_id" />
                                                                            {errors.profile_id && <span className="error" style={{ color: 'red' }}>{errors.profile_id}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Profile*</b></label>
                                                                            {/* <input type="text" name="profile" value={formData.profile} onChange={handleInputChange} class="form-control" placeholder="Profile" /> */}
                                                                            <select name="profile" value={formData.profile} onChange={handleInputChange} className="form-control">
                                                                                <option value=""> Select Profile </option>
                                                                                <option value="SEO">SEO</option>
                                                                                <option value="Web Developer">Web Developer</option>
                                                                                <option value="Drupal Developer">Drupal Developer</option>
                                                                                <option value="WordPress Developer">WordPress Developer</option>
                                                                                <option value="QA-Tester">QA-Tester</option>
                                                                                <option value="BDE">BDE</option>
                                                                                <option value="Android Developer">Android Developer</option>
                                                                                <option value="IOS Developer">IOS Developer</option>
                                                                                <option value="ROR Developer">ROR Developer</option>
                                                                                <option value="Php Developer">Php Developer</option>
                                                                                <option value="Web Designing">Web Designing</option>
                                                                                <option value="Python Developer">Python Developer</option>
                                                                                <option value="Data Analyist">Data Analyist</option>
                                                                                <option value="test">test</option>
                                                                                <option value="test1">test1</option>
                                                                            </select>
                                                                            {errors.profile && <span className="error" style={{ color: 'red' }}>{errors.profile}</span>}

                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Interviewer</b></label>
                                                                            <select name="interviewer" value={formData.interviewer} onChange={handleInputChange} className="form-control">
                                                                                <option value=""> Select Interviewr </option>
                                                                                <option value="Mr. Arun Sharma">Mr. Arun Sharma</option>
                                                                                <option value="Mr. Anil Tiwari">Mr. Anil Tiwari</option>
                                                                                <option value="Mr. Pawan Patel">Mr. Pawan Patel</option>
                                                                                <option value="Mr. Manoj Sahu">Mr. Manoj Sahu</option>
                                                                                <option value="Ms. Geetanjali P">Ms. Geetanjali P</option>
                                                                            </select>
                                                                            {errors.interviewer && <span className="error" style={{ color: 'red' }}>{errors.interviewer}</span>}

                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Interview Date</b></label>
                                                                            <input type="date" name="interview_date" value={formData.interview_date} onChange={handleInputChange} className="form-control" placeholder="Interview Date" />
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Notes</b></label>
                                                                            <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} className="form-control" placeholder="Notes" />
                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Description*</b></label>
                                                                            <textarea
                                                                                name="description"
                                                                                value={formData.description}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Description"
                                                                                rows="2"
                                                                            />
                                                                            {errors.description && <span className="error" style={{ color: 'red' }}>{errors.description}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Experience*</b></label>
                                                                            <select
                                                                                name="experience"
                                                                                value={formData.experience}
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
                                                                            {errors.experience && <span className="error" style={{ color: 'red' }}>{errors.experience}</span>}

                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Salary</b></label>
                                                                            <input type="text" name="salary" value={formData.salary} onChange={handleInputChange} className="form-control" placeholder="Salary" />
                                                                            {errors.salary && <span className="error" style={{ color: 'red' }}>{errors.salary}</span>}

                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Location</b></label>
                                                                            <input type="text" name="location" value={formData.location} onChange={handleInputChange} className="form-control" placeholder="Location" />
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>EmailId</b></label>
                                                                            <input type="email" name="emailId" value={formData.emailId} onChange={handleInputChange} className="form-control" placeholder="emailId" />
                                                                            {errors.emailId && <span className="error" style={{ color: 'red' }}>{errors.emailId}</span>}

                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Responsibilities</b></label>
                                                                            <textarea type="text" name="responsibilities" value={formData.responsibilities} onChange={handleInputChange} className="form-control" placeholder="Responsibilities" />
                                                                            {errors.responsibilities && <span className="error" style={{ color: 'red' }}>{errors.responsibilities}</span>}


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
                                                                            {errors.requiredSkills && <span className="error" style={{ color: 'red' }}>{errors.requiredSkills}</span>}

                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>ApplyNowLink</b></label>
                                                                            <input type="text" name="applyNowLink" value={formData.applyNowLink} onChange={handleInputChange} className="form-control" placeholder="ApplyNowLink" />
                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>WhatsappNumber</b></label>
                                                                            <input type="text" name="whatsappNumber" value={formData.whatsappNumber} onChange={handleInputChange} className="form-control" placeholder="whatsappNumber" />
                                                                        </div>



                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Recruitment</button>
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
                                    />
                                </div>
                                <div className="table-responsive">

                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>

                                                <th scope="col" onClick={() => handleSort('profile')}><b>Profile </b>  {sortColumn === 'profile' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>

                                                <th scope="col" onClick={() => handleSort('interviewer')}><b> Interviewer </b>
                                                    {sortColumn === 'interviewer' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}</th>
                                                <th scope="col" onClick={() => handleSort('description')} style={{ cursor: 'pointer' }}> <b>Description</b>
                                                    {sortColumn === 'description' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}</th>
                                                <th scope="col" onClick={() => handleSort('notes')} style={{ cursor: 'pointer' }}> <b>No. Of Candidate</b>
                                                    {sortColumn === 'notes' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}</th>
                                                <th scope="col" ><b>LIST </b> </th>
                                                <th scope="col" ><b>ACTIONS </b> </th>
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

                                                    <td className="description-cell">{data.profile} </td>

                                                    <td>{data.interviewer}</td>
                                                    <td >
                                                        {data.description.split(' ').length > 4 ? (
                                                            <>
                                                                {expandedRows.includes(data._id) ? (
                                                                    <>
                                                                        {data.description}
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show less</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {data.description.split(' ').slice(0, 3).join(' ')}...
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show more</button>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>{data.description}</>
                                                        )}
                                                    </td>
                                                    <td >{data.no_of_candidate}</td>

                                                    <td>
                                                        <button className="editButton" onClick={() => openModal2(data.profile_id)}>
                                                            <FontAwesomeIcon icon={faList} />
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

                                                    <ModalBox isOpen={modalIsOpen} recruitmentId={selectedRecruitmentId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>

                                                    {modalIsOpen1[data._id] && (
                                                        <ModalComponent isOpen1={modalIsOpen1[data._id]} onRequestClose={() => closeModal1(data._id)} data={modalData} />
                                                    )}

                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <Modal isOpen={isModalOpen2} onRequestClose={closeModal2}>
                                        <div style={{ display: 'flex' }}>
                                            <h2 style={{ textAlign: 'center' }}>Recruitment Details</h2>
                                            <CloseButton onClick={closeModal2} style={{ marginLeft: '75%' }} /></div>

                                        {modalData2 && modalData2.length > 0 ? (
                                            <div>
                                                <table className="table">
                                                    <thead className="thead-light">
                                                        <tr>
                                                            <th><b>Profile--</b></th>
                                                            <th><b>Interviewer</b></th>
                                                            <th><b>Description</b></th>
                                                            <th><b>Candidate Name</b></th>
                                                            <th><b>Candidate Email</b></th>
                                                            <th><b>Candidate Skills</b></th>
                                                            <th ><b>Candidate Experience</b></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {modalData2.map((data, index) => (
                                                            <tr key={index}>
                                                                <td>{data.recruitment_profile_id}</td>
                                                                <td>{data.interviewer}</td>
                                                                {/* <td>{data.description}</td> */}
                                                                <td className="description-cell">
                                                                    {expandedRows.includes(data._id) ? (
                                                                        <>
                                                                            {data.description} <button className="show_more" onClick={() => toggleRow(data._id)}>Show less</button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {data.description.split(' ').slice(0, 2).join(' ')}...<button className="show_more" onClick={() => toggleRow(data._id)}>Show more</button>
                                                                        </>
                                                                    )}
                                                                </td>
                                                                <td>{`${data.candidate_first_name} ${data.candidate_last_name}`}</td>
                                                                <td>{data.candidate_email}</td>
                                                                <td>{data.candidate_skills}</td>
                                                                <td style={{ textAlign: 'center' }}>{data.candidate_experience}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        ) : (
                                            <p>No data available</p>
                                        )}
                                    </Modal>

                                </div>
                                {/* Pagination component */}
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

                </div>

                <div>

                </div>

            </div >
            <Footer />
        </>

    );
}
export default RecruitmentModule;
