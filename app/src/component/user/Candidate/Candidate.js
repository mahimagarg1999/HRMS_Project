import React, { useState, useEffect } from 'react';
import './Candidate.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from '../../user/Candidate/EditModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const CandidateModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
const [msg ,setmsg]=useState('');
    // const [data, setData] = useState(formData);
    const openModal = (candidateId) => {
        console.log('candidateId', candidateId)
        setModalIsOpen(true);
      setSelectedCandidateId(candidateId);
    };
    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };

    const [formData, setFormData] = useState({
        candidate_id: '',
        candidate_first_name: '',
        candidate_last_name: '',
        candidate_mobile: '',
        candidate_alternate_mobile: '',
        candidate_email: '',
        candidate_skype: '',
        candidate_profile: '',
        candidate_skills: '',
        candidate_experience: '',
        candidate_expected_salary: '',
        candidate_expected_joining_date: '',
        candidate_joining_immediate: '',
        candidate_marrital_status: '',
        candidate_written_round: '',
        candidate_machine_round: '',
        candidate_technical_interview_round: '',
        candidate_hr_interview_round: '',
        candidate_selection_status: '',
        candidate_feedback: '',
        candidate_from_consultancy: '',
        candidate_info1: '',
        candidate_info2: '',
        candidate_info3: '',
        candidate_info4: '',
        candidate_info5: '',
        candidate_info6: '',
        candidate_info7: '',
        candidate_info8: '',
        candidate_info9: '',
        candidate_info10: ''
    });

    const [errors, setErrors] = useState({
        candidate_first_name: "",
        candidate_last_name: "",
        candidate_mobile:'',
        candidate_email:'',
        candidate_skills:'',
        candidate_experience:'',
        candidate_experience:'',
        candidate_expected_salary:''
    
    });
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.candidate_first_name.trim()) {
            newErrors.candidate_first_name = "candidate_last_name is required";
            isValid = false;
        }
        
        if (!formData.candidate_last_name.trim()) {
            newErrors.candidate_last_name = "candidate_last_name is required";
            isValid = false;
        }
        
        if (!formData.candidate_mobile.trim()) {
            newErrors.candidate_mobile = "candidate_mobile is required";
            isValid = false;
        }
        if (!formData.candidate_email.trim()) {
            newErrors.candidate_email = "candidate_email is required";
            isValid = false;
        }
        if (!formData.candidate_skills.trim()) {
            newErrors.candidate_skills = "candidate_skills is required";
            isValid = false;
        }
        if (!formData.candidate_experience.trim()) {
            newErrors.candidate_experience = "candidate_experience is required";
            isValid = false;
        }
        if (!formData.candidate_expected_salary.trim()) {
            newErrors.candidate_expected_salary = "candidate_expected_salary is required";
            isValid = false;
        }
       


        setErrors(newErrors);
        return isValid;
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/candidate/list');
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    const openPopup = () => {
        setIsOpen(true);
    };

    const closePopup = () => {
        setIsOpen(false);
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    // Function to handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
        try {
            const response = axios.post('http://localhost:5000/api/candidate/create', formData);
            setmsg(response.data.msg)
            settogle(!togle)
            console.log(response.data); // Handle the response as needed
        } catch (error) {
            console.error('Error:', error);
        }
    }
    };
    const DeleteData = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = axios.delete(`http://localhost:5000/api/candidate/delete?id=${id}`)

                console.log(response.data); // Handle the response as needed
                settogle(!togle)

            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // User canceled the action
            console.log('Deletion canceled');
        } console.log('', id)




    }



    return (
        <div >
            <Nav />
            <div style={{ backgroundColor: '#28769a' }}>
                <h1 className='headerUser'>Welcome TO CANDIDATE PAGE</h1>
            </div>
            <div >


                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5 className="card-title m-b-0">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add Candidate +
                                    </button>
                                </h5>
                                {isOpen && (
                                    <div>
                                        <div>
                                            <div>
                                                <div class="row">
                                                    <div class="col-md-6 offset-md-3">
                                                        <div class="signup-form">
                                                            <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Create Your Account</h4>
                                                                    <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                </div>
                                                                <div class="row">
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_first_name" value={formData.candidate_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name" />
                                                                        {errors.candidate_first_name && <span className="error" style={{color:'red'}}>{errors.candidate_first_name}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_last_name" value={formData.candidate_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
                                                                        {errors.candidate_last_name && <span className="error" style={{color:'red'}}>{errors.candidate_last_name}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_mobile" value={formData.candidate_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
                                                                        {errors.candidate_mobile && <span className="error" style={{color:'red'}}>{errors.candidate_mobile}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_alternate_mobile" value={formData.candidate_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="email" name="candidate_email" value={formData.candidate_email} onChange={handleInputChange} class="form-control" placeholder="Email" />
                                                                        {errors.candidate_email && <span className="error" style={{color:'red'}}>{errors.candidate_email}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_skype" value={formData.candidate_skype} onChange={handleInputChange} class="form-control" placeholder="Skype ID" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_profile" value={formData.candidate_profile} onChange={handleInputChange} class="form-control" placeholder="Profile" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_skills" value={formData.candidate_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
                                                                        {errors.candidate_skills && <span className="error" style={{color:'red'}}>{errors.candidate_skills}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        
                                                                    <input type="text" name="candidate_experience" value={formData.candidate_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
                                                                    {errors.candidate_experience && <span className="error" style={{color:'red'}}>{errors.candidate_experience}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_expected_salary" value={formData.candidate_expected_salary} onChange={handleInputChange} class="form-control" placeholder="Expected Salary" />
                                                                        {errors.candidate_expected_salary && <span className="error" style={{color:'red'}}>{errors.candidate_expected_salary}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="date" name="candidate_expected_joining_date" value={formData.candidate_expected_joining_date} onChange={handleInputChange} class="form-control" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_joining_immediate" value={formData.candidate_joining_immediate} onChange={handleInputChange} class="form-control" placeholder="Joining Immediate" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_marrital_status" value={formData.candidate_marrital_status} onChange={handleInputChange} class="form-control" placeholder="Marrital Status" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_written_round" value={formData.candidate_written_round} onChange={handleInputChange} class="form-control" placeholder="Written Round" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_machine_round" value={formData.candidate_machine_round} onChange={handleInputChange} class="form-control" placeholder="Machine Round" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_technical_interview_round" value={formData.candidate_technical_interview_round} onChange={handleInputChange} class="form-control" placeholder="Technical Interview Round" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_hr_interview_round" value={formData.candidate_hr_interview_round} onChange={handleInputChange} class="form-control" placeholder="HR Interview Round" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_selection_status" value={formData.candidate_selection_status} onChange={handleInputChange} class="form-control" placeholder="Selection Status" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_feedback" value={formData.candidate_feedback} onChange={handleInputChange} class="form-control" placeholder="Feedback" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_from_consultancy" value={formData.candidate_from_consultancy} onChange={handleInputChange} class="form-control" placeholder="From Consultancy" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info1" value={formData.candidate_info1} onChange={handleInputChange} class="form-control" placeholder="Additional Information 1" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info2" value={formData.candidate_info2} onChange={handleInputChange} class="form-control" placeholder="Additional Information 2" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info3" value={formData.candidate_info3} onChange={handleInputChange} class="form-control" placeholder="Additional Information 4" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info4" value={formData.candidate_info4} onChange={handleInputChange} class="form-control" placeholder="Additional Information 4" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info5" value={formData.candidate_info5} onChange={handleInputChange} class="form-control" placeholder="Additional Information 5" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info6" value={formData.candidate_info6} onChange={handleInputChange} class="form-control" placeholder="Additional Information 6" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info7" value={formData.candidate_info7} onChange={handleInputChange} class="form-control" placeholder="Additional Information 7" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info8" value={formData.candidate_info8} onChange={handleInputChange} class="form-control" placeholder="Additional Information 8" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info9" value={formData.candidate_info9} onChange={handleInputChange} class="form-control" placeholder="Additional Information 9" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="candidate_info10" value={formData.candidate_info10} onChange={handleInputChange} class="form-control" placeholder="Additional Information 10" />
                                                                    </div>
                                                                </div>
                                                                <div class="col-md-12">
                                                                    <button type="submit">Signup Now</button>
                                                                </div>
                                                            </form>
                                                            <span>{msg}</span>
                                                            <p class="text-center mt-3 text-secondary">If you have account, Please <a href="#">Login Now</a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>       </div>
                                    </div>
                                )}
                            </div>
                            <div className="table-responsive">
                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th>
                                                <label className="customcheckbox m-b-20">
                                                    <input type="checkbox" id="mainCheckbox" />
                                                    <span className="checkmark"></span>
                                                </label>
                                            </th>
                                            <th scope="col">id</th>
                                            <th scope="col">Name</th>
                                            <th scope="col">Email</th>
                                            <th scope="col"> moblil</th>
                                            <th scope="col" >#ACTIONS</th>

                                        </tr>
                                    </thead>
                                    <tbody className="customtable">
                                        {tableData.map((data, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <label className="customcheckbox">
                                                        <input type="checkbox" className="listCheckbox" />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td>
                                                <td>{data._id}</td>
                                                <td>{data.candidate_first_name}&nbsp;{data.candidate_last_name}</td>
                                                <td>{data.candidate_email}</td>
                                                <td>{data.candidate_mobile}</td>
                                                {/* <button onClick={() => DeleteData(data._id)} style={{ backgroundColor: 'red' }}>DELETE</button>
                                                <button onClick={() => { openModal(data._id) }} style={{ backgroundColor: 'green' }}> EDIT</button> */}
                                                 <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                <button className="editButton" onClick={() => openModal(data._id)} >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button> 
                                                <ModalBox isOpen={modalIsOpen} candidateId={selectedCandidateId} onRequestClose={closeModal}>
                                                    <h2>Modal Title</h2>
                                                    <p>Modal Content</p>
                                                </ModalBox>
                                            </tr>
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

export default CandidateModule;
