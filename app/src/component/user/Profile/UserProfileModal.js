
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditUserProfilesModal.js';
import Nav from '../../navComponent/Nav.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
let downloadCount = 0;
const ProfileModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedProfileId, setSelectedProfileId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [query, setQuery] = useState('');
    const [ids, setIds] = useState([]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    const currentItems = tableData.slice(offset, offset + itemsPerPage);
    const openModal = (profileId) => {
        console.log('profileId', profileId)
        setModalIsOpen(true);
        setSelectedProfileId(profileId);
    };
    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const handleSort = async (column) => {
        console.log("checking sorting", sortColumn, column)
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            try {
                const response = await axios.get(`${BASE_API_URL}profiles/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);

            }
            console.log("direction", sortDirection)
        } else {
            // If a new column is clicked, set it as the sorting column and reset the direction
            setSortColumn(column);
            setSortDirection('asc');
        }
    };
    const [formData, setFormData] = useState({});
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}profiles/list`);
            console.log(response.data.data); // Handle the response as needed
            settableData(response.data.data)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [togle]);


    const openPopup = () => {
        setMessage('');
        setFormData('');
        let formDataNew = {
            profile: '',
            profile_id: '',

        }
        setFormData(formDataNew);
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
    const [errors, setErrors] = useState({
        profile: "",
    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.profile.trim()) {
            newErrors.profile = "profile is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}profiles/create`, formData);
                settogle(!togle);
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg);
                if (response.data.success) {
                    closePopup();
                }
                setTimeout(() => setMessage(''), 3000);
                        } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const DeleteData = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        // Check if the user confirmed
        if (isConfirmed) {
            try {
                console.log('id', id)
                const response = await axios.delete(`${BASE_API_URL}profiles/delete?id=${id}`)

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
            const response = await axios.delete(`${BASE_API_URL}profiles/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}profiles/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}profiles/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    // code of export the data
    const convertToCSV = (data) => {
        if (data.length === 0) {
            return '';
        }

        // Get headers
        const header = Object.keys(data[0]).join(',');

        // Convert rows
        const rows = data.map(row => {
            return Object.values(row).map(value => {
                if (Array.isArray(value)) {
                    return `"${value.join(', ')}"`; // Join array elements into a single string with commas
                }
                return value;
            }).join(',');
        }).join('\n');

        return `${header}\n${rows}`;
    };

    const downloadCSV = (csv, filename) => {
        fetch(`${BASE_API_URL}profiles/export-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ csvData: csv, filename: filename }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.path) {
                    // Construct the full URL for the download
                    if (window.confirm('Data exported successfully. Do you want to download the file now?')) {
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url); // Clean up the URL.createObjectURL resource
                        alert('Data exported successfully');
                    }
                } else {
                    console.error('Failed to download CSV');
                }
            })
            .catch(error => console.error('Error:', error));
    };

    const openView = () => {
        const csv = convertToCSV(tableData);
        downloadCount += 1; // Increment the download count
        const filename = `exp_data${downloadCount}.csv`; // Dynamic filename
        downloadCSV(csv, filename);
    };
    // Import the data
    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post(`${BASE_API_URL}profiles/import-data`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Data imported successfully', response.data);
            if (window.confirm('Data imported successfully. Do you want to fetch the data now?')) {
                // Call function to fetch data here
                fetchData();
            }
        } catch (error) {
            console.error('Error importing data:', error);
        }
    };


    return (
        <>
            <div>
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerUser'>WELCOME TO CANDIDATE PAGE</h1>
                </div>
                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">

                                <div className='icon_manage'>
                                    <button onClick={openView} title="View Data" className='button_design_view'>
                                        Export&nbsp; <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button className="button_design" onClick={openPopup}>
                                        Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                    </button>
                                    <span> <button className="button_design" onClick={() => { Deletemulti() }}    >
                                        MultiDel&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                                    </button></span></div>

                                {isOpen && (
                                    <div>
                                        <div>
                                            <div>
                                                <div class="row">
                                                    <div class="col-md-6 offset-md-3 ">
                                                        <div class="signup-form ">
                                                            <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                <div style={{ textAlign: 'center' }}>
                                                                    <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Create Your Account</h4>
                                                                    <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                </div>
                                                                <div class="row">

                                                                    <div class="mb-3 col-md-6" style={{ marginLeft: "30%" }}>
                                                                        <label><b>Profile*</b></label>
                                                                        <input type="text" name="profile" value={formData.profile} onChange={handleInputChange} class="form-control" placeholder="profile" />
                                                                        {errors.profile && <span className="error" style={{ color: 'red' }}>{errors.profile}</span>}
                                                                    </div>




                                                                </div>
                                                                <div class="col-md-6" style={{ marginLeft: "30%" }}>
                                                                    <button type="submit">Add Profile</button>
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
                                />&nbsp;
                                <input
                                    type="file"
                                    accept=".csv"
                                    onChange={handleFileUpload}
                                />
                            </div>
                            <div className="table-responsive">

                                <table className="table">
                                    <thead className="thead-light">
                                        <tr>
                                            <th></th>
                                            <th scope="col" onClick={() => handleSort('profile_id')}><b>Profile ID</b>{sortColumn === 'profile_id' && (
                                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                            )}</th>
                                            <th scope="col" onClick={() => handleSort('profile')}><b>Profile</b>{sortColumn === 'profile' && (
                                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                            )}</th>
                                           
                                          
                                            <th scope="col" ><b>Actions</b></th>

                                        </tr>
                                    </thead>
                                    <tbody className="customtable">
                                        {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                            <tr key={index}>
                                                <td></td>
                                                <td>{data.profile_id}</td>
                                                <td>{data.profile}</td>
                                               
                                                <td> <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                    <button className="editButton" onClick={() => openModal(data._id)} >
                                                        <FontAwesomeIcon icon={faEdit} />
                                                    </button>  </td>
                                                <td>
                                                    <label className="customcheckbox">
                                                        <input
                                                            type="checkbox"
                                                            className="listCheckbox"
                                                            checked={ids.includes(data._id)}
                                                            onChange={(e) => handleCheckboxChange(e, data._id)}
                                                        />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td>
                                                <ModalBox isOpen={modalIsOpen} profileId={selectedProfileId} onRequestClose={closeModal}>
                                                    <h2>Modal Title</h2>
                                                    <p>Modal Content</p>
                                                </ModalBox>

                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
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
                    </div></div>
            </div>
            <Footer />
        </>
    );
};

export default ProfileModal;


