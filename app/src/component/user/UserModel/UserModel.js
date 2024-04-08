import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './UserModel.css';
import ModalBox from './EditUserModel.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Nav from '../../navComponent/Nav';

const UserModel = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [showOverlay, setShowOverlay] = useState(true);

    // const [data, setData] = useState(formData);
    const openModal = (userId) => {
        console.log('userId', userId)
        setModalIsOpen(true);
        setSelectedUserId(userId);

    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/user/list');
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);
    // const openPopup = () => {
    //     setIsOpen(true);
    // };

    // const closePopup = () => {
    //     setIsOpen(false);
    // };
    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
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
        // navigate('/admin')
    };

    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        email: '',
        password: '',
        dob: '',
        gender: '',
        standard: '',
        address: '',
        city: '',
        state: '',
        role: '',

    });
    // Function to handle form submission


    return (
        // <div style={{ backgroundColor: '#28769a' }}>
        <div style={{ backgroundColor: '#28769a' }}>

            <Nav />
            <h1 className='headerData' >USER DATA</h1>
            <div >

                <div class="row">
        
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">


                            </div>
                            <div className="table-responsive">
                            <Link to="/user" className="nav-item backButton">Back</Link>

                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            {/* <th>
                                                <label className="customcheckbox m-b-20">
                                                    <input type="checkbox" id="mainCheckbox" />
                                                    
                                                </label>
                                            </th> */}
                                            <th scope="col">id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col"> gender</th>
                                            <th scope="col"> Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="customtable">
                                        {tableData.map((data, index) => (
                                            data.role === 'user' ? (
                                                <tr key={index}>
                                                    {/* <td>
                                                        <label className="customcheckbox">
                                                            <input type="checkbox" className="listCheckbox" />
                                                            
                                                        </label>
                                                    </td> */}
                                                    <td>{data._id}</td>
                                                    <td>{data.fname}&nbsp;{data.lname}</td>
                                                    <td>{data.email}</td>
                                                    <td>{data.gender}</td>
                                                    {/* <button onClick={() => { openModal(data._id) }} style={{ backgroundColor: 'green' }}> EDIT</button> */}
                                                    <button className="editButton" onClick={() => openModal(data._id)} >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>
                                                    <ModalBox isOpen={modalIsOpen} userId={selectedUserId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                </tr>
                                            ) : (
                                                <tr key={index}>
                                                </tr>
                                            )
                                        ))}

                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>

            </div>

            <div>

            </div>


        </div>
    );

}

export default UserModel;
