import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditLeave.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
// import lib
const LeaveModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedLeaveId, setSelectedLeaveId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [ids, setIds] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [query, setQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');



    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const openModal = (leaveId) => {
        console.log('leaveId', leaveId)
        setModalIsOpen(true);
        setSelectedLeaveId(leaveId);

    };
    const handleSort = async (column) => {
        console.log("Sort column clicked:", column);
        console.log("Current sort direction:", sortDirection);
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

            try {
                const response = await axios.get(`${BASE_API_URL}leave/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
            const response = await axios.delete(`${BASE_API_URL}leave/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (!formData.employee_id.trim()) {
            newErrors.employee_id = "employee_id is required";
            isValid = false;
        }
        if (!formData.leave_type.length) {
            newErrors.leave_type = "leave_type is required";
            isValid = false;
        }
        if (!formData.start_date.length) {
            newErrors.start_date = "start_date is required";
            isValid = false;
        }
        if (!formData.end_date.length) {
            newErrors.end_date = "end_date is required";
            isValid = false;
        }
        if (!formData.reason.length) {
            newErrors.reason = "reason is required";
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
        employee_id: "",
        leave_type: "",
        start_date: "",
        end_date: "",
        reason: "",
    });

    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}leave/list`);
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
        let formDataNew = {
            employee_id: '',
            leave_type: '',
            start_date: '',
            end_date: '',
            reason: '',
            status: '',
            applied_on: '',
            comments: '',
        }
        setFormData(formDataNew);
        setIsOpen(true);

    };

    const closePopup = () => {
        setIsOpen(false);
        setFormData('')
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


    const toggleRow = (id) => {
        setExpandedRows(prevRows =>
            prevRows.includes(id) ? prevRows.filter(rowId => rowId !== id) : [...prevRows, id]
        );
    };
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);

        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}leave/create`, formData);
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
                const response = axios.delete(`${BASE_API_URL}leave/delete?id=${id}`)
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
        const searchValue = event.target.value;
        setQuery(searchValue);
        console.log('Search Value:', searchValue);

        if (searchValue !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}leave/search`, {
                    params: { search: searchValue }
                });
                console.log('Search Results:', response.data);
                settableData(response.data);
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            try {
                const response = await axios.get(`${BASE_API_URL}leave/list`);
                console.log('Full List Data:', response.data.data);
                settableData(response.data.data);
            } catch (error) {
                console.error('Error fetching full list:', error);
            }
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_API_URL}leave/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    // const handleAddProfile = (profile) => {
    //     if (!selectedProfile.some(p => p.profile_id === profile.profile_id)) {
    //         const updatedSelectedProfile = [...selectedProfile, profile];
    //         setSelectedProfile(updatedSelectedProfile);
    //         setAvailableProfile(prev => prev.filter(p => p.profile_id !== profile.profile_id));
    //         // Only store profile names in formData
    //         setFormData(prev => ({
    //             ...prev,
    //             profile: updatedSelectedProfile.map(p => p.profile),
    //             profile_id: updatedSelectedProfile.map(p => p.profile_id)
    //         }));
    //         // Clear error if any profile is selected
    //         if (updatedSelectedProfile.length > 0) {
    //             setErrors(prevErrors => {
    //                 const { profile, ...rest } = prevErrors;
    //                 return rest;
    //             });
    //         }
    //     }
    // };
    // const handleRemoveProfile = (profile) => {
    //     const updatedSelectedProfile = selectedProfile.filter(p => p.profile_id !== profile.profile_id);
    //     setSelectedProfile(updatedSelectedProfile);
    //     setAvailableProfile(prev => [...prev, profile]);

    //     // Update formData to remove profile
    //     setFormData(prev => ({
    //         ...prev,
    //         profile: updatedSelectedProfile.map(p => p.profile),
    //         profile_id: updatedSelectedProfile.map(p => p.profile_id)
    //     }));

    //     // Set error if no profiles are left
    //     if (updatedSelectedProfile.length === 0) {
    //         setErrors(prevErrors => ({
    //             ...prevErrors,
    //             profile: "At least one profile is required"
    //         }));
    //     }
    // };

    // ProfileTag Component
    const ProfileTag = ({ profile, onRemove }) => (
        <div className="skill-tag">
            {profile}
            <button onClick={onRemove}>x</button>
        </div>
    );



    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO LEAVE PAGE</h1>
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
                                        <span> <button className="button_design" onClick={() => { Deletemulti() }}    >
                                            MultiDel&nbsp; <FontAwesomeIcon icon={faTrashAlt} />
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
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Leave Data</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee ID</b></label>
                                                                            <input type="text" name="employee_id" value={formData.employee_id} onChange={handleInputChange} class="form-control" placeholder="employee_id" />
                                                                            {errors.employee_id && <span className="error" style={{ color: 'red' }}>{errors.employee_id}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Leave Type*</b></label>
                                                                            <select
                                                                                name="leave_type"
                                                                                value={formData.leave_type}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Leave Type</option>
                                                                                <option value="Sick Leave">Sick Leave</option>
                                                                                <option value="Casual Leave">Casual Leave</option>
                                                                                <option value="Annual Leave">Annual Leave</option>
                                                                                <option value="Maternity Leave">Maternity Leave</option>
                                                                                <option value="Paternity Leave">Paternity Leave</option>
                                                                                <option value="Other">Other</option>
                                                                            </select>
                                                                            {errors.leave_type && <span className="error" style={{ color: 'red' }}>{errors.leave_type}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>start_date</b></label>
                                                                            <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} class="form-control" placeholder="start_date" />
                                                                            {errors.start_date && <span className="error" style={{ color: 'red' }}>{errors.start_date}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>end_date</b></label>
                                                                            <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} class="form-control" placeholder="end_date" />
                                                                            {errors.end_date && <span className="error" style={{ color: 'red' }}>{errors.end_date}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>reason</b></label>
                                                                            <input type="text" name="reason" value={formData.reason} onChange={handleInputChange} class="form-control" placeholder="reason" />
                                                                            {errors.reason && <span className="error" style={{ color: 'red' }}>{errors.reason}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Status*</b></label>
                                                                            <select
                                                                                name="status"
                                                                                value={formData.status}
                                                                                onChange={handleInputChange}
                                                                                className="form-control" >
                                                                                <option value="">Select Status  </option>
                                                                                <option value="Pending">Pending</option>
                                                                                <option value="Approved">Approved</option>
                                                                                <option value="Rejected">Rejected  </option>

                                                                            </select>
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>applied_on</b></label>
                                                                            <input type="date" name="applied_on" value={formData.applied_on} onChange={handleInputChange} class="form-control" placeholder="applied_on" />
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>approved_by*</b></label>
                                                                            <select
                                                                                name="approved_by"
                                                                                value={formData.approved_by}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >

                                                                                <option value="">Select Person</option>
                                                                                <option value="Arun Sir">Arun Sir</option>
                                                                                <option value="Anil Sir">Anil Sir</option>
                                                                                <option value="Pawan Sir">Pawan Sir</option>
                                                                                <option value="Manoj Sir">Manoj Sir</option>
                                                                                <option value="Hr ma'am">Hr ma'am</option>
                                                                            </select>

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>comments</b></label>
                                                                            <input type="text" name="comments" value={formData.comments} onChange={handleInputChange} class="form-control" placeholder="comments" />
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Leave</button>
                                                                    </div>
                                                                    <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
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
                                                <th scope="col" onClick={() => handleSort('employee_id')}><b>ID </b>{sortColumn === 'employee_id' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('leave_type')}><b>leave_type </b>{sortColumn === 'leave_type' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" ><b>start_date</b></th>
                                                <th scope="col" ><b>end_date</b></th>
                                                <th scope="col" ><b>reason</b></th>
                                                <th scope="col" ><b>status</b></th>
                                                <th scope="col" ><b>applied_on</b></th>
                                                <th scope="col" ><b>comments</b></th>
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
                                                    <td>{data.employee_id}</td>

                                                    <td>{data.leave_type} </td>
                                                    <td>{data.start_date} </td>
                                                    <td>{data.end_date} </td>
                                                    <td>{data.reason} </td>
                                                    <td>{data.status} </td>
                                                    <td>{data.applied_on} </td>
                                                    <td>{data.comments} </td>

                                                    < td >
                                                        <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} title="Edit Data">
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                    </td>
                                                    <td>

                                                        <label className="customcheckbox">
                                                            <input
                                                                type="checkbox"
                                                                className="listCheckbox"
                                                                checked={ids.includes(data._id)}
                                                                onChange={(e) => handleCheckboxChange(e, data._id)}
                                                            />   <span className="checkmark"></span>
                                                        </label>
                                                    </td>


                                                    <ModalBox isOpen={modalIsOpen} leaveId={selectedLeaveId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
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

export default LeaveModule;





