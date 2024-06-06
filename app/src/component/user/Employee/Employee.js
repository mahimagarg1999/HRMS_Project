import React, { useState, useEffect } from 'react';
import './Employee.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditEmployeeModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import { Link } from 'react-router-dom';

// import lib

const EmployeeModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);

    const [ids, setId] = useState([]);
    const [selectedFile, setSelectedFile] = useState('');
    const [idproof, setidproofFile] = useState('');
    const [marksheet, setmarksheet] = useState('');
    const [e_letter, seteletter] = useState('');
    const [pancard, setPancard] = useState('');
    const [query, setQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 5; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    // const currentItems = tableData.slice(offset, offset + itemsPerPage);

    // const [data, setData] = useState(formData);
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
            const response = await axios.delete(`${BASE_API_URL}employee/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
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

    });

    const [formData, setFormData] = useState({});
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
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}employee/list`);

                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

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
            employee_skills: '',
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
            resumePdfName: "pdf",
            proofPdfName: "pdf",
            panPdfName: "pdf",
            marksheetPdfName: "pdf",
            experiencePdfName: "pdf"
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
        e.preventDefault();
        formData.employee_resume = selectedFile
        formData.employee_id_proof = idproof
        formData.employee_marksheet = marksheet
        formData.employee_pan_card = pancard
        formData.employee_experience_letter = e_letter
        formData.employee_marksheet = marksheet
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}employee/create`, formData);
                settogle(!togle)
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
                                    {/* <h5 className="card-title m-b-0">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add Employee +
                                    </button>
                                </h5> */}
                                    {/* <Link to="/user" className="nav-item backButton">Back</Link> */}
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
                                                                            <input type="text" name="employee_address" value={formData.employee_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
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
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Skills</b></label>
                                                                            <input type="text" name="employee_skills" value={formData.employee_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Experience*</b></label>
                                                                            <input type="text" name="employee_experience" value={formData.employee_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
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
                                    />
                                </div>
                                <div className="table-responsive">

                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>
                                                {/* <th>
                                                <label className="customcheckbox m-b-20">
                                                    <input type="checkbox" id="mainCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </th> */}
                                                <th scope="col" onClick={() => handleSort('employee_code')}>Emp Code  {sortColumn === 'employee_code' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('employee_first_name')}>Name {sortColumn === 'employee_first_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('employee_email')}>Email {sortColumn === 'employee_email' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('employee_mobile')}> Mobile {sortColumn === 'employee_mobile' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  > Employee Resume  </th>
                                                <th scope="col" >Actions</th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                        {/* <span className="checkmark"></span> */}
                                                    </label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {/* {tableData.map((data, index) => ( */}
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>
                                                    {/* <td>
                                                    <label className="customcheckbox">
                                                        <input type="checkbox" className="listCheckbox" />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td> */}
                                                    <td>{data.employee_code}</td>
                                                    <td>{data.employee_first_name}&nbsp;{data.employee_last_name}</td>
                                                    <td>{data.employee_email}</td>
                                                    <td>{data.employee_mobile}</td>
                                                    <td>
                                                        <a style={{ color: 'rgb(40, 118, 154)' }} href={`http://localhost:5000/${data.employee_resume}`} target="_blank">{data.employee_resume}</a>
                                                    </td>
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
                                                    <ModalBox isOpen={modalIsOpen} employeeId={selectedEmployeeId} onRequestClose={closeModal}>
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

                </div >

                <div>

                </div>


            </div >
            <Footer />        </>
    );
}

export default EmployeeModule;
