// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';

const ModalBox = ({ isOpen, onRequestClose, expensesId }) => {

    const [data, setData] = useState([])
    const [message, setMessage] = useState('');
    useEffect(() => {

        if (isOpen) {
            setMessage('')
            console.log('model open', expensesId)
            // Fetch data for the given expensesId
            if (expensesId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`${BASE_API_URL}expenses/get?expensesid=${expensesId}`);


                        setData(response.data.data)
                        console.log('data', data)

                    } catch (error) {
                        console.log('model open error')

                        console.error('Error fetching employee data:', error);
                    }
                };

                fetchData();
            }
        }
    }, [isOpen]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit =async (e) => {
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response =await axios.put(`${BASE_API_URL}expenses/edit`, data);
            console.log(response.data); // Handle the response as needed
            setMessage(response.data.msg)
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            ariaHideApp={false}
            style={{
                overlay: {

                    backgroundColor: 'rgba(0, 0, 0, 0.5)'
                },
                content: {
                    width: '90%',
                    height: '90%',
                    margin: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    padding: '20px'
                }
            }}
        >
            <button onClick={onRequestClose}>Close</button>

            <div class="row">
                <div class="col-md-6 offset-md-3">
                    <div class="signup-form">
                        <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
                            <div style={{ textAlign: 'center' }}>
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Expenses Data</h4>

                            </div>
                            <div class="row">
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses Purpose</b></label>
                                    <input type="text" name="expenses_purpose" value={data.expenses_purpose} onChange={handleInputChange} class="form-control" placeholder="Expenses purpose" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses Bill</b></label>
                                    <input type="text" name="expenses_bill" value={data.expenses_bill} onChange={handleInputChange} class="form-control" placeholder="Expenses Bill" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses Amount</b></label>
                                    <input type="text" name="expenses_amount" value={data.expenses_amount} onChange={handleInputChange} class="form-control" placeholder="Expenses Amount" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses Voucher</b></label>
                                    <input type="text" name="expenses_voucher" value={data.expenses_voucher} onChange={handleInputChange} class="form-control" placeholder="Expenses Voucher" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses Remark</b></label>
                                    <input type="test" name="expenses_remark" value={data.expenses_remark} onChange={handleInputChange} class="form-control" placeholder="Expenses Remark" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses By Cash</b></label>
                                    <input type="text" name="expenses_by_cash" value={data.expenses_by_cash} onChange={handleInputChange} class="form-control" placeholder="Expenses By Cash" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses By Cheque</b></label>
                                    <input type="text" name="expenses_by_cheque" value={data.expenses_by_cheque} onChange={handleInputChange} class="form-control" placeholder="Expenses By Cheque" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <label><b>Expenses Cash Recieved By </b></label>
                                    <input type="text" name="expenses_cash_recieved_by" value={data.expenses_cash_recieved_by} onChange={handleInputChange} class="form-control" placeholder="Expenses Cash Recieved By" />
                                </div>
                                <span style={{ color: 'green',textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                            </div>

                            <div class="col-md-12">
                                <button type="submit">Edit here</button>
                            </div>
                            <span style={{ color: 'green',textAlign: 'center' }}>{message && <p>{message}</p>}</span>

                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default ModalBox;