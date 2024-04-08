// import { useState } from "react";
// import "./login.css";
// import { Link, useNavigate } from 'react-router-dom';
// import Footer from "../FooterModule/Footer";
// const LoginForm = () => {
//     const [form, setForm] = useState({
//         email: "",
//         password: "",
//     });
//     const navigate = useNavigate();

//     const onUpdateField = e => {
//         const nextFormState = {
//             ...form,
//             [e.target.name]: e.target.value,
//         };
//         setForm(nextFormState);
//     };

//     const onSubmitForm = async e => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:5000/api/user/login', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(form),
//             });
//             if (response.ok) {

//                 const data = await response.json();
//                 // Handle successful login
//                 console.log(data.user._id);
//                 try {
//                     const response = await fetch(`http://localhost:5000/api/user/get?userid=${data.user._id}`, {
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
//     };

//     return (
//         <>
//         <div className="loginContainer">
//             <form className="form" onSubmit={onSubmitForm}>
//                 <div className="formGroup">
//                     <label className="formLabel">Login</label>
//                     <input
//                         className="formField"
//                         type="text"
//                         aria-label="Email field"
//                         name="email"
//                         placeholder="Enter your email"
//                         value={form.email}
//                         onChange={onUpdateField}
//                     />
//                 </div>
//                 <div className="formGroup">
//                     <input
//                         className="formField"
//                         type="password"
//                         aria-label="Password field"
//                         name="password"
//                         placeholder="Enter your password"
//                         value={form.password}
//                         onChange={onUpdateField}
//                     />
//                 </div>
//                 <div className="formActions">
//                     <button className="formSubmitBtn" type="submit">
//                         {/* <Link to="/login" style={{ color: 'black' }}>Login</Link> */}
//                         Login

//                     </button>
//                 </div>

//                 {/* <label className="formLabelAgain">Need an account? Signup</label> */}
//             </form>
//             <div className="formGroup">
//                 <label className="formLabelAgain">Need an account? <u><Link to="/signup" style={{ color: 'black' }}>Signup</Link></u>,
//                     <u><Link to="/" style={{ color: 'black' }}>Home</Link></u></label>
//             </div>
//         </div>
//         <Footer/>
//         </>
//     );
// };
// export default LoginForm;





import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from 'react-router-dom';
import Footer from "../FooterModule/Footer";
import Base_API_url from "../../lib/contax.js";
const LoginForm = () => {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState({
        email: "",
        password: "",
    });
    const [msg , setmsg]=useState('')
    const navigate = useNavigate();

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

    const onSubmitForm = async e => {
        e.preventDefault();
        if (validateForm()) {
            try {
                const response = await fetch(`${Base_API_url}user/login`, {
                    method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(form),
                            });
                            const data = await response.json();
                            setmsg(data.msg) 
                            console.log(data.msg)
                           if (response.ok) {

                                // const data = await response.json();
                                // console.log(data)
                                // Handle successful login
                                console.log(data.user._id);
                                try {
                                    const response = await fetch(`http://localhost:5000/api/user/get?userid=${data.user._id}`, {
                                        method: 'GET',
                                    });
                
                                    // Check if the response is successful (status code 200)
                                    if (!response.ok) {
                                        throw new Error('Failed to fetch user data');
                                    }
                
                                    // Parse the JSON response
                                    const userData = await response.json();
                                    console.log("User data:", userData);
                                    const name = userData.data.fname + " " + userData.data.lname
                                    localStorage.setItem("_id", userData.data._id)
                                    localStorage.setItem("name", name)
                                    localStorage.setItem("email", userData.data.email)
                                    localStorage.setItem("password", userData.data.password)
                                    localStorage.setItem("role", userData.data.role)
                                    if (userData.data.role == "admin") {
                                        navigate('/admin');
                                    }
                                    else {
                                        navigate('/user');
                                    }
                
                                } catch (err) {
                                    // Handle errors
                                    console.error("Error fetching user data:", err);
                                }
                
                            } else {
                                // Handle unsuccessful login
                                console.error('Login failed');
                            }
                   }  catch (error) {

                console.error('Error occurred:', error);
            }
        }
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
                        {errors.email && <span className="error" style={{color:'red'}}>{errors.email}</span>}

                    </div>
                    <div className="formGroup">
                        <input
                            className="formField"
                            type="password"
                            aria-label="Password field"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={onUpdateField}
                        />
                        {errors.password && <span className="error" style={{color:'red'}}>{errors.password}</span>}
                    </div>
                    <span style={{color:'red'}}>{msg}</span>

                    <div className="formActions">
                        <button className="formSubmitBtn" type="submit">
                            Login
                        </button>
                    </div>
                </form>
                <div className="formGroup">
                    <label className="formLabelAgain">Need an account? <u><Link to="/signup" style={{ color: 'black' }}>Signup</Link></u>,
                        <u><Link to="/" style={{ color: 'black' }}>Home</Link></u></label>

                </div>

            </div>
<Footer/>        </>

    );
};

export default LoginForm;
