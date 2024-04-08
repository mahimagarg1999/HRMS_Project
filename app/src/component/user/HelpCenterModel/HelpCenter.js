import React, { useState, useEffect } from 'react';
import './HelpCenter.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditHelpCenterModel.js';
import { Link } from 'react-router-dom';
import Nav from '../../navComponent/Nav';

const HelpCenterModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedHelpCenterId, setSelectedHelpCenterId] = useState(null);
    const [message, setMessage] = useState('');

    // const [data, setData] = useState(formData);
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
        helpcenter_employee_id: '',
        helpcenter_ticket_description: '',
        helpcenter_ticket_priority: '',
        helpcenter_ticket_department: '',
        helpcenter_ticket_created_date: '',
        helpcenter_ticket_status: '',
        helpcenter_ticket_solved_date: '',
        helpcenter_ticket_solved_by: '',
        helpcenter_ticket_managed_by: '',
        helpcenter_ticket1: '',
        helpcenter_ticket2: '',
        helpcenter_ticket3: '',
        helpcenter_ticket4: '',
        helpcenter_ticket5: '',
        helpcenter_ticket6: '',
        helpcenter_ticket7: '',
        helpcenter_ticket8: '',
        helpcenter_ticket9: '',
        helpcenter_ticket10: '',

    });
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/helpcenter/list');
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    const openPopup = () => {
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
    const handleSubmit =async (e) => {
        e.preventDefault();
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if(validateForm())
        try {
            const response = await axios.post('http://localhost:5000/api/helpcenter/create', formData);
            settogle(!togle)
            console.log(response.data); // Handle the response as needed
            setMessage(response.data.msg);

        } catch (error) {
            console.error('Error:', error);
        }
    };
    const DeleteData = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = axios.delete(`http://localhost:5000/api/helpcenter/delete?id=${id}`)

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



    return (
        <div style={{ backgroundColor: '#28769a' }}>
            <Nav />
            <h1 className='headerUser'>Welcome To HelpCenter Page</h1>
            <div >
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5 className="card-title m-b-0">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add HelpCenter +
                                    </button>
                                </h5>
                                <Link to="/user" className="nav-item backButton">Back</Link>

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
                                                                        <input type="text" name="helpcenter_ticket_id" value={formData.helpcenter_ticket_id} onChange={handleInputChange} class="form-control" placeholder="Ticket Id" />
                                                                        {errors.helpcenter_ticket_id && <span className="error" style={{color:'red'}}>{errors.helpcenter_ticket_id}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_employee_id" value={formData.helpcenter_employee_id} onChange={handleInputChange} class="form-control" placeholder="Employee Id" />
                                                                        {errors.helpcenter_employee_id && <span className="error" style={{color:'red'}}>{errors.helpcenter_employee_id}</span>}

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


                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket1" value={formData.helpcenter_ticket1} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-1" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket2" value={formData.helpcenter_ticket2} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-2" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket3" value={formData.helpcenter_ticket3} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-3" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket4" value={formData.helpcenter_ticket4} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-4" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket5" value={formData.helpcenter_ticket5} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-5" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket7" value={formData.helpcenter_ticket7} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket7" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket6" value={formData.helpcenter_ticket6} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket6" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket8" value={formData.helpcenter_ticket8} onChange={handleInputChange} class="form-control" placeholder="Helpcenter ticket8" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket9" value={formData.helpcenter_ticket9} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-9" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="helpcenter_ticket10" value={formData.helpcenter_ticket10} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-10" />
                                                                    </div>
                                                                    <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>

                                                                </div>
                                                                <div class="col-md-12">
                                                                    <button type="submit">ADD HELPCENTER</button>
                                                                </div>
                                                            </form>
                                                            <p class="text-center mt-3 text-secondary">If you have account, Please <a href="#">Login Now</a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>       </div>
                                    </div>
                                )}
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>
                                                <label className="customcheckbox m-b-20">
                                                    <input type="checkbox" id="mainCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </th>
                                            <th scope="col">id</th>
                                            {/* <th scope="col">helpcenter_ticket_id</th>
                                            <th scope="col">helpcenter_employee_id</th> */}
                                            <th scope="col"> Ticket Status</th>
                                            <th scope="col"> Ticket Solved By</th>
                                            <th scope="col"> Ticket Managed By</th>
                                            <th scope="col" >#ACTIONS</th>

                                        </tr>
                                    </thead>
                                    <tbody className="customtable">
                                        {tableData.map((data, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <label className="customcheckbox">
                                                        <input type="checkbox" className="listCheckbox" />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td>
                                                <td>{data._id}</td>
                                                {/* <td>{data.helpcenter_ticket_id} </td>
                                                <td>{data.helpcenter_employee_id}</td> */}
                                                <td>{data.helpcenter_ticket_status}</td>
                                                <td>{data.helpcenter_ticket_solved_by}</td>
                                                <td>{data.helpcenter_ticket_managed_by}</td>
                                                <button onClick={() => DeleteData(data._id)} style={{ backgroundColor: 'red' }}>DELETE</button>
                                                <button onClick={() => { openModal(data._id) }} style={{ backgroundColor: 'green' }}> EDIT</button>
                                                <ModalBox isOpen={modalIsOpen} helpCenterId={selectedHelpCenterId} onRequestClose={closeModal}>
                                                    <h2>Modal Title</h2>
                                                    <p>Modal Content</p>
                                                </ModalBox>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <div>

            </div>


        </div>
    );
}

export default HelpCenterModule;
