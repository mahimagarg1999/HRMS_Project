import React, { useState, useEffect } from 'react';
import './Consultancy.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditConsultancyModel.js';
import Nav from '../../navComponent/Nav';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faTrash ,faSortUp, faSortDown} from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';


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

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 5; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    const currentItems = tableData.slice(offset, offset + itemsPerPage);

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
    const handleSort = (column) => {
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'ascending' ? 'descending' : 'ascending');
        } else {
            // If a new column is clicked, set it as the sorting column and reset the direction
            setSortColumn(column);
            setSortDirection('ascending');
        }
    };
    const sortedData = () => {
        if (sortColumn) {
            const sorted = [...tableData].sort((a, b) => {
                const valueA = a[sortColumn];
                const valueB = b[sortColumn];
                if (typeof valueA === 'string' && typeof valueB === 'string') {
                    // Case-insensitive string comparison
                    return sortDirection === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
                } else {
                    // Numerical or other comparison
                    return sortDirection === 'ascending' ? valueA - valueB : valueB - valueA;
                }
            });
            return sortDirection === 'ascending' ? sorted : sorted.reverse();
        }
        return tableData; // Return original data if no sorting column is selected
    };

    const [formData, setFormData] = useState({
        consultancy_name: '',
        consultancy_email: '',
        consultancy_website: '',
        consultancy_mobile: '',
        consultancy_alternate_mobile: '',
        consultancy_city: '',
        consultancy_state: '',
        consultancy_address: '',
        consultancy_details: '',
    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/consultancy/list');
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
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        try {
            const response = await axios.post('http://localhost:5000/api/consultancy/create', formData);
            settogle(!togle)
            console.log(response.data); // Handle the response as needed
            setMessage(response.data.msg);

        } catch (error) {
            console.error('Error:', error);
            // setMessage("Add consultancy failed");

        }
    };
    const DeleteData = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = axios.delete(`http://localhost:5000/api/consultancy/delete?id=${id}`)

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
                <h1 className='headerData'>Welcome To Consultancy Page</h1>
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
                                <div>
                                    <button className="backButton" onClick={openPopup}>
                                        Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                    </button>
                                </div>
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
                                                                        <input type="text" name="consultancy_name" value={formData.consultancy_name} onChange={handleInputChange} class="form-control" placeholder="Consultancy Name" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="email" name="consultancy_email" value={formData.consultancy_email} onChange={handleInputChange} class="form-control" placeholder="Consultancy Email" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="consultancy_website" value={formData.consultancy_website} onChange={handleInputChange} class="form-control" placeholder="Consultancy Website" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="consultancy_mobile" value={formData.consultancy_mobile} onChange={handleInputChange} class="form-control" placeholder="Consultancy Mobile" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="test" name="consultancy_alternate_mobile" value={formData.consultancy_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Consultancy Alternate Mobile" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="consultancy_city" value={formData.consultancy_city} onChange={handleInputChange} class="form-control" placeholder="Consultancy City" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="consultancy_state" value={formData.consultancy_state} onChange={handleInputChange} class="form-control" placeholder="Consultancy State" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="consultancy_address" value={formData.consultancy_address} onChange={handleInputChange} class="form-control" placeholder="Address" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="consultancy_details" value={formData.consultancy_details} onChange={handleInputChange} class="form-control" placeholder="Consultancy Details" />
                                                                    </div>
                                                                    <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>
                                                                </div>
                                                                <div class="col-md-12">
                                                                    <button type="submit">Signup Now</button>
                                                                </div>
                                                            </form>
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
                                            <th scope="col" onClick={() => handleSort('id')}>ID   {sortColumn === 'id' && (
                                                <FontAwesomeIcon icon={sortDirection === 'ascending' ? faSortUp : faSortDown} />
                                            )}</th>
                                            <th scope="col" onClick={() => handleSort('consultancy_name')}> Name  {sortColumn === 'consultancy_name' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'ascending' ? faSortUp : faSortDown} />
                                                )}</th>
                                            <th scope="col">Email</th>
                                            <th scope="col"> moblil</th>
                                            <th scope="col" >ACTIONS</th>

                                        </tr>
                                    </thead>
                                    <tbody className="customtable">
                                        {sortedData().slice(offset, offset + itemsPerPage).map((data, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <label className="customcheckbox">
                                                        <input type="checkbox" className="listCheckbox" />
                                                        <span className="checkmark"></span>
                                                    </label>
                                                </td>
                                                <td>{data._id}</td>
                                                <td>{data.consultancy_name} </td>
                                                <td>{data.consultancy_email}</td>
                                                <td>{data.consultancy_mobile}</td>
                                                <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                <button className="editButton" onClick={() => openModal(data._id)} >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>


                                                <ModalBox isOpen={modalIsOpen} consultancyId={selectedConsultancyId} onRequestClose={closeModal}>
                                                    <h2>Modal Title</h2>
                                                    <p>Modal Content</p>
                                                </ModalBox>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                            </div>
                            {/* Pagination component */}
                            <ReactPaginate
                                previousLabel={'Previous'}
                                nextLabel={'Next'}
                                breakLabel={'...'}
                                pageCount={pageCount}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={5}
                                onPageChange={handlePageChange}
                                containerClassName={'pagination'}
                                activeClassName={'active'}
                            />


                        </div>
                    </div>
                </div>

            </div>

            <div>

            </div>

        </div>

    );
}

export default ConsultancyModule;
