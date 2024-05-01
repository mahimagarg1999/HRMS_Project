import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from 'react-router-dom';
import { BASE_API_URL } from '../../lib/constants.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';


const LoginForm = () => {
    // const [errors, setmsg] = useState('');

    const [form, setForm] = useState({
        email: "",
        password: "",
        role: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [msg, setmsg] = useState('');
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false); // State to manage password visibility



    const onUpdateField = e => {
        const { name, value } = e.target;
        setForm({
            ...form,
            [name]: value,
        });
        // Clear validation error when user starts typing
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
            isValid = false;
        }

        if (!form.password.trim()) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    // const onSubmitForm = async e => {
    //     e.preventDefault();
    //     if (validateForm()) {
    //         try {
    //             const response = await fetch(`${BASE_API_URL}user/login`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(form),
    //             });
    //             const data = await response.json();
    //             setmsg(data.msg)
    //             if (response.ok) {
    //                 // Handle successful login
    //                 console.log(data.user._id);
    //                 try {
    //                     const response = await fetch(`${BASE_API_URL}user/get?userid=${data.user._id}`, {
    //                         method: 'GET',
    //                     });

    //                     // Check if the response is successful (status code 200)
    //                     if (!response.ok) {
    //                         throw new Error('Failed to fetch user data');
    //                     }

    //                     // Parse the JSON response
    //                     const userData = await response.json();
    //                     console.log("User data:", userData);
    //                     const name = userData.data.fname + " " + userData.data.lname
    //                     localStorage.setItem("_id", userData.data._id)
    //                     localStorage.setItem("name", name)
    //                     localStorage.setItem("email", userData.data.email)
    //                     localStorage.setItem("password", userData.data.password)
    //                     localStorage.setItem("role", userData.data.role)
    //                     if (userData.data.role == "admin") {
    //                         navigate('/admin');
    //                     }

    //                     else {
    //                         navigate('/user');
    //                     }

    //                 } catch (err) {
    //                     // Handle errors
    //                     console.error("Error fetching user data:", err);
    //                 }

    //             } else {
    //                 // Handle unsuccessful login
    //                 console.error('Login failed');
    //             }
    //         } catch (error) {
    //             console.error('Error occurred:', error);
    //         }
    //     }
    // };
    const onSubmitForm = async e => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch(`${BASE_API_URL}user/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                });
                const data = await response.json();
                console.log("main data", data)
                setmsg(data.msg)
                if (response.ok) {
                    if (data.user.role === 'user') {
                        const name = data.user.fname + "" + data.user.lname
                        localStorage.setItem("_id", data.user._id)
                        localStorage.setItem("employee_code", data.user.employee_code)
                        localStorage.setItem("name", name)
                        localStorage.setItem("email", data.user.email)
                        localStorage.setItem("password", data.user.password)
                        localStorage.setItem("role", data.user.role)
                        navigate('/user');
                    }
                    else {
                        const name = data.user.employee_first_name + "" + data.user.employee_last_name
                        localStorage.setItem("_id", data.user._id)
                        localStorage.setItem("employee_code", data.user.employee_code)

                        localStorage.setItem("name", name)
                        localStorage.setItem("email", data.user.employee_email)
                        localStorage.setItem("password", data.user.employee_password)
                        localStorage.setItem("role", "employee")
                        navigate('/admin');
                    }
                }
                else {

                }
            } catch (error) {
                console.error('Error occurred:', error);
            }
        }
    };
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };


    return (
        <>
            <div className="loginContainer">
                <form className="form" onSubmit={onSubmitForm}>
                    <div className="formGroup">
                        <label className="formLabel">Login</label>
                        <input
                            className="formField"
                            type="text"
                            aria-label="Email field"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={onUpdateField}
                        />
                        {errors.email && <span className="error" style={{ color: 'red', fontSize: "13px" }}>{errors.email}</span>}

                    </div>
                    {/* <div className="formGroup">
                        <input
                            className="formField"
                            type="password"
                            aria-label="Password field"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={onUpdateField}
                        />
                        {errors.password && <span className="error" style={{ color: 'red' }}>{errors.password}</span>}

                    </div> */}
                    <div className="formGroup password-input-container">
                        <input
                            className="formField"
                            type={showPassword ? "text" : "password"} // Toggle between "text" and "password" based on showPassword state
                            aria-label="Password field"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={onUpdateField}
                        />
                        <FontAwesomeIcon
                            icon={showPassword ? faEyeSlash : faEye}
                            className="password-toggle-icon"
                            onClick={togglePasswordVisibility}
                            style={{ height: "18px" }}
                        />
                        {errors.password && <span className="error" style={{ color: 'red', fontSize: "13px" }}>{errors.password}</span>}
                    </div>
                    <div class="formGroup ">
                        <select
                            class="formField"
                            name="role"
                            value={form.role.value}
                            onChange={onUpdateField}
                        >
                            <option value=''>Select role</option>

                            <option value="Employee">Employee</option>
                            <option value="HR">HR</option>
                        </select>
                    </div>
                    <div className="formActions">
                        <button className="formSubmitBtn" type="submit">
                            {/* <Link to="/login" style={{ color: 'black' }}>Login</Link> */}
                            Login

                        </button>

                    </div>
                    <h6 style={{ color: 'green' }}>{msg}</h6>

                    {/* <label className="formLabelAgain">Need an account? Signup</label> */}
                </form>
                <div className="formGroup">
                    <label className="formLabelAgain">Need an account? <u><Link to="/signup" style={{ color: 'black' }}>Signup</Link></u>,
                    </label>
                </div>
            </div>
        </>
    );
};
export default LoginForm;



