import React, { useState, useEffect } from 'react';
import './Expenses.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditExpensesModel.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faEye } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
let downloadCount = 0;

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
    const [expensesRows, setExpensesRows] = useState([]);
    const [ids, setIds] = useState([]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    const currentItems = tableData.slice(offset, offset + itemsPerPage);
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
    const [formData, setFormData] = useState({});
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}expenses/list`);
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
        const message = `<h1>expenses_purpose: ${formData.expenses_purpose}</h1>\nexpenses_bill: ${formData.expenses_bill}\nexpenses_amount: ${formData.expenses_amount}\nexpenses_voucher: ${formData.expenses_voucher}\nexpenses_remark: ${formData.expenses_remark}\nexpenses_by_cash: ${formData.expenses_by_cash}\nexpenses_by_cheque:  ${formData.expenses_by_cheque}\nexpenses_cash_recieved_by: ${formData.expenses_cash_recieved_by}\n`;
        const isConfirmed = window.confirm(message);
        e.preventDefault();
        // Handle form submission here, for example, send data to backend or perform validation
        console.log('', formData);
        if (validateForm() && isConfirmed) {
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
        if (e.target.checked) {
            setIds(prevIds => [...prevIds, id]);
        } else {
            setIds(prevIds => prevIds.filter(prevId => prevId !== id));
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
    const toggleRow = (id) => {
        setExpensesRows(prevRows =>
            prevRows.includes(id) ? prevRows.filter(rowId => rowId !== id) : [...prevRows, id]
        );
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
        fetch(`${BASE_API_URL}expenses/export-data`, {
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
            const response = await axios.post(`${BASE_API_URL}expenses/import-data`, formData, {
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


                                    <div className='icon_manage'>

                                        <button onClick={openView} title="View Data" className='button_design_view'>
                                            Export&nbsp; <FontAwesomeIcon icon={faEye} />
                                        </button>
                                        <button className="button_design" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>
                                        <span> <button className="button_design" onClick={() => { DEletemulti() }}    >
                                            MultiDel&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                                        </button></span>

                                    </div>

                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div className="container-fluid">
                                                        <div className="row">
                                                            <div className="col-12">
                                                                <div className="signup-form">
                                                                    <form onSubmit={handleSubmit} className="mt-5 border p-4 bg-light shadow form-custom-style">
                                                                        <div style={{ textAlign: 'center' }}>
                                                                            <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary"><b>Add Expenses</b></h4>
                                                                            <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                        </div>
                                                                        <div className="form-group table-scroll">
                                                                            <table className="table  ">
                                                                                <thead>
                                                                                    <tr>
                                                                                        <th><b>Expenses Purpose*</b></th>
                                                                                        <th><b>Expenses Bill*</b></th>
                                                                                        <th><b>Expenses Amount</b></th>
                                                                                        <th><b>Expenses Voucher</b></th>
                                                                                        <th><b>Expenses Remark</b></th>
                                                                                        <th><b>Expenses By Cash</b></th>
                                                                                        <th><b>Expenses By Cheque</b></th>
                                                                                        <th><b>Expenses Cash Received By</b></th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    <tr>
                                                                                        <td>
                                                                                            <input type="text" name="expenses_purpose" value={formData.expenses_purpose} onChange={handleInputChange} className="form-control" placeholder="Expenses purpose" style={{ width: '170px' }} />
                                                                                            {errors.expenses_purpose && <span className="error" style={{ color: 'red' }}>{errors.expenses_purpose}</span>}
                                                                                        </td>
                                                                                        <td>
                                                                                            <input type="number" name="expenses_bill" value={formData.expenses_bill} onChange={handleInputChange} className="form-control" placeholder="Expenses Bill" />
                                                                                            {errors.expenses_bill && <span className="error" style={{ color: 'red' }}>{errors.expenses_bill}</span>}
                                                                                        </td>
                                                                                        <td>
                                                                                            <input type="number" name="expenses_amount" value={formData.expenses_amount} onChange={handleInputChange} className="form-control" placeholder="Expenses Amount" />
                                                                                        </td>
                                                                                        <td>
                                                                                            <input type="text" name="expenses_voucher" value={formData.expenses_voucher} onChange={handleInputChange} className="form-control" placeholder="Expenses Voucher" />
                                                                                        </td>
                                                                                        <td>
                                                                                            <input type="text" name="expenses_remark" value={formData.expenses_remark} onChange={handleInputChange} className="form-control" placeholder="Expenses Remark" />
                                                                                        </td>
                                                                                        <td>
                                                                                            <select name="expenses_by_cash" value={formData.expenses_by_cash} onChange={handleInputChange} className="form-control">
                                                                                                <option value="">Select Expenses Cash</option>
                                                                                                <option value="Yes">Yes</option>
                                                                                                <option value="No">No</option>
                                                                                            </select>
                                                                                        </td>
                                                                                        <td>
                                                                                            <select name="expenses_by_cheque" value={formData.expenses_by_cheque} onChange={handleInputChange} className="form-control">
                                                                                                <option value="">Select Expenses Cheque</option>
                                                                                                <option value="Yes">Yes</option>
                                                                                                <option value="No">No</option>
                                                                                            </select>
                                                                                        </td>
                                                                                        <td>
                                                                                            <input type="text" name="expenses_cash_recieved_by" value={formData.expenses_cash_recieved_by} onChange={handleInputChange} className="form-control" placeholder="Expenses Cash Received By" />
                                                                                        </td>
                                                                                    </tr>
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                        <div className="col-md-12">
                                                                            <button type="submit">Add Expenses</button>
                                                                        </div>
                                                                        <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>
                                                                    </form>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>




                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div class="containerOnce">
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={handleChange}
                                        placeholder="Search"
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

                                                <th scope="col" onClick={() => handleSort('expenses_purpose')}><b>Expenses Purpose</b>{sortColumn === 'expenses_purpose' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>

                                                <th scope="col" onClick={() => handleSort('expenses_amount')}><b>Expenses Amount </b>{sortColumn === 'expenses_amount' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('expenses_bill')}><b>Expenses Bill</b> {sortColumn === 'expenses_bill' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('expenses_voucher')}><b>Expenses Voucher </b>{sortColumn === 'expenses_voucher' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('transation_id')}><b>Transation  Id </b>{sortColumn === 'transation_id' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col"  ><b>Actions</b></th>

                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (

                                                <tr key={index}>

                                                    <td>{data.expenses_purpose} </td>
                                                    <td>{data.expenses_amount}</td>
                                                    <td>{data.expenses_bill}</td>
                                                    <td>{data.expenses_voucher}</td>
                                                    <td>{data.transaction_id}</td>
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

                                                    <ModalBox isOpen={modalIsOpen} expensesId={selectedExpensesId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
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


            </div>
            <Footer />
        </>
    );
}

export default ExpensesModule;
