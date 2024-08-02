// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
 import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import CloseButton from 'react-bootstrap/CloseButton';

const ModalBox = ({ isOpen, onRequestClose, skillsId }) => {

    const [data, setData] = useState([])
    const [resume, setResume] = useState('');
    const [message, setMessage] = useState('');
    const [profiles, setProfiles] = useState([]);
 
   
    useEffect(() => {
        if (isOpen) {
            setMessage('')
            setResume('')
            console.log('model open', skillsId)
            // Fetch data for the given skillsId
            if (skillsId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`${BASE_API_URL}skills/get?skillid=${skillsId}`);
                        setData(response.data.data)
                        console.log('data', data)

                    } catch (error) {
                        console.log('model open error')

                        console.error('Error fetching Skills data:', error);
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
    useEffect(() => {
        // Fetch profiles from API when the component mounts
        const fetchProfiles = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/recruitment/get_profile`);
                if (response.data.success) {
                    setProfiles(response.data.data); // Set profiles in state
                } else {
                    console.error('Failed to fetch profiles:', response.data.msg);
                }
            } catch (error) {
                console.error('Error fetching profiles:', error);
            }
        };

        fetchProfiles();
    }, []);
    const handleSubmit = async (e) => {
        const mydata = data;
       e.preventDefault();
        // Handle form submission here
        try {
            const response = await axios.put(`${BASE_API_URL}skills/edit`, data);
            console.log(response.data); // Handle the response as needed
            // onRequestClose(); // Close the modal if request is successful
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
                    // overflow: 'hidden', // Prevent scroll

                }
            }}
        >

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">

                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <CloseButton onClick={onRequestClose} />

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.skills} profile</h4>

                            </div>
                            <div class="row">
                                {/* <div class="mb-3 col-md-6">
                                    <label><b>Name</b></label>
                                    <input type="text" name="name" value={data.name} onChange={handleInputChange} class="form-control" placeholder="Name" />
                                </div> */}
                                <div className="mb-3 col-md-6">
                                    <label><b>Skills*</b></label>
                                    <select
                                        name="skills"
                                        value={data.skills}
                                        onChange={handleInputChange}
                                        className="form-control"
                                    >
                                        <option value="">Select Skills</option>
                                        <option value="JavaScript">JavaScript</option>
                                        <option value="React">React</option>
                                        <option value="Node.js">Node.js</option>
                                        <option value="Python">Python</option>
                                        <option value="HTML">HTML</option>
                                        <option value="CSS">CSS</option>
                                        <option value="MySQL">MySQL</option>
                                        <option value="MongoDB">MongoDB</option>
                                        <option value="Php">Php</option>
                                        <option value="Java">Java</option>
                                        <option value="Angular">Angular</option>
                                        <option value="Wordpress">Wordpress</option>
                                        <option value="Drupal">Drupal</option>
                                        <option value="Laravel">Laravel</option>
                                        <option value="IOS">IOS</option>
                                        <option value="Android">Android</option>
                                        <option value="Apache">Apache</option>
                                        <option value="Magento">Magento</option>
                                        <option value="WAMP">WAMP</option>
                                        <option value="Code Igniter">Code Igniter</option>
                                        <option value="Jquery">Jquery</option>
                                        <option value="XAMPP">XAMPP</option>
                                    </select>
                                 </div>

                                <div class="mb-3 col-md-6">
                                    <label><b>Description</b></label>
                                    <input type="text" name="description" value={data.description} onChange={handleInputChange} class="form-control" placeholder="Description" />
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