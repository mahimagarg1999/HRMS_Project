import React, { useEffect, useState } from 'react';
import Nav from '../../navComponent/Nav';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import './AdminHelpCenter.css'
import { useNavigate } from 'react-router-dom';
import Footer from '../../FooterModule/Footer';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalBox from './EditAdminHelpCenter.js';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';

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
    const [ids, setId] = useState([]);
 
    const id = localStorage.getItem("_id")
    const empCode = localStorage.getItem("employee_code")

    const [query, setQuery] = useState('');

   

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    

   
    const Deletemulti = async () => {
        const data = {
            "ids": ids
        };
        console.log('ids', data);

        try {
            const response = await axios.delete(`${BASE_API_URL}emphelpcenter/emp_helpcenter_multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
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
    const [formData, setFormData] = useState({});
    useEffect(() => {
        const fetchData = async () => {
            try {

                const response = await axios.get(`${BASE_API_URL}emphelpcenter/emp_helpcenter_list`);
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
            helpcenter_ticket_id: '',
            helpcenter_employee_id: localStorage.getItem("_id"),
            helpcenter_ticket_description: '',
            helpcenter_ticket_priority: '',
            helpcenter_ticket_department: '',

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
        formData.helpcenter_employee_code = localStorage.getItem('_id')
        formData.helpcenter_ticket_managed_by = 'hr'
        formData.helpcenter_ticket_solved_by = 'hr'
        formData.helpcenter_ticket_status = 'Active'
        formData.helpcenter_employee_id = localStorage.getItem('employee_code')
        e.preventDefault();
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}emphelpcenter/emp_helpcenter_create`, formData);
                settogle(!togle)
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
    const DeleteData = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = await axios.delete(`${BASE_API_URL}emphelpcenter/emp_helpcenter_delete?id=${id}`)
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
        helpcenter_ticket_description: "",

    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.helpcenter_ticket_description.trim()) {
            newErrors.helpcenter_ticket_description = "helpcenter_ticket_description is required";
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
                const response = await axios.get(`${BASE_API_URL}emphelpcenter/emp_helpcenter_search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}emphelpcenter/emp_helpcenter_list`);
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



                                                                        <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>

                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">ADD HELPCENTER</button>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>       </div>
                                        </div>
                                    )}
                                </div>


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


