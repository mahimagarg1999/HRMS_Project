import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditCodeBankAdmin.js';
import Nav from '../../navComponent/Nav.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrash, faSortUp, faSortDown, faEnvelope, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import Footer from '../../FooterModule/Footer.js'

// FOR EDITOR 

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CodebankAdminModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedCodebankId, setSelectedCodebankId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [ids, setIds] = useState([]);
    const [code, setCode] = useState('');
    const [selectedFile, setSelectedFile] = useState('');
    const [query, setQuery] = useState('');
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [expandedRows, setExpandedRows] = useState([]);
    const [skillsList, setSkillsList] = useState([]);

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);
    // const currentItems = tableData.slice(offset, offset + itemsPerPage);

    // const [data, setData] = useState(formData);
    const openModal = (CodebankId) => {
        console.log('CodebankId', CodebankId)
        setModalIsOpen(true);
        setSelectedCodebankId(CodebankId);

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
                const response = await axios.get(`${BASE_API_URL}codebank/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
        title: '',
        skills: '', // Ensure this is the initial state
        code: '',
        code_file: null
    });
    // const handleFileChange = (e) => {
    //     const file = e.target.files[0];
    //     if (file instanceof Blob) {
    //         const reader = new FileReader();
    //         console.log("e----->", e.target.name);

    //         reader.onloadend = () => {
    //             if (e.target && e.target.name === 'code_file') {
    //                 console.log('hii')
    //                 setCodebank(reader.result);
    //             }

    //             console.log('selectedFile', selectedFile)

    //         };
    //         reader.readAsDataURL(file);
    //     } else {
    //         console.error("The selected file is not a Blob.");
    //     }
    // };
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const extension = file.name.split('.').pop().toLowerCase();  // Get file extension
            console.log("Selected file:", file);
            console.log("File extension:", extension);

            if (['pdf', 'txt','zip'].includes(extension)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (e.target.name === 'code_file') {
                        console.log('Base64 File Data:', reader.result);  // Check base64 data
                        setCode(reader.result);  // Set base64 data

                        // Dynamically set file type in formData based on the file extension
                        setFormData(prevState => ({
                            ...prevState,
                            code_file: reader.result,  // Set base64 data
                            codebankPdfName: extension // Set 'pdf' or 'txt' dynamically
                        }));
                    }
                };
                reader.readAsDataURL(file);  // Convert file to base64
            } else {
                console.error("Only PDF and TXT files are allowed");
            }
        } else {
            console.error("No file selected.");
        }
    };




    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}codebank/list`);
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
        // Reset formData
        let formDataNew = {
            title: '',
            code: '',
            skills: '',
            code_file: '',   // Base64 file data yahan set hoga
            codebankPdfName: '' // Initially empty, will be set based on file type
        };
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
        })
        );
        setErrors({
            ...errors,
            [name]: "",
        });
    };
    const handleCodeChange = (newValue) => {
        setFormData(prevData => ({
            ...prevData,
            code: newValue
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.code_file = code;  // Ensure code_file is set to base64 data
        console.log('Form Data:', formData);  // Final form data to send to backend

        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}codebank/create`, formData);
                settogle(!togle)
                console.log(response.data);  // Handle the response as needed
                setMessage(response.data.msg);
                if (response.data.success) {
                    closePopup();
                }
                setTimeout(() => setMessage(''), 2000);
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
                const response = axios.delete(`${BASE_API_URL}codebank/delete?id=${id}`)

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
            const response = await axios.delete(`${BASE_API_URL}codebank/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
     const [errors, setErrors] = useState({
        title: "",
        skills: "",

    });
    const validateForm = () => {
   
        let isValid = true;
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "title is required";
            isValid = false;
        }

        if (!formData.skills.trim()) {
            newErrors.skills = "skills is required";
            isValid = false;
        }



        setErrors(newErrors);
        return isValid;
    };


    const handleChange = async (event) => {
        setQuery(event.target.value);
        console.log(event.target.value)
        if (event.target.value !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}codebank/search?search=${event.target.value}`, {
                });
                console.log(query)
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
        else {
            try {
                const response = await axios.get(`${BASE_API_URL}codebank/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };

    const toggleRow = (id) => {
        setExpandedRows(prevRows =>
            prevRows.includes(id) ? prevRows.filter(rowId => rowId !== id) : [...prevRows, id]
        );
    };

    const fetchSkills = async () => {
        try {
            const response = await axios.get(`${BASE_API_URL}skills/get_skills`);
            console.log("Fetched Skills Data:", response.data);

            if (response.data.success) {
                 setSkillsList(response.data.data); // Update skills list state
                 setFormData(prevData => ({
                    ...prevData,
                    skills: response.data.data[0]?.skills || '' // Set the default skill
                }));
            }
        } catch (error) {
            console.error("Error fetching skills data:", error);
        }
    };

    useEffect(() => {
        fetchSkills();
    }, []);
    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO CODEBANK PAGE</h1>
                </div>
                <div >
                    <div className="row">
                        <div className="col-12">
                            <div className="card">
                                <div className="card-body text-center">

                                    <div className='icon_manage'>
                                        <button className="button_design" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>

                                        <span> <button onClick={() => { Deletemulti() }} className='button_design'  >
                                            MultiDel&nbsp;  <FontAwesomeIcon icon={faTrashAlt} />
                                        </button></span>

                                    </div>
                                    {message && <div className="mt-3 alert alert-success">{message}</div>}

                                    {isOpen && (
                                        <div>
                                            <div>
                                                <div>
                                                    <div className="row">
                                                        <div className="col-md-6 offset-md-3">
                                                            <div className="signup-form">
                                                                <form onSubmit={handleSubmit} className="mt-5 border p-4 bg-light shadow">
                                                                    <div style={{ textAlign: 'center' }}>
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Codebank</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Skills*</b></label>
                                                                            <select
                                                                                name="skills"
                                                                                value={formData.skills}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Skill</option>
                                                                                {skillsList.map(skill => (
                                                                                    <option key={skill.skills} value={skill.skills}>
                                                                                        {skill.skills}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.skills && <span className="error" style={{ color: 'red' }}>{errors.skills}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>  Title*</b></label>
                                                                            <input type="text" name="title" value={formData.title} onChange={handleInputChange} className="form-control" placeholder="Title" />
                                                                            {errors.title && <span className="error" style={{ color: 'red' }}>{errors.title}</span>}

                                                                        </div>
                                                                        
                                                                        <div>
                                                                            <ReactQuill
                                                                                value={formData.code}
                                                                                onChange={handleCodeChange}
                                                                                theme="snow"
                                                                            />
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>File</b></label>
                                                                            <input
                                                                                type="file"
                                                                                accept=".pdf, .txt, .zip"
                                                                                onChange={handleFileChange}
                                                                                className="form-control"
                                                                                name="code_file"
                                                                            />                                                                    </div>

                                                                    </div>
                                                                    <div className="col-md-12">
                                                                        <button type="submit">Add Code Bank</button>
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
                                <div className="containerOnce">
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

                                                <th scope="col" onClick={() => handleSort('skills')}> <b>Skills  </b>{sortColumn === 'skills' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('title')}><b>Title </b>{sortColumn === 'title' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('code')}><b> Code</b>
                                                    {sortColumn === 'code' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}</th>
                                                <th scope="col" onClick={() => handleSort('code_file')}><b>File</b> {sortColumn === 'code_file' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>


                                                <th scope="col" ><b>ACTIONS </b></th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                    </label>
                                                </th>


                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>

                                                    <td>{data.skills} </td>
                                                    <td>{data.title}</td>
                                                    {/* <td >
                                                        {data.code.split(' ').length > 4 ? (
                                                            <>
                                                                {expandedRows.includes(data._id) ? (
                                                                    <>
                                                                        {data.code}
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show less</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {data.code.split(' ').slice(0, 3).join(' ')}...
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show more</button>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <>{data.code}</>
                                                        )}
                                                    </td> */}

                                                    <td>
                                                        {data.code.split(' ').length > 10 ? (
                                                            <>
                                                                {expandedRows.includes(data._id) ? (
                                                                    <>
                                                                        <pre className="codeBlock" dangerouslySetInnerHTML={{ __html: data.code }} />
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show less</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <pre className="codeBlock" dangerouslySetInnerHTML={{ __html: data.code.split(' ').slice(0, 10).join(' ') }} />
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show more</button>
                                                                    </>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <pre className="codeBlock" dangerouslySetInnerHTML={{ __html: data.code }} />
                                                        )}
                                                    </td>



                                                    <td>
                                                        <button
                                                            className="editButton"
                                                            onClick={() => window.open(`http://localhost:5000/${data.code_file}`, '_blank')}
                                                            style={{ color: 'rgb(40, 118, 154)', background: 'none', border: 'none', cursor: 'pointer' }} title="Show Pdf"
                                                        >
                                                            <FontAwesomeIcon icon={faFilePdf} />

                                                        </button>
                                                    </td>



                                                    <td>
                                                        <button className="editButton" onClick={() => DeleteData(data._id)} >  <FontAwesomeIcon icon={faTrash} /></button>
                                                        <button className="editButton" onClick={() => openModal(data._id)} >
                                                            <FontAwesomeIcon icon={faEdit} />
                                                        </button>
                                                    </td>
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


                                                    <ModalBox isOpen={modalIsOpen} CodebankId={selectedCodebankId} onRequestClose={closeModal}>
                                                        <h2>Modal Title</h2>
                                                        <p>Modal Content</p>
                                                    </ModalBox>

                                                    {/* ====== */}
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

export default CodebankAdminModule;
