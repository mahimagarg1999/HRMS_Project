// Modal.js
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
 import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';
import { BASE_API_URL } from '../../../lib/constants.jsx';
const ModalBox = ({ isOpen, onRequestClose, helpCenterId }) => {

    const [data, setData] = useState([])
    const [msg, setmsg] = useState('')

    useEffect(() => {

        if (isOpen) {
            setmsg('')
            console.log('model open', helpCenterId)
            // Fetch data for the given employeeId
            if (helpCenterId) {
                const fetchData = async () => {
                    try {

                        const response = await axios.get(`${BASE_API_URL}helpcenter/get?helpcenterid=${helpCenterId}`);


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

    const handleSubmit = async(e) => {
        console.log("data", data)
        e.preventDefault();
        // Handle form submission here
        try {
            const response =await axios.put(`${BASE_API_URL}helpcenter/edit`, data);
            console.log(response); // Handle the response as needed
            setmsg(response.data.msg)
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
                                <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Help Center</h4>

                            </div>
                            <div class="row">
                            <div class="mb-3 col-md-6">
                                <b><label >Employe Code</label></b>

                                    <input  type="text" name="helpcenter_employee_code" value={data.helpcenter_employee_code}  class="form-control" placeholder="helpcenter_employee_code" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b><label>Ticket ID</label></b>

                                    <input type="text" name="helpcenter_ticket_id" value={data.helpcenter_ticket_id} redonly class="form-control" placeholder="Ticket Id" />
                                </div>
                             
                                <div class="mb-3 col-md-6">
                                <b><label>Ticket Description</label></b>

                                    <textarea type="text" name="helpcenter_ticket_description" value={data.helpcenter_ticket_description} onChange={handleInputChange} class="form-control" placeholder="Ticket Discription" />
                                </div>
                                <div class="mb-3 col-md-6">
                                <b><label>Ticket Priority</label></b>

                                    {/* <input type="text" name="helpcenter_ticket_priority" value={data.helpcenter_ticket_priority} onChange={handleInputChange} class="form-control" placeholder="Ticket Priority" /> */}
                                    <select 
        name="helpcenter_ticket_priority" 
        value={data.helpcenter_ticket_priority} 
        onChange={handleInputChange} 
        className="form-control"
    >
        <option value="">Select Ticket Priority </option>
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>


    </select>
                                </div>
                                <div class="mb-3 col-md-6">
                                <b><label>Ticket Department</label></b>

                                
    <select 
        name="helpcenter_ticket_department" 
        value={data.helpcenter_ticket_department} 
        onChange={handleInputChange} 
        className="form-control"
    >
        <option value="">Select Ticket Department</option>
        <option value="Administer">Administer</option>
        <option value="HR">HR</option>
    </select>
</div>
                             
                                <div class="mb-3 col-md-6">
                                <b><label >Ticket Status</label></b>

                                    <input redonly type="text" name="helpcenter_ticket_status" value={data.helpcenter_ticket_status}  class="form-control" placeholder="Ticket Status" />
                                </div>
                                
                                


                                {/* <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket1" value={data.helpcenter_ticket1} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-1" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket2" value={data.helpcenter_ticket2} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-2" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket3" value={data.helpcenter_ticket3} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-3" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket4" value={data.helpcenter_ticket4} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-4" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket5" value={data.helpcenter_ticket5} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-5" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket6" value={data.helpcenter_ticket6} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket6" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket8" value={data.helpcenter_ticket8} onChange={handleInputChange} class="form-control" placeholder="Helpcenter ticket8" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket9" value={data.helpcenter_ticket9} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-9" />
                                </div>
                                <div class="mb-3 col-md-6">
                                    <input type="text" name="helpcenter_ticket10" value={data.helpcenter_ticket10} onChange={handleInputChange} class="form-control" placeholder="Helpcenter Ticket-10" />
                                </div> */}
                            </div>
                          <span style={{color:'green'}}>{msg}</span>  
                            <div class="col-md-12">
                                <button type="submit">EDit here</button>
                            </div>
                        </form>


                    </div>
                </div>
            </div>
        </Modal>
    );
};


export default ModalBox;