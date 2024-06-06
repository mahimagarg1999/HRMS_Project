import React, { useState, useEffect } from 'react';
import './Expenses.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditExpensesModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
const ExpensesModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedExpensesId, setSelectedExpensesId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [query, setQuery] = useState('');



    const [ids, setId] = useState([]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 5; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    const currentItems = tableData.slice(offset, offset + itemsPerPage);
    // const [data, setData] = useState(formData);
    const openModal = (expensesId) => {
        console.log('expensesId', expensesId)
        setModalIsOpen(true);
        setSelectedExpensesId(expensesId);

    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const handleSort = async (column) => {
        console.log("checking sorting", sortColumn, column)
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            try {
                const response = await axios.get(`${BASE_API_URL}expenses/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
    // const sortedData = () => {
    //     if (sortColumn) {
    //         const sorted = [...tableData].sort((a, b) => {
    //             const valueA = a[sortColumn];
    //             const valueB = b[sortColumn];
    //             if (typeof valueA === 'string' && typeof valueB === 'string') {
    //                 // Case-insensitive string comparison
    //                 return sortDirection === 'ascending' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    //             } else {
    //                 // Numerical or other comparison
    //                 return sortDirection === 'ascending' ? valueA - valueB : valueB - valueA;
    //             }
    //         });
    //         return sortDirection === 'ascending' ? sorted : sorted.reverse();
    //     }
    //     return tableData; // Return original data if no sorting column is selected
    // };
    const [formData, setFormData] = useState({

    });
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}expenses/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);

    const openPopup = () => {
        setMessage('');
        setFormData('');
        let formDataNew = {
            expenses_purpose: '',
            expenses_bill: '',
            expenses_amount: '',
            expenses_voucher: '',
            expenses_remark: '',
            expenses_by_cash: '',
            expenses_by_cheque: '',
            expenses_cash_recieved_by: '',

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
        expenses_purpose: "",

        expenses_bill: "",


    });

    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (!formData.expenses_purpose.trim()) {
            newErrors.expenses_purpose = "expenses_purpose is required";
            isValid = false;
        }

        if (!formData.expenses_bill.trim()) {
            newErrors.expenses_bill = "expenses_bill is required";
            isValid = false;
        }


        setErrors(newErrors);
        return isValid;
    };

    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}expenses/create`, formData);
                settogle(!togle)
                console.log(response.data); // Handle the response as needed
                setMessage(response.data.msg)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };
    const DeleteData = async (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');

        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = await axios.delete(`${BASE_API_URL}expenses/delete?id=${id}`)

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
        // If the checkbox is checked, add the ID to the list of selected IDs
        if (e.target.checked) {
            setId(prevIds => [...prevIds, id]);
        } else {
            // If the checkbox is unchecked, remove the ID from the list of selected IDs
            setId(prevIds => prevIds.filter(prevId => prevId !== id));
        }
    };
    const DEletemulti = async () => {
        const data = {
            "ids": ids
        };
        console.log('ids', data);

        try {
            const response = await axios.delete(`${BASE_API_URL}expenses/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}expenses/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}expenses/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerUser'>WELCOME TO EXPENSES PAGE</h1>
                </div>
                <div >


                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body text-center">
                                    {/* <h5 className="card-title m-b-0">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add Expenses +
                                    </button>
                                </h5> */}

                                    <div>
                                        <button className="backButton" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>
                                    </div>
                                    <div> <span> <button className="multiDeleteButton" onClick={() => { DEletemulti() }}    >
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button></span></div>
                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div class="row">
                                                        <div class="col-md-6 offset-md-3">
                                                            <div class="signup-form">
                                                                <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Expenses</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses Purpose*</b></label>
                                                                            <input type="text" name="expenses_purpose" value={formData.expenses_purpose} onChange={handleInputChange} class="form-control" placeholder="Expenses purpose" />
                                                                            {errors.expenses_purpose && <span className="error" style={{ color: 'red' }}>{errors.expenses_purpose}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses Bill</b></label>
                                                                            <input type="text" name="expenses_bill" value={formData.expenses_bill} onChange={handleInputChange} class="form-control" placeholder="Expenses Bill" />
                                                                            {errors.expenses_bill && <span className="error" style={{ color: 'red' }}>{errors.expenses_bill}</span>}

                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses Amount</b></label>
                                                                            <input type="number" name="expenses_amount" value={formData.expenses_amount} onChange={handleInputChange} class="form-control" placeholder="Expenses Amount" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses Voucher</b></label>
                                                                            <input type="text" name="expenses_voucher" value={formData.expenses_voucher} onChange={handleInputChange} class="form-control" placeholder="Expenses Voucher" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses Remark</b></label>
                                                                            <input type="text" name="expenses_remark" value={formData.expenses_remark} onChange={handleInputChange} class="form-control" placeholder="Expenses Remark" />
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses By Cash</b></label>
                                                                            {/* <input type="text" name="expenses_by_cash" value={formData.expenses_by_cash} onChange={handleInputChange} class="form-control" placeholder="Expenses By Cash" /> */}
                                                                            <select 
        name="expenses_by_cash" 
        value={formData.expenses_by_cash} 
        onChange={handleInputChange} 
        className="form-control"
    >
        <option value="">Select Expenses Cash</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
    </select>



                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses By Cheque</b></label>
                                                                            {/* <input type="text" name="expenses_by_cheque" value={formData.expenses_by_cheque} onChange={handleInputChange} class="form-control" placeholder="Expenses By Cheque" /> */}
                                                                            <select 
        name="expenses_by_cheque" 
        value={formData.expenses_by_cheque} 
        onChange={handleInputChange} 
        className="form-control"
    >
        <option value="">Select Expenses Cheque</option>
        <option value="Yes">Yes</option>
        <option value="No">No</option>
    </select>

                                                                    
                                                                    
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Expenses Cash Recieved By </b></label>
                                                                            <input type="text" name="expenses_cash_recieved_by" value={formData.expenses_cash_recieved_by} onChange={handleInputChange} class="form-control" placeholder="Expenses Cash Recieved By" />
                                                                        </div>

                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Expenses</button>
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
                                        placeholder="Search"
                                    />
                                </div>
                                <div className="table-responsive">
                                    {/* <form > */}
                                    {/* <input
                                            type="text"
                                            value={query}
                                            onChange={handleChange}
                                            placeholder="Search by first name, last name, or both"
                                        /> */}
                                    {/* </form> */}
                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>

                                                {/* <th scope="col"  >Id   </th> */}
                                                <th scope="col" onClick={() => handleSort('expenses_purpose')}>Expenses Purpose{sortColumn === 'expenses_purpose' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>

                                                <th scope="col" onClick={() => handleSort('expenses_amount')}>Expenses Amount {sortColumn === 'expenses_amount' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('expenses_bill')}>Expenses Bill {sortColumn === 'expenses_bill' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('expenses_voucher')}>Expenses Voucher {sortColumn === 'expenses_voucher' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  >Actions</th>

                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (

                                                <tr key={index}>

                                                    {/* <td>{data._id}</td> */}
                                                    <td>{data.expenses_purpose} </td>
                                                    <td>{data.expenses_amount}</td>
                                                    <td>{data.expenses_bill}</td>
                                                    <td>{data.expenses_voucher}</td>
                                                    <td>
                                                        <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                    </td>
                                                    <td>
                                                        <label className="customcheckbox">
                                                            <input type="checkbox" className="listCheckbox" onChange={(e) => handleCheckboxChange(e, data._id)} />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>

                                                    <ModalBox isOpen={modalIsOpen} expensesId={selectedExpensesId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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
            <Footer />
        </>
    );
}

export default ExpensesModule;
