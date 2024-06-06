import React, { useState, useEffect } from 'react';
import './Candidate.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditCandidateModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTable, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import { Link } from 'react-router-dom';



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
    const [ids, setId] = useState([]);
    const [resume, setResume] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [query, setQuery] = useState('');

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 5; // Number of items to display per page
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
        candidate_skills: '',
        candidate_experience: '',
        candidate_expected_salary: ''

    });

    // const [data, setData] = useState(formData);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}candidate/list`);
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
            candidate_id: '',
            candidate_first_name: '',
            candidate_last_name: '',
            candidate_mobile: '',
            candidate_alternate_mobile: '',
            candidate_email: '',
            candidate_skype: '',
            candidate_linkedIn_profile: '',
            candidate_skills: '',
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
            graduationPercentage: ''
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
        if (!formData.candidate_skills.trim()) {
            newErrors.candidate_skills = "candidate_skills is required";
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
        // If the checkbox is checked, add the ID to the list of selected IDs
        if (e.target.checked) {
            setId(prevIds => [...prevIds, id]);
        } else {
            // If the checkbox is unchecked, remove the ID from the list of selected IDs
            setId(prevIds => prevIds.filter(prevId => prevId !== id));
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
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}candidate/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}candidate/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
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
                                    {/* <h5 className="card-title m-b-0">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add Candidate +
                                    </button>
                                </h5> */}
                                    <div>
                                        <button className="backButton" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>
                                    </div>
                                    <div> <span> <button className="multiDeleteButton" onClick={() => { Deletemulti() }}    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
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
                                                                            <label><b>Skills*</b></label>
                                                                            <input type="text" name="candidate_skills" value={formData.candidate_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
                                                                            {errors.candidate_skills && <span className="error" style={{ color: 'red' }}>{errors.candidate_skills}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Experience*</b></label>
                                                                            <input type="text" name="candidate_experience" value={formData.candidate_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
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
                                                                            <input type="text" name="candidate_selection_status" value={formData.candidate_selection_status} onChange={handleInputChange} class="form-control" placeholder="Selection Status" />
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
                                    />
                                </div>
                                <div className="table-responsive">
                                    {/* <form >
                                        <input
                                            type="text"
                                            value={query}
                                            onChange={handleChange}
                                            placeholder="Search by first name, last name, or both"
                                        />
                                    </form> */}
                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>
                                                {/* <th scope="col" >Id  </th> */}
                                                
                                                <th scope="col" onClick={() => handleSort('candidate_id')}>ID {sortColumn === 'candidate_id' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_first_name')}>Name {sortColumn === 'candidate_first_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_email')}>Email {sortColumn === 'candidate_email' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_document_proof')}>Document Proof {sortColumn === 'candidate_document_proof' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('candidate_mobile')}> Mobile {sortColumn === 'candidate_mobile' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  >Actions</th>

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
                                                    <td>
                                                        <a style={{ color: 'rgb(40, 118, 154)' }} href={`http://localhost:5000/${data.candidate_document_proof}`} target="_blank">{data.candidate_document_proof}</a>
                                                    </td>
                                                    <td>{data.candidate_mobile}</td>
                                                    <td>
                                                        <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} >

                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <label className="customcheckbox">
                                                            <input type="checkbox" className="listCheckbox" onChange={(e) => handleCheckboxChange(e, data._id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <ModalBox isOpen={modalIsOpen} candidateId={selectedCandidateId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <ReactPaginate
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    breakLabel={'...'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                />


                            </div>
                        </div>
                    </div>

                </div>

                <div>

                </div>


            </div>
            <Footer />
        </>
    );
}

export default CandidateModule;
