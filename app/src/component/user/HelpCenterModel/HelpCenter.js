import React, { useState, useEffect } from 'react';
import './HelpCenter.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditHelpCenterModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';

import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
const HelpCenterModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedHelpCenterId, setSelectedHelpCenterId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [ids, setIds] = useState([]);
    const id = localStorage.getItem("_id")
    const [query, setQuery] = useState('');
    const empCode = localStorage.getItem("employee_code")

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const handleSort = async (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            try {
                const response = await axios.get(`${BASE_API_URL}helpcenter/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
            const response = await axios.delete(`${BASE_API_URL}helpcenter/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };



    const openModal = (helpCenterId) => {
        console.log('helpCenterId', helpCenterId)
        setModalIsOpen(true);
        setSelectedHelpCenterId(helpCenterId);

    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };

    const [formData, setFormData] = useState({
        helpcenter_ticket_id: '',
        // helpcenter_employee_id: '',
        helpcenter_employee_id: id,
        helpcenter_ticket_description: '',
        helpcenter_ticket_priority: '',
        helpcenter_ticket_department: '',
        helpcenter_ticket_created_date: '',
        helpcenter_ticket_status: '',
        helpcenter_ticket_solved_date: '',
        helpcenter_ticket_solved_by: '',
        helpcenter_ticket_managed_by: '',
        helpcenter_solve_duration: '',

        // helpcenter_ticket1: '',
        // helpcenter_ticket2: '',
        // helpcenter_ticket3: '',
        // helpcenter_ticket4: '',
        // helpcenter_ticket5: '',
        // helpcenter_ticket6: '',
        // helpcenter_ticket7: '',
        // helpcenter_ticket8: '',
        // helpcenter_ticket9: '',
        // helpcenter_ticket10: '',

    });
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_API_URL}helpcenter/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    // const openPopup = () => {
    //     setMessage('')
    //     setIsOpen(true);
    // };
    const openPopup = () => {
        setMessage('');
        setFormData('');
        let formDataNew = {
            helpcenter_ticket_id: '',
            helpcenter_employee_id: localStorage.getItem("_id"),
            helpcenter_ticket_description: '',
            helpcenter_ticket_priority: '',
            helpcenter_ticket_department: '',
            helpcenter_ticket_status: 'Active',
            helpcenter_ticket_solved_by: 'hr',
            helpcenter_ticket_managed_by: 'hr',
            helpcenter_employee_code: empCode,
            helpcenter_solve_duration: ''
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
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}helpcenter/create`, formData);
                settogle(!togle)
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg);

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
                const response = await axios.delete(`${BASE_API_URL}helpcenter/delete?id=${id}`)

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
    // validation
    const [errors, setErrors] = useState({
        helpcenter_ticket_id: "",
        helpcenter_employee_id: "",
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.helpcenter_ticket_id.trim()) {
            newErrors.helpcenter_ticket_id = "helpcenter_ticket_id is required";
            isValid = false;
        }

        if (!formData.helpcenter_employee_id.trim()) {
            newErrors.helpcenter_employee_id = "helpcenter_employee_id is required";
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
                const response = await axios.get(`${BASE_API_URL}helpcenter/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}helpcenter/list`);
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
                    <h1 className='headerUser'>WELCOME TO HELPCENTER PAGE</h1>
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
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Helpcenter Data</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">

                                                                        {/* <div class="mb-3 col-md-6">
                                                                        <label><b>Employee Id</b></label>
                                                                        <input type="text" name="helpcenter_employee_id" value={formData.helpcenter_employee_id} readOnly class="form-control" placeholder="Employee Id" />
 
                                                                    </div> */}
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Employee Code</b></label>
                                                                            <input type="text" name="helpcenter_employee_id" value={empCode} readOnly class="form-control" placeholder="Employee Code" />

                                                                        </div>


                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Ticket Priority</b></label>
                                                                            <select
                                                                                name="helpcenter_ticket_priority"
                                                                                value={formData.helpcenter_ticket_priority}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Ticket Priority</option>
                                                                                <option value="low">low</option>
                                                                                <option value="medium">medium</option>
                                                                                <option value="high">high</option>


                                                                            </select>
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <lable><b>Ticket Department</b></lable>
                                                                            <select
                                                                                name="helpcenter_ticket_department"
                                                                                value={formData.helpcenter_ticket_department}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Ticket Department</option>
                                                                                <option value="Administer">Administer</option>
                                                                                <option value="HR">HR</option>
                                                                            </select>
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <lable><b>Ticket Status</b></lable>

                                                                            <input type="text" name="helpcenter_ticket_status" value="Active" class="form-control" placeholder="Ticket Status" />
                                                                        </div>



                                                                        <div class="mb-3 col-md-6">
                                                                            <lable><b>Ticket Solved By</b></lable>
                                                                            <input type="text" name="helpcenter_ticket_solved_by" value='hr' class="form-control" placeholder="Ticket Solved By" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <lable><b>Ticket Managed By</b></lable>

                                                                            <input type="text" name="helpcenter_ticket_managed_by" value='hr' class="form-control" placeholder="Ticket Managed By" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Ticket Description*</b></label>
                                                                            <textarea
                                                                                name="helpcenter_ticket_description"
                                                                                value={formData.helpcenter_ticket_description}
                                                                                onChange={handleInputChange}
                                                                                class="form-control"
                                                                                placeholder="Ticket Description"
                                                                            >
                                                                            </textarea>
                                                                            {errors.helpcenter_ticket_description && <span className="error" style={{ color: 'red' }}>{errors.helpcenter_ticket_description}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>helpcenter_solve_duration*</b></label>
                                                                            <textarea
                                                                                name="helpcenter_solve_duration"
                                                                                value={formData.helpcenter_solve_duration}
                                                                                onChange={handleInputChange}
                                                                                class="form-control"
                                                                                placeholder="Solve Duration"
                                                                            >
                                                                            </textarea>
                                                                            {errors.helpcenter_solve_duration && <span className="error" style={{ color: 'red' }}>{errors.helpcenter_solve_duration}</span>}

                                                                        </div>


                                                                        <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>

                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">ADD HELPCENTER</button>
                                                                    </div>
                                                                </form>
                                                                {/* <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Create Your Account</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_id" value={formData.helpcenter_ticket_id} onChange={handleInputChange} class="form-control" placeholder="Ticket Id" />
                                                                            {errors.helpcenter_ticket_id && <span className="error" style={{ color: 'red' }}>{errors.helpcenter_ticket_id}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_employee_id" value={formData.helpcenter_employee_id} onChange={handleInputChange} class="form-control" placeholder="Employee Id" />
                                                                            {errors.helpcenter_employee_id && <span className="error" style={{ color: 'red' }}>{errors.helpcenter_employee_id}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_description" value={formData.helpcenter_ticket_description} onChange={handleInputChange} class="form-control" placeholder="Ticket Discription" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_priority" value={formData.helpcenter_ticket_priority} onChange={handleInputChange} class="form-control" placeholder="Ticket Priority" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_department" value={formData.helpcenter_ticket_department} onChange={handleInputChange} class="form-control" placeholder="Ticket Department" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_status" value={formData.helpcenter_ticket_status} onChange={handleInputChange} class="form-control" placeholder="Ticket Status" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label>helpcenter_ticket_created_date</label>
                                                                            <input type="date" name="helpcenter_ticket_created_date" value={formData.helpcenter_ticket_created_date} onChange={handleInputChange} class="form-control" />
                                                                        </div>

                                                                        <div class="mb-3 col-md-6">
                                                                            <label>helpcenter_ticket_solved_date</label>
                                                                            <input type="date" name="helpcenter_ticket_solved_date" value={formData.helpcenter_ticket_solved_date} onChange={handleInputChange} class="form-control" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_solved_by" value={formData.helpcenter_ticket_solved_by} onChange={handleInputChange} class="form-control" placeholder="Ticket Solved By" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <input type="text" name="helpcenter_ticket_managed_by" value={formData.helpcenter_ticket_managed_by} onChange={handleInputChange} class="form-control" placeholder="Ticket Managed By" />
                                                                        </div>




                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">ADD HELPCENTER</button>
                                                                    </div>
                                                                    <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                                                                </form> */}
                                                                <p class="text-center mt-3 text-secondary">If you have account, Please <a href="#">Login Now</a></p>
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

                                                {/* <th scope="col"  >ID  </th>
                                                <th scope="col" onClick={() => handleSort('helpcenter_employee_id')}> Emp Id{sortColumn === 'helpcenter_employee_id' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th> */}
                                                <th scope="col" onClick={() => handleSort('helpcenter_employee_code')}><b> Emp Code</b>{sortColumn === 'helpcenter_employee_code' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('helpcenter_ticket_status')}> <b>Ticket Status</b>{sortColumn === 'helpcenter_ticket_status' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>


                                                <th scope="col" onClick={() => handleSort('helpcenter_ticket_solved_by')}> <b>Ticket Solved By </b>{sortColumn === 'helpcenter_ticket_solved_by' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('helpcenter_ticket_managed_by')}> <b>Ticket Managed By </b>{sortColumn === 'helpcenter_ticket_managed_by' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('helpcenter_solve_duration')}> <b>Solve Duration</b>{sortColumn === 'helpcenter_solve_duration' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('helpcenter_ticket_description')}> <b>Ticket Description</b> {sortColumn === 'helpcenter_ticket_description' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" ><b>Actions</b></th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                        {/* <span className="checkmark"></span> */}
                                                    </label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>

                                                    {/* <td>{data._id}</td>
                                                    <td>{data.helpcenter_employee_id}</td> */}
                                                    <td>{data.helpcenter_employee_code}</td>
                                                    <td>{data.helpcenter_ticket_status}</td>
                                                    <td>{data.helpcenter_ticket_solved_by}</td>
                                                    <td>{data.helpcenter_ticket_managed_by}</td>

                                                    <td>{data.helpcenter_solve_duration}</td>

                                                    <td>{data.helpcenter_ticket_description}</td>
                                                    <td>
                                                        {/* <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button> */}
                                                        <button className="editButton" onClick={() => openModal(data._id)} >
                                                            <FontAwesomeIcon icon={faEdit} />
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
                                                    <ModalBox isOpen={modalIsOpen} helpCenterId={selectedHelpCenterId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* <ReactPaginate
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    breakLabel={'...'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                /> */}
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


            </div>
            <Footer />
        </>
    );
}

export default HelpCenterModule;
