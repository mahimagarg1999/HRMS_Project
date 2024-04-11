// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
const ModalBox = ({ isOpen, onRequestClose, consultancyId }) => {

    const [data, setData] = useState([])
    useEffect(() => {

        if (isOpen) {
            console.log('model open', consultancyId)
            // Fetch data for the given consultancyId
            if (consultancyId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`${BASE_API_URL}consultancy/get?consultancyid=${consultancyId}`);


                        setData(response.data.data)
                        console.log('data', data)

                    } catch (error) {
                        console.log('model open error')

                        console.error('Error fetching consultancy data:', error);
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
            const response = axios.put(`${BASE_API_URL}consultancy/edit`, data);
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
                                    <input type="text" name="consultancy_name" value={data.consultancy_name} onChange={handleInputChange} class="form-control" placeholder="Consultancy Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="email" name="consultancy_email" value={data.consultancy_email} onChange={handleInputChange} class="form-control" placeholder="Consultancy Email" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="consultancy_website" value={data.consultancy_website} onChange={handleInputChange} class="form-control" placeholder="Consultancy Website" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="consultancy_mobile" value={data.consultancy_mobile} onChange={handleInputChange} class="form-control" placeholder="Consultancy Mobile" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="test" name="consultancy_alternate_mobile" value={data.consultancy_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Consultancy Alternate Mobile" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="consultancy_city" value={data.consultancy_city} onChange={handleInputChange} class="form-control" placeholder="Consultancy City" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="consultancy_state" value={data.consultancy_state} onChange={handleInputChange} class="form-control" placeholder="Consultancy State" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="consultancy_address" value={data.consultancy_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="consultancy_details" value={data.consultancy_details} onChange={handleInputChange} class="form-control" placeholder="Consultancy Details" />
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