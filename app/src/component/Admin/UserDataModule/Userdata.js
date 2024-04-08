import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Nav from '../../navComponent/Nav';

const Userdata = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])

    // const [data, setData] = useState(formData);

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


    // Function to handle form submission


    return (

        <div style={{ backgroundColor: '#28769a' }}>
            <Nav />
            <h1>USER DATA</h1>
            <div >


                <div class="row">
                    <div class="col-12">
                        <div class="card">
                            <div class="card-body text-center">


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
                                            <th scope="col"> gender</th>

                                        </tr>
                                    </thead>
                                    <tbody className="customtable">
                                        {tableData.map((data, index) => (
                                            data.role === 'user' ? (
                                                <tr key={index}>
                                                    <td>
                                                        <label className="customcheckbox">
                                                            <input type="checkbox" className="listCheckbox" />
                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>
                                                    <td>{data._id}</td>
                                                    <td>{data.fname}&nbsp;{data.lname}</td>
                                                    <td>{data.email}</td>
                                                    <td>{data.gender}</td>
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

export default Userdata;
