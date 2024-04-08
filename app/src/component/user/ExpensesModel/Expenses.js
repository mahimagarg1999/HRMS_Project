import React, { useState, useEffect } from 'react';
import './Expenses.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditExpensesModel.js';
import Nav from '../../navComponent/Nav';

const ExpensesModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedExpensesId, setSelectedExpensesId] = useState(null);

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

    const [formData, setFormData] = useState({
        expenses_purpose: '',
        expenses_bill: '',
        expenses_amount: '',
        expenses_voucher: '',
        expenses_remark: '',
        expenses_by_cash: '',
        expenses_by_cheque: '',
        expenses_cash_recieved_by: '',
        
    });
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
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/expenses/list');
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
        if(validateForm())
        {
        try {
            const response = axios.post('http://localhost:5000/api/expenses/create', formData);
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
                const response = axios.delete(`http://localhost:5000/api/expenses/delete?id=${id}`)

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
        <div style={{ backgroundColor: '#28769a' }}>
            <Nav />
            <h1 className='headerUser'>Welcome TO Expenses Page</h1>
            <div >


                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">
                                <h5 className="card-title m-b-0">
                                    <button style={{ backgroundColor: '#cfa68e', fontSize: '20px', border: 'none', marginBottom: '20px' }} onClick={openPopup}>
                                        Add Expenses +
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
                                                                        <input type="text" name="expenses_purpose" value={formData.expenses_purpose} onChange={handleInputChange} class="form-control" placeholder="Expenses purpose" />
                                                                        {errors.expenses_purpose && <span className="error" style={{color:'red'}}>{errors.expenses_purpose}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_bill" value={formData.expenses_bill} onChange={handleInputChange} class="form-control" placeholder="Expenses Bill" />
                                                                        {errors.expenses_bill && <span className="error" style={{color:'red'}}>{errors.expenses_bill}</span>}

                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_amount" value={formData.expenses_amount} onChange={handleInputChange} class="form-control" placeholder="Expenses Amount" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_voucher" value={formData.expenses_voucher} onChange={handleInputChange} class="form-control" placeholder="Expenses Voucher" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_remark" value={formData.expenses_remark} onChange={handleInputChange} class="form-control" placeholder="Expenses Remark" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_by_cash" value={formData.expenses_by_cash} onChange={handleInputChange} class="form-control" placeholder="Expenses By Cash" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_by_cheque" value={formData.expenses_by_cheque} onChange={handleInputChange} class="form-control" placeholder="Expenses By Cheque" />
                                                                    </div>
                                                                    <div class="mb-3 col-md-6">
                                                                        <input type="text" name="expenses_cash_recieved_by" value={formData.expenses_cash_recieved_by} onChange={handleInputChange} class="form-control" placeholder="Expenses Cash Recieved By" />
                                                                    </div>
                                                                 
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
                                            <th scope="col">id</th>
                                            <th scope="col">Expenses purpose</th>
                                            <th scope="col">Expenses Amount</th>
                                            <th scope="col">Expenses Voucher</th>
                                            <th scope="col" >ACTIONS</th>

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
                                                <td>{data.expenses_purpose} </td>
                                                <td>{data.expenses_amount}</td>
                                                <td>{data.expenses_voucher}</td>
                                                <button onClick={() => DeleteData(data._id)} style={{ backgroundColor: 'red' }}>DELETE</button>
                                                <button onClick={() => { openModal(data._id) }} style={{ backgroundColor: 'green' }}> EDIT</button>
                                                <ModalBox isOpen={modalIsOpen} expensesId={selectedExpensesId} onRequestClose={closeModal}>
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

export default ExpensesModule;
