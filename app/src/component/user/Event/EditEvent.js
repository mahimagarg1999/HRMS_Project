// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, eventId }) => {
    // const [data, setData] = useState([])
    const [data, setData] = useState({ participants: [] });

    const [message, setMessage] = useState('');

    useEffect(() => {
        if (isOpen) {
            setMessage('')
            console.log('model open', eventId)
            // Fetch data for the given employeeId
            if (eventId) {
                const fetchData = async () => {
                    try {
                        const response = await axios.get(`${BASE_API_URL}events/get?eventid=${eventId}`);
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
            const response = await axios.put(`${BASE_API_URL}events/edit`, data);
            console.log(response.data); // Handle the response as needed
            // setMessage(response.data.msg);
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
                                    <label><b>Event Name</b></label>
                                    <input
                                        type="text"
                                        name="eventName"
                                        value={data.eventName}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Event Name"
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Event Date*</b></label>
                                    <input
                                        type="date"
                                        name="eventDate"
                                        value={data.eventDate}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Event Date"
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Event Time*</b></label>
                                    <input
                                        type="time"
                                        name="eventTime"
                                        value={data.eventTime}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Event Time"
                                    />
                                </div>
                                <div className="mb-3 col-md-6">
                                    <label><b>Event Location*</b></label>
                                    <input
                                        type="text"
                                        name="eventLocation"
                                        value={data.eventLocation}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Event Location"
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
                                        <option value="scheduled">scheduled</option>
                                        <option value="completed">completed</option>
                                        <option value="cancelled">cancelled</option>
                                    </select>
                                </div>
                                <div className="mb-3 col-md-12">
                                    <label><b>Event Description</b></label>
                                    <textarea
                                        name="eventDescription"
                                        value={data.eventDescription}
                                        onChange={handleInputChange}
                                        className="form-control"
                                        placeholder="Event Description"
                                    />
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