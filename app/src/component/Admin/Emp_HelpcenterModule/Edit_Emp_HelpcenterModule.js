// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';
const ModalBox = ({ isOpen, onRequestClose, helpCenterId }) => {
    const [data, setData] = useState([])
    const [message, setMessage] = useState('');
    useEffect(() => {
        if (isOpen) {
            setMessage('')
            console.log('model open', helpCenterId)
            // Fetch data for the given employeeId
            if (helpCenterId) {
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${BASE_API_URL}helpcenter/get?helpcenterid=${helpCenterId}`);
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

    const handleSubmit = async (e) => {
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response = await axios.put(`${BASE_API_URL}helpcenter/edit`, data);
            console.log(response.data); // Handle the response as needed
            setMessage(response.data.msg);

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
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    // display: 'flex',
                    // justifyContent: 'center',
                    // alignItems: 'center',
                },
                content: {
                    width: '100%',
                    height: '100%',
                    margin: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',

                }
            }}
        >
            {/* <button onClick={onRequestClose}>Close</button> */}

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                        <CloseButton onClick={onRequestClose} />
                            <div style={{ textAlign: 'center' }}>
                               
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Help Center</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label><b>Ticket Id</b></label>
                                    <input type="text" name="helpcenter_ticket_id" value={data.helpcenter_ticket_id} onChange={handleInputChange} class="form-control" placeholder="Ticket Id" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee Id</b></label>
                                    <input type="text" name="helpcenter_employee_id" value={data.helpcenter_employee_id} onChange={handleInputChange} class="form-control" placeholder="Employee Id" />
                                </div>

                                {/* <div class="mb-3 col-md-6">
                                    <label><b>Ticket Priority</b></label>
                                    <input type="text" name="helpcenter_ticket_priority" value={data.helpcenter_ticket_priority} onChange={handleInputChange} class="form-control" placeholder="Ticket Priority" />
                                </div> */}
                                <div class="mb-3 col-md-6">
                                    <label><b>Ticket Priority</b></label>
                                    <select
                                        name="helpcenter_ticket_priority"
                                        value={data.helpcenter_ticket_priority}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Ticket Priority</option>
                                        <option value="low">low</option>
                                        <option value="medium">medium</option>
                                        <option value="high">high</option>


                                    </select>
                                </div>
                                {/* <div class="mb-3 col-md-6">
                                    <label><b>Ticket Department</b></label>
                                    <input type="text" name="helpcenter_ticket_department" value={data.helpcenter_ticket_department} onChange={handleInputChange} class="form-control" placeholder="Ticket Department" />
                                </div> */}
                                <div class="mb-3 col-md-6">
                                    <lable><b>Ticket Department</b></lable>
                                    <select
                                        name="helpcenter_ticket_department"
                                        value={data.helpcenter_ticket_department}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Ticket Department</option>
                                        <option value="Administer">Administer</option>
                                        <option value="HR">HR</option>
                                    </select>
                                </div>
                                {/* <div class="mb-3 col-md-6">
                                    <label><b>Ticket Created Date</b></label>
                                    <input type="date" name="helpcenter_ticket_created_date" value={data.helpcenter_ticket_created_date} onChange={handleInputChange} class="form-control" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Ticket Solved Date</b></label>
                                    <input type="date" name="helpcenter_ticket_solved_date" value={data.helpcenter_ticket_solved_date} onChange={handleInputChange} class="form-control" />
                                </div> */}
                                <div class="mb-3 col-md-6">
                                    <label><b>Ticket Status</b></label>
                                    <input type="text" name="helpcenter_ticket_status" value={data.helpcenter_ticket_status} onChange={handleInputChange} class="form-control" placeholder="Ticket Status" />
                                </div>

                                <div class="mb-3 col-md-6">
                                    <label><b>Ticket Solved By</b></label>
                                    <input type="text" name="helpcenter_ticket_solved_by" value={data.helpcenter_ticket_solved_by} onChange={handleInputChange} class="form-control" placeholder="Ticket Solved By" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Ticket Managed By</b></label>
                                    <input type="text" name="helpcenter_ticket_managed_by" value={data.helpcenter_ticket_managed_by} onChange={handleInputChange} class="form-control" placeholder="Ticket Managed By" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Solve Duration</b></label>
                                    <input type="text" name="helpcenter_solve_duration" value={data.helpcenter_solve_duration} onChange={handleInputChange} class="form-control" placeholder="Solved Duration" />
                                </div>
                                <div class="mb-3 col-md-6">

                                    <label><b>Ticket Description</b></label>
                                    <textarea type="text" name="helpcenter_ticket_description" value={data.helpcenter_ticket_description} onChange={handleInputChange} class="form-control" placeholder="Ticket Discription" ></textarea>
                                </div>
                                {/* <div class="mb-3 col-md-6">
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
    );
};


export default ModalBox;