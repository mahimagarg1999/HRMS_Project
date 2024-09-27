// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, leaveId }) => {
    const [data, setData] = useState([])
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMessage('')
            console.log('model open', leaveId)
            // Fetch data for the given employeeId
            if (leaveId) {
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${BASE_API_URL}leave/get?leaveid=${leaveId}`);
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
            const response = await axios.put(`${BASE_API_URL}leave/edit`, data);
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
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
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

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">

                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.leave} profile</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label><b>Employee ID</b></label>
                                    <input type="text" name="employee_id" value={data.employee_id} onChange={handleInputChange} class="form-control" placeholder="employee_id" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Leave Type*</b></label>
                                    <select
                                        name="leave_type"
                                        value={data.leave_type}
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
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>start_date</b></label>
                                    <input type="date" name="start_date" value={data.start_date} onChange={handleInputChange} class="form-control" placeholder="start_date" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>end_date</b></label>
                                    <input type="date" name="end_date" value={data.end_date} onChange={handleInputChange} class="form-control" placeholder="end_date" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>reason</b></label>
                                    <input type="text" name="reason" value={data.reason} onChange={handleInputChange} class="form-control" placeholder="reason" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Status*</b></label>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Status  </option>
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Rejected">Rejected  </option>

                                    </select>
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>applied_on</b></label>
                                    <input type="date" name="applied_on" value={data.applied_on} onChange={handleInputChange} class="form-control" placeholder="applied_on" />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>approved_by*</b></label>
                                    <select
                                        name="approved_by"
                                        value={data.approved_by}
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
                                    <input type="text" name="comments" value={data.comments} onChange={handleInputChange} class="form-control" placeholder="comments" />
                                </div>
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