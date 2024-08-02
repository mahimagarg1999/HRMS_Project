import React, { useEffect, useState } from 'react';
import Nav from '../../navComponent/Nav';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import './EditProfile.css'
import { useNavigate } from 'react-router-dom';
import Footer from '../../FooterModule/Footer';
import { BASE_API_URL } from '../../../lib/constants.jsx';
const EditProfile = () => {
    const [message, setMessage] = useState('');
    // const [showOverlay, setShowOverlay] = useState(true); // New state to control overlay visibility
    const [data, setData] = useState([])
    const navigate = useNavigate();
    useEffect(() => {
        // console.log('model open', userId)
        // Fetch data for the given userId

        const fetchData = async () => {
            try {
                const id = localStorage.getItem("_id")
                const response = await axios.get(`${BASE_API_URL}employee/get?employeeid=${id}`);

                setData(response.data.data)
                // console.log('data', data)

            } catch (error) {
                console.log('model open error')

                console.error('Error fetching employee data:', error);
            }

        }
        fetchData();

    }, []);

    // const toggleOverlay = () => setShowOverlay(!showOverlay);

    const handleSubmit = async (e) => {
        console.log("data", data)
        const pdfdoc = {
            resumePdfName: "pdf",
            proofPdfName: "pdf",
            panPdfName: "pdf",
            marksheetPdfName: "pdf",
            experiencePdfName: 'pdf',
        };
        const mergedData = { ...data, ...pdfdoc };
        e.preventDefault();
        // Handle form submission here
        try {
            const response = await axios.put(`${BASE_API_URL}employee/edit`, mergedData);
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
        // setShowOverlay(false);
        // Optionally, you can reset form fields and messages here
        // setEmail('');
        // setCurrentPassword('');
        // setNewPassword('');
        // setConfirmPassword('');
        // setMessage('');
        navigate('/admin')
    };
    return (
        <>
            <div>
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerUser'>EDIT PROFILE</h1>
                </div>              {/* {showOverlay && (
                <div className="overlay"> */}
                <div >


                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <button onClick={handleClose} className="closeButton1">x</button>

                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit {data.employee_first_name} profile</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label><b>First Name</b></label>
                                    <input type="text" name="employee_first_name" value={data.employee_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Last Name</b></label>
                                    <input type="text" name="employee_last_name" value={data.employee_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Email</b></label>
                                    <input type="email" name="employee_email" value={data.employee_email} onChange={handleInputChange} class="form-control" placeholder="Email" disabled="true" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Mobile No</b></label>
                                    <input type="text" name="employee_mobile" value={data.employee_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile" />
                                </div>

                                <div class="mb-3 col-md-6">
                                    <label><b>Password</b></label>
                                    <input type="text" name="employee_password" value={data.employee_password} onChange={handleInputChange} class="form-control" placeholder="password" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Address</b></label>
                                    <input type="text" name="employee_address" value={data.employee_address} onChange={handleInputChange} class="form-control" placeholder="address" />
                                </div>   <div class="mb-3 col-md-6">
                                <label><b>City</b></label>
                                    <input type="text" name="employee_city" value={data.employee_city} onChange={handleInputChange} class="form-control" placeholder="city" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <label><b>State</b></label>
                                    <input type="text" name="state" value={data.employee_state} onChange={handleInputChange} class="form-control" placeholder="state" />
                                </div>

                            </div>
                            <div class="col-md-12">
                                <button type="submit">Edit here</button>
                            </div>
                            <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                        </form>


                    </div>
                </div>
                {/* </div>
            )} */}
            </div>
            <Footer />
        </>
    );
}

export default EditProfile;