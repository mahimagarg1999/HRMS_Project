// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';

const ModalBox = ({ isOpen, onRequestClose, helpCenterId }) => {

    const [data, setData] = useState([])
    useEffect(() => {

        if (isOpen) {
            console.log('model open', helpCenterId)
            // Fetch data for the given employeeId
            if (helpCenterId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`http://localhost:5000/api/helpcenter/get?helpcenterid=${helpCenterId}`);


                        setData(response.data.data)
                        console.log('data', data)

                    } catch (error) {
                        console.log('model open error')

                        console.error('Error fetching employee data:', error);
                    }
                };

                fetchData();
            }
        }
    }, [isOpen]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response = axios.put('http://localhost:5000/api/helpcenter/edit', data);
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
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
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Your profile</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_id" value={data.helpcenter_ticket_id} onChange={handleInputChange} class="form-control" placeholder="Ticket Id" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_employee_id" value={data.helpcenter_employee_id} onChange={handleInputChange} class="form-control" placeholder="Employee Id" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_description" value={data.helpcenter_ticket_description} onChange={handleInputChange} class="form-control" placeholder="Ticket Discription" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_priority" value={data.helpcenter_ticket_priority} onChange={handleInputChange} class="form-control" placeholder="Ticket Priority" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_department" value={data.helpcenter_ticket_department} onChange={handleInputChange} class="form-control" placeholder="Ticket Department" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label>helpcenter_ticket_created_date</label>
                                    <input type="date" name="helpcenter_ticket_created_date" value={data.helpcenter_ticket_created_date} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_status" value={data.helpcenter_ticket_status} onChange={handleInputChange} class="form-control" placeholder="Ticket Status" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label>helpcenter_ticket_solved_date</label>
                                    <input type="date" name="helpcenter_ticket_solved_date" value={data.helpcenter_ticket_solved_date} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_solved_by" value={data.helpcenter_ticket_solved_by} onChange={handleInputChange} class="form-control" placeholder="Ticket Solved By" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket_managed_by" value={data.helpcenter_ticket_managed_by} onChange={handleInputChange} class="form-control" placeholder="Ticket Managed By" />
                                </div>


                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket1" value={data.helpcenter_ticket1} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-1" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket2" value={data.helpcenter_ticket2} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-2" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket3" value={data.helpcenter_ticket3} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-3" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket4" value={data.helpcenter_ticket4} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-4" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket5" value={data.helpcenter_ticket5} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-5" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket6" value={data.helpcenter_ticket6} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket6" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket8" value={data.helpcenter_ticket8} onChange={handleInputChange} class="form-control" placeholder="Helpcenter ticket8" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket9" value={data.helpcenter_ticket9} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-9" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket10" value={data.helpcenter_ticket10} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-10" />
                                </div>
                            </div>
                            <div class="col-md-12">
                                <button type="submit">EDit here</button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default ModalBox;