import React, { useState, useEffect } from 'react';
import './Consultancy.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditConsultancyModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown, faEnvelope,faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import Footer from '../../FooterModule/Footer.js'
const ConsultancyModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedConsultancyId, setSelectedConsultancyId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [ids, setIds] = useState([]);
    const [agreement, setAgreement] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [query, setQuery] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    // const currentItems = tableData.slice(offset, offset + itemsPerPage);

    // const [data, setData] = useState(formData);
    const openModal = (consultancyId) => {
        console.log('consultancyId', consultancyId)
        setModalIsOpen(true);
        setSelectedConsultancyId(consultancyId);

    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const handleSort = async (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            try {
                const response = await axios.get(`${BASE_API_URL}consultancy/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // If a new column is clicked, set it as the sorting column and reset the direction
            setSortColumn(column);
            setSortDirection('ascending');
        }
    };


    const [formData, setFormData] = useState({
        // consultancy_name: '',
        // consultancy_email: '',
        // consultancy_website_url: '',
        // consultancy_mobile: '',
        // consultancy_alternate_mobile: '',
        // consultancy_city: '',
        // consultancy_state: '',
        // consultancy_address: '',
        // contract_agreement: '',
        // agreementPdfName: "pdf",
        // contract_person_name: '',
        // contract_linkedIn_Profile: '',
    });
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file instanceof Blob) {
            const reader = new FileReader();
            console.log("e----->", e.target.name);
            reader.onloadend = () => {
                if (e.target && e.target.name === 'contract_agreement') {
                    console.log('hii')
                    setAgreement(reader.result);
                }

                console.log('idproof', agreement)
                console.log('selectedFile', selectedFile)

            };
            reader.readAsDataURL(file);
        } else {
            console.error("The selected file is not a Blob.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}consultancy/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    const openPopup = () => {
        setMessage('')
        setFormData('')
        let formDataNew = {
            consultancy_name: '',
            consultancy_email: '',
            consultancy_website_url: '',
            consultancy_mobile: '',
            consultancy_alternate_mobile: '',
            consultancy_city: '',
            consultancy_state: '',
            consultancy_address: '',
            contract_agreement: '',
            agreementPdfName: "pdf",
            contract_person_name: '',
            contract_linkedIn_Profile: '',
        }
        setFormData(formDataNew)
        setIsOpen(true);
    };

    const closePopup = () => {

        setIsOpen(false);
    };
    // const validateForm = () => {
    //     let isValid = true;
    //     const newErrors = {};

    //     if (!formData.consultancy_name.trim()) {
    //         newErrors.consultancy_name = "Consultancy   Name is required";
    //         isValid = false;
    //     }

    //     if (!formData.consultancy_email.trim()) {
    //         newErrors.consultancy_email = "Consultancy Email is required";
    //         isValid = false;
    //     }

    //     if (!formData.consultancy_address.trim()) {
    //         newErrors.consultancy_address = "Consultancy Address is required";
    //         isValid = false;
    //     }



    //     setErrors(newErrors);
    //     return isValid;
    // };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        })
        );
        setErrors({
            ...errors,
            [name]: "",
        });
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.contract_agreement = agreement

        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}consultancy/create`, formData);
                settogle(!togle)
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg);

            } catch (error) {
                console.error('Error:', error);
                // setMessage("Add consultancy failed");

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
                const response = axios.delete(`${BASE_API_URL}consultancy/delete?id=${id}`)

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
    // multidelete
    const handleCheckboxChange = (e, id) => {
        if (e.target.checked) {
            setIds(prevIds => [...prevIds, id]);
        } else {
            setIds(prevIds => prevIds.filter(prevId => prevId !== id));
        }
    };
    const Deletemulti = async () => {
        const data = {
            "ids": ids
        };
        console.log('ids', data);

        try {
            const response = await axios.delete(`${BASE_API_URL}consultancy/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    // =====
    const [errors, setErrors] = useState({
        consultancy_name: "",
        consultancy_email: "",
        consultancy_address: "",

    });
    const validateForm = () => {

        let isValid = true;
        const newErrors = {};

        if (!formData.consultancy_name.trim()) {
            newErrors.consultancy_name = "consultancy_name is required";
            isValid = false;
        }

        if (!formData.consultancy_email.trim()) {
            newErrors.consultancy_email = "consultancy_email is required";
            isValid = false;
        }

        if (!formData.consultancy_address.trim()) {
            newErrors.consultancy_address = "consultancy_address is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // const handleChange = async (event) => {
    //     setQuery(event.target.value);
    //     console.log(query)

    //     try {
    //         const response = await axios.get(`${BASE_API_URL}consultancy/search?search=${event.target.value}`, {

    //         });
    //         console.log(query)

    //         settableData(response.data)

    //     } catch (error) {
    //         console.error('Error:', error);
    //     }

    // };
    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}consultancy/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}consultancy/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const handleCheckboxChangeEmail = (email) => {
        setSelectedEmails(prevSelectedEmails =>
            prevSelectedEmails.includes(email)
                ? prevSelectedEmails.filter(e => e !== email)
                : [...prevSelectedEmails, email]
        );
    };
 

    const sendEmails = async () => {
        if (selectedEmails.length === 0) {
            setMessage('Please select at least one email to send.');
            return;
        }
        setMessage('Sending emails...');
        try {
            const response = await axios.post(`${BASE_API_URL}consultancy/send-mail`, { emails: selectedEmails });
            console.log('Response:', response.data);
            setMessage(response.data.msg);
            setTimeout(() => setMessage(''), 2000);
            // Reset selected emails and checkboxes after sending emails
            setSelectedEmails([]);
            setSelectAll(false);
        } catch (error) {
            console.error('Error sending emails:', error);
            setMessage('Error sending emails.');
        }
    };
    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO CONSULTANCY PAGE</h1>
                </div>
                <div >
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body text-center">
                                    {/* <h5 className="card-title m-b-0 nav-item backButton">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add Consultancy +
                                    </button>
                                </h5> */}
                                    <div className='icon_manage'>
                                        <button className="button_design" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>

                                        <span> <button onClick={() => { Deletemulti() }} className='button_design'  >
                                            MultiDel&nbsp;  <FontAwesomeIcon icon={faTrashAlt} />
                                        </button></span>
                                        <span>   <button onClick={sendEmails} className='button_design'>Send Emails &nbsp; <FontAwesomeIcon icon={faEnvelope} /></button>
                                        </span>
                                        </div>
                                        {message && <div className="mt-3 alert alert-success">{message}</div>}

                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div class="row">
                                                        <div class="col-md-6 offset-md-3">
                                                            <div class="signup-form">
                                                                <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Consultancy</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Name*</b></label>
                                                                            <input type="text" name="consultancy_name" value={formData.consultancy_name} onChange={handleInputChange} class="form-control" placeholder="Consultancy Name" />
                                                                            {errors.consultancy_name && <span className="error" style={{ color: 'red' }}>{errors.consultancy_name}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Email*</b></label>
                                                                            <input type="email" name="consultancy_email" value={formData.consultancy_email} onChange={handleInputChange} class="form-control" placeholder="Consultancy Email" />
                                                                            {errors.consultancy_email && <span className="error" style={{ color: 'red' }}>{errors.consultancy_email}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Website</b></label>
                                                                            <input type="text" name="consultancy_website_url" value={formData.consultancy_website_url} onChange={handleInputChange} class="form-control" placeholder="Consultancy Website" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Mobile</b></label>
                                                                            <input type="text" name="consultancy_mobile" value={formData.consultancy_mobile} onChange={handleInputChange} class="form-control" placeholder="Consultancy Mobile" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Alternate Mobile</b></label>
                                                                            <input type="test" name="consultancy_alternate_mobile" value={formData.consultancy_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Consultancy Alternate Mobile" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  City</b></label>
                                                                            <input type="text" name="consultancy_city" value={formData.consultancy_city} onChange={handleInputChange} class="form-control" placeholder="Consultancy City" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  State</b></label>
                                                                            <input type="text" name="consultancy_state" value={formData.consultancy_state} onChange={handleInputChange} class="form-control" placeholder="Consultancy State" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>  Address*</b></label>
                                                                            <input type="text" name="consultancy_address" value={formData.consultancy_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                                                            {errors.consultancy_address && <span className="error" style={{ color: 'red' }}>{errors.consultancy_address}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Contract Agreement</b></label>
                                                                            <input type="file" onChange={handleFileChange} class="form-control" placeholder='contract agreement' name="contract_agreement" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Contract Person Name</b></label>
                                                                            <input type="text" name="contract_person_name" value={formData.contract_person_name} onChange={handleInputChange} class="form-control" placeholder="contract_person_name" />

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Contract LinkedIn Profile</b></label>
                                                                            <input type="text" name="contract_linkedIn_Profile" value={formData.contract_linkedIn_Profile} onChange={handleInputChange} class="form-control" placeholder="contract_linkedIn_Profile" />

                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Consultancy</button>
                                                                    </div>
                                                                    <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                                                                </form>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>       </div>
                                        </div>
                                    )}
                                </div>
                                <div class="containerOnce">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={handleChange}
                                        placeholder="Search "
                                    />
                                </div>
                                <div className="table-responsive">

                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>

                                                {/* <th scope="col" >ID    </th> */}
                                                <th scope="col" onClick={() => handleSort('consultancy_name')}> <b>Name  </b>{sortColumn === 'consultancy_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('consultancy_email')}><b>Email </b>{sortColumn === 'consultancy_email' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('consultancy_mobile')}><b> mobile</b>
                                                    {sortColumn === 'consultancy_mobile' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}</th>
                                                <th scope="col" onClick={() => handleSort('contract_agreement')}><b>Agreement</b> {sortColumn === 'contract_agreement' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>

                                                <th scope="col" onClick={() => handleSort('consultancy_website_url')}><b> Website URL</b>
                                                    {sortColumn === 'consultancy_website_url' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}</th>
                                                <th scope="col" ><b>ACTIONS </b></th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                        {/* <span className="checkmark"></span> */}
                                                    </label>
                                                </th>
                                                <th>
                                                    <button style={{
                                                        border: 'none',
                                                        backgroundColor: 'white'
                                                    }} title="Send Mail"><FontAwesomeIcon icon={faEnvelope} /></button>
                                                </th>

                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>

                                                    {/* <td>{data._id}</td> */}
                                                    <td>{data.consultancy_name} </td>
                                                    <td>{data.consultancy_email}</td>
                                                    <td>{data.consultancy_mobile}</td>

                                                    <td>
                                                        {/* <a style={{ color: 'rgb(40, 118, 154)' }} href={`http://localhost:5000/${data.contract_agreement}`} target="_blank">{data.contract_agreement}</a> */}
                                                        <button
                                                            className="editButton"
                                                            onClick={() => window.open(`http://localhost:5000/${data.contract_agreement}`, '_blank')}
                                                            style={{ color: 'rgb(40, 118, 154)', background: 'none', border: 'none', cursor: 'pointer' }} title="Show Pdf"
                                                        >
                                                            <FontAwesomeIcon icon={faFilePdf} />

                                                        </button>
                                                    </td>

                                                    <td>
                                                        <a style={{ color: 'rgb(40, 118, 154)' }} href={`${data.consultancy_website_url}`} target="_blank">{data.consultancy_website_url}</a>

                                                    </td>

                                                    <td>
                                                        <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <label className="customcheckbox">
                                                            {/* <input type="checkbox" className="listCheckbox" onChange={(e) => handleCheckboxChange(e, data._id)} /> */}
                                                            <input
                                                                type="checkbox"
                                                                className="listCheckbox"
                                                                checked={ids.includes(data._id)}
                                                                onChange={(e) => handleCheckboxChange(e, data._id)}
                                                            />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input style={{ marginLeft: "18px" }}
                                                            type="checkbox"
                                                            checked={selectedEmails.includes(data.consultancy_email)}
                                                            onChange={() => handleCheckboxChangeEmail(data.consultancy_email)}
                                                        />
                                                    </td>

                                                    <ModalBox isOpen={modalIsOpen} consultancyId={selectedConsultancyId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                    {/* priyanshi */}
                                                    {/* <td>
                                                    <label className="customcheckbox">
                                                        <input type="checkbox" className="listCheckbox" onChange={(e) => handleCheckboxChange(e, data._id)} />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td> */}
                                                    {/* ====== */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {/* Pagination component */}
                                {/* <ReactPaginate
                                    previousLabel={'Previous'}
                                    nextLabel={'Next'}
                                    breakLabel={'...'}
                                    pageCount={pageCount}
                                    marginPagesDisplayed={2}
                                    pageRangeDisplayed={5}
                                    onPageChange={handlePageChange}
                                    containerClassName={'pagination'}
                                    activeClassName={'active'}
                                /> */}
                                {tableData.length > itemsPerPage && (
                                    <div className="pagination-container">
                                        <ReactPaginate
                                            pageCount={pageCount}
                                            onPageChange={handlePageChange}
                                            containerClassName={'pagination'}
                                            activeClassName={'active'}
                                        />
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                </div>

                <div>

                </div>

            </div >
            <Footer />
        </>

    );
}

export default ConsultancyModule;
