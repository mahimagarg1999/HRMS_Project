import React, { useEffect, useState } from 'react';
import Nav from '../../navComponent/Nav';
import axios from 'axios'; // Make sure to install axios with npm or yarn
import './ChangePassword.css'
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
    const [email, setEmail] = useState(localStorage.getItem("email"));
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
            const response = await axios.put('http://localhost:5000/api/user/changepassword', {
                email,
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

        <div>

            <Nav onToggleOverlay={toggleOverlay} />
            <h1>mahima</h1>
            {showOverlay && (
                <div className="overlay">
                    <div className="changePasswordContainer">

                        <form onSubmit={handleSubmit}>
                            <button onClick={handleClose} className="closeButton">x</button>
                            <div>
                                <label>Email:</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Current Password:</label>
                                <input
                                    type="password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>New Password:</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label>Confirm New Password:</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <button type="submit">Change Password</button>
                        </form>
                        <span>{message && <p>{message}</p>}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ChangePassword;