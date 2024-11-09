// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, meetingId }) => {
    // const [data, setData] = useState([])
    const [data, setData] = useState({ participants: [] });

    const [message, setMessage] = useState('');
    const [employeeIds, setEmployeeIds] = useState([]); // Store fetched employee IDs

    const fetchEmployeeIds = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/get-emp-id-for-meeting');
            console.log(response.data); // Log the response to verify its structure
            if (response.data.success) {
                setEmployeeIds(response.data.data); // Set the employee data
                console.log("response.data.success", response.data.success)
            } else {
                console.error("Failed to fetch employee IDs:", response.data.msg);
            }
        } catch (error) {
            console.error("Error fetching employee IDs:", error);
        }
    };



    useEffect(() => {
        if (isOpen) {
            setMessage('')
            console.log('model open', meetingId)
            // Fetch data for the given employeeId
            if (meetingId) {
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${BASE_API_URL}meeting/get?meetingid=${meetingId}`);
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
            const response = await axios.put(`${BASE_API_URL}meeting/edit`, data);
            console.log(response.data); // Handle the response as needed
            if (response.data.success) {
                setMessage(response.data.msg);
                setTimeout(() => {
                    onRequestClose(); // Close the modal
                }, 2000); // Adjust the time (in milliseconds) as needed
            } else {
                setMessage(response.data.msg); // Show error message if not successful
            }

        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleParticipantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedParticipants = [...data.participants];
        updatedParticipants[index][name] = value;
        setData((prevData) => ({
            ...prevData,
            participants: updatedParticipants
        }));
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
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.title} profile</h4>

                            </div>
                            <div className="row">
                                <div className="mb-3 col-md-6">
                                    <label><b>Meeting Name</b></label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={data.title}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Meeting Name"
                                    />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>Description  </b></label>
                                    <input
                                        type="text"
                                        name="description"
                                        value={data.description}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="description"
                                    />
                                </div>

                                <div className="mb-3 col-md-6">
                                    <label><b>Scheduled Date*</b></label>
                                    <input
                                        type="date"
                                        name="scheduledDate"
                                        value={data.scheduledDate}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Scheduled Date"
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Start Time*</b></label>
                                    <input
                                        type="time"
                                        name="startTime"
                                        value={data.startTime}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Start Time"
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>End Time*</b></label>
                                    <input
                                        type="time"
                                        name="endTime"
                                        value={data.endTime}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="End Time"
                                    />
                                 </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Meeting Location*</b></label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={data.location}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Location"
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Status</b></label>
                                    <select
                                        name="status"
                                        value={data.status}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Status</option>
                                        <option value="Scheduled">Scheduled</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-6">
                                                                            <label><b>Meeting To*</b></label>
                                                                            <select
                                                                                name="meetingTo"
                                                                                value={data.meetingTo}
                                                                                onChange={handleInputChange}
                                                                                onFocus={fetchEmployeeIds}  
                                                                                className="form-control"
                                                                                required
                                                                            >
                                                                                <option value="">Select an employee</option>
                                                                                {employeeIds.map(employee => (
                                                                                    <option key={employee._id} value={employee._id}>
                                                                                        {employee._id}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                           
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Meeting With*</b></label>
                                                                            <select
                                                                                name="meetingWith"
                                                                                value={data.meetingWith}
                                                                                onChange={handleInputChange}
                                                                                onFocus={fetchEmployeeIds}
                                                                                className="form-control"
                                                                                required
                                                                            >
                                                                                <option value="">Select an employee</option>
                                                                                {employeeIds.map(employee => (
                                                                                    <option key={employee._id} value={employee._id}>
                                                                                        {employee._id}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                           
                                                                        </div>
                                                                        <div className="mb-3 col-md-12">
                                                                            <h4>Participants:</h4>
                                                                            {data.participants.map((participant, index) => (
                                                                                <div key={index} className="mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        name="name"
                                                                                        placeholder="Name"
                                                                                        value={participant.name}
                                                                                        onChange={(e) => handleParticipantChange(index, e)}
                                                                                        className="form-control"
                                                                                    />
                                                                                     <input
                                                                                        type="email"
                                                                                        name="email"
                                                                                        placeholder="Email"
                                                                                        value={participant.email}
                                                                                        onChange={(e) => handleParticipantChange(index, e)}
                                                                                        className="form-control"
                                                                                    />
                                                                                 </div>
                                                                            ))}
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