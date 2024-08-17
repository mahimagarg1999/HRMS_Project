import React, { useEffect, useState } from 'react';
 import axios from 'axios'; // Make sure to install axios with npm or yarn
import './AdminHelpCenter.css'
import { useNavigate } from 'react-router-dom';
 import { BASE_API_URL } from '../../../lib/constants.jsx';
import Modal from 'react-modal';

const HelpCenterModule = ({ isOpen, onRequestClose, helpCenterId }) => {
    const [message, setMessage] = useState('');
    // const [showOverlay, setShowOverlay] = useState(true); // New state to control overlay visibility
    const [data, setData] = useState([])
 
    const navigate = useNavigate();
    useEffect(() => {
        // console.log('model open', userId)
        // Fetch data for the given userId
        if (isOpen) {
            console.log('model open', helpCenterId)
            if (helpCenterId) {

                const fetchData = async () => {
                    try {
                        const helpCenterId = localStorage.getItem("_id")
                        const response = await axios.get(`${BASE_API_URL}emphelpcenter/emp_helpcenter_get_emp_id?helpcenterempid=${helpCenterId}`);

                        setData(response.data.data)
                        // console.log('data', data)

                    } catch (error) {
                        console.log('model open error')
                        console.error('Error fetching employee data:', error);
                    }

                }
                fetchData();
            }
        }
    }, [isOpen]);

    
    

    const handleSubmit = async (e) => {
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response = await axios.put(`${BASE_API_URL}emphelpcenter/emp_helpcenter_edit`, data);
            console.log(response.data); // Handle the response as needed
            setMessage(response.data.msg)
 
            // if(response.)
        } catch (error) {
            console.error('Error:', error);
        }

    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleClose = () => {

        navigate('/admin')
    };
    return (
        <>
            <Modal
                isOpen={isOpen}
                onRequestClose={onRequestClose}
                ariaHideApp={false}
                style={{
                    overlay: {

                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    content: {
                        width: '90%',
                        height: '90%',
                        margin: 'auto',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                        padding: '20px'
                    }
                }}
            >
                <button onClick={onRequestClose}>Close</button>
                <div class="row">  
                    <div class="col-md-6 offset-md-3"> 
                        <div class="signup-form">
                            <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
 
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Help</h4>

                                </div>
                                <div class="row">
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Ticket ID</h6>

                                        <input type="text" name="helpcenter_ticket_id" value={data.helpcenter_ticket_id} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_id" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Employee ID</h6>
                                        <input type="text" name="helpcenter_employee_id" value={data.helpcenter_employee_id} onChange={handleInputChange} class="form-control" placeholder="helpcenter_employee_id" disabled="true"/>
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Ticket Description</h6>
                                        <input type="text" name="helpcenter_ticket_description" value={data.helpcenter_ticket_description} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_description" disabled="true" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Ticket Priority</h6>
                                        <input type="text" name="helpcenter_ticket_priority" value={data.helpcenter_ticket_priority} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_priority" />
                                    </div>

                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Ticket Department</h6>
                                        <input type="text" name="helpcenter_ticket_department" value={data.helpcenter_ticket_department} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_department" />
                                    </div>
                                    {/* <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Ticket Status</h6>
                                        <input type="text" name="helpcenter_ticket_status" value={data.helpcenter_ticket_status} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_status" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Created Date</h6>

                                        <input type="date" name="helpcenter_ticket_created_date" value={data.helpcenter_ticket_created_date} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_created_date" />
                                    </div> */}

                                    {/* <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Solved Date</h6>
                                        <input type="date" name="helpcenter_ticket_solved_date" value={data.helpcenter_ticket_solved_date} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_solved_date" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Solved by</h6>
                                        <input type="text" name="helpcenter_ticket_solved_by" value={data.helpcenter_ticket_solved_by} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_solved_by" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <h6 style={{ color: "#28769a" }}>Managed by</h6>
                                        <input type="text" name="helpcenter_ticket_managed_by" value={data.helpcenter_ticket_managed_by} onChange={handleInputChange} class="form-control" placeholder="helpcenter_ticket_managed_by" />
                                    </div> */}

                                </div>
                                <div class="col-md-12">
                                    <button type="submit">Edit here</button>
                                </div>
                                <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                            </form>


                        </div>
                    </div>

                </div>
             </Modal>
        </>
    );
}

export default HelpCenterModule;