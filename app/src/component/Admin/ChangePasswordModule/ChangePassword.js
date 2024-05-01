import React, { useEffect, useState } from 'react';
import Nav from '../../navComponent/Nav';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import './ChangePassword.css'
import { useNavigate } from 'react-router-dom';
import Footer from '../../FooterModule/Footer';
import { BASE_API_URL } from '../../../lib/constants.jsx';

const ChangePassword = () => {
    const [employee_email, setEmail] = useState(localStorage.getItem("email"));
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [showOverlay, setShowOverlay] = useState(true); // New state to control overlay visibility
    //     useEffect(() => {
    // console.log("hii")
    //     }, [])
    const navigate = useNavigate();

    const toggleOverlay = () => setShowOverlay(!showOverlay);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('New password and confirm password do not match.');
            return;
        }

        try {
            const response = await axios.put(`${BASE_API_URL}employee/changepassword`, {
                employee_email,
                currentPassword,
                newPassword,
                confirmPassword,
            });
            setMessage(response.data.msg);
        } catch (error) {
            setMessage(error.response.data.msg || 'An error occurred.');
        }
    };
    const handleClose = () => {
        setShowOverlay(false);
        // Optionally, you can reset form fields and messages here
        setEmail('');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setMessage('');
        navigate('/admin')
    };
    return (
<>

        <div>
            <Nav />
            {/* {showOverlay && (
                <div className="overlay"> */}
            <div style={{ backgroundColor: '#28769a' }}>
                <h1 className='headerUser'>ChangePassword</h1>
            </div>
            <div >
                <div class="row">
                    <div class="col-md-6 offset-md-3">
                        <div class="signup-form">
                        <form onSubmit={handleSubmit}>
                                    <div>
                                        <button onClick={handleClose} className="closeButton1">x</button>

                                        <b><label>Email:</label></b>
                                        <input
                                            type="email"
                                            value={employee_email}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <b>  <label>Current Password*</label></b>
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <b> <label>New Password*</label></b>
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <b> <label>Confirm New Password*</label></b>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit">Change Password</button>
                                    <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                                </form>
                        </div></div></div>
            </div>
            {/* </div>
            )} */}
        </div>
        <Footer />
        </>
    );
}

export default ChangePassword;