import React, { useEffect, useState } from 'react';
import Nav from '../../navComponent/Nav';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import './EditProfile.css'
import { useNavigate } from 'react-router-dom';

const EditProfile = () => {
    const [message, setMessage] = useState('');
    const [showOverlay, setShowOverlay] = useState(true); // New state to control overlay visibility
    const [data, setData] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        // console.log('model open', userId)
        // Fetch data for the given userId

        const fetchData = async () => {
            try {
                const id = localStorage.getItem("_id")
                const response = await axios.get(`http://localhost:5000/api/user/get?userid=${id}`);

                setData(response.data.data)
                // console.log('data', data)

            } catch (error) {
                console.log('model open error')

                console.error('Error fetching employee data:', error);
            }

        }
        fetchData();

    }, []);

    const toggleOverlay = () => setShowOverlay(!showOverlay);

    const handleSubmit = async (e) => {
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response = axios.put('http://localhost:5000/api/user/edit', data);
            console.log(response.data); // Handle the response as needed
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
        setShowOverlay(false);
        // Optionally, you can reset form fields and messages here
        // setEmail('');
        // setCurrentPassword('');
        // setNewPassword('');
        // setConfirmPassword('');
        // setMessage('');
        navigate('/admin')
    };
    return (

        <div>
            <Nav onToggleOverlay={toggleOverlay} />
            <h1>mahima</h1>
            {showOverlay && (
                <div className="overlay">
                    <div className="changePasswordContainer">


                        <div class="signup-form">
                            <button onClick={handleClose} className="closeButton">x</button>
                            <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                <div style={{ textAlign: 'center' }}>
                                    <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Your profile</h4>

                                </div>
                                <div class="row">
                                    <div class="mb-3 col-md-6">
                                        <input type="text" name="fname" value={data.fname} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="text" name="lname" value={data.lname} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="email" name="email" value={data.email} onChange={handleInputChange} class="form-control" placeholder="Email" disabled="true"/>
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="text" name="gender" value={data.gender} onChange={handleInputChange} class="form-control" placeholder="Gender" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="date" name="dob" value={data.dob} onChange={handleInputChange} class="form-control" placeholder="DOB" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="text" name="password" value={data.password} onChange={handleInputChange} class="form-control" placeholder="password" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="text" name="address" value={data.address} onChange={handleInputChange} class="form-control" placeholder="address" />
                                    </div>   <div class="mb-3 col-md-6">
                                        <input type="text" name="city" value={data.city} onChange={handleInputChange} class="form-control" placeholder="city" />
                                    </div>
                                    <div class="mb-3 col-md-6">
                                        <input type="text" name="state" value={data.state} onChange={handleInputChange} class="form-control" placeholder="state" />
                                    </div>

                                </div>
                                <div class="col-md-12">
                                    <button type="submit">EDit here</button>
                                </div>
                            </form>


                        </div>
                        <span>{message && <p>{message}</p>}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EditProfile;