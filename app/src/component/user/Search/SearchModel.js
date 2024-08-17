import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Nav from '../../navComponent/Nav';
import Footer from '../../FooterModule/Footer.js';
import axios from 'axios';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import './SearchModel.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faSortUp, faSortDown,faEnvelope, faEye, faFilePdf } from '@fortawesome/free-solid-svg-icons';
let downloadCount = 0;

const SearchModule = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [availableSkills, setAvailableSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);
    const [formData, setFormData] = useState({});
    const [allSkills, setAllSkills] = useState('no');
    const [triggerSearch, setTriggerSearch] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [message, setMessage] = useState('');
    const [data, setData] = useState([]); // Initialize data with an empty array

    const [errors, setErrors] = useState({
        candidate_skills: '',
        candidate_experience: '',
    });

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected);
    };

    const itemsPerPage = 10; // Updated to 10 items per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);


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

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}/skills/get_skills`);
                if (response.data.success) {
                    const skills = response.data.data.map(item => item.skills);
                    setAvailableSkills(skills);
                }
            } catch (error) {
                console.error("Error fetching skills:", error);
            }
        };

        fetchSkills();
    }, []);
    // const fetchData = async () => {
    //     try {
    //         const skillsQuery = selectedSkills.join(',');
    //         const candidateQuery = formData.candidate_experience;
    //         const response = await axios.get(
    //             `${BASE_API_URL}candidate/search-advance?candidate_skills=${skillsQuery}&candidate_experience=${candidateQuery}`
    //         );
    //         setTableData(response.data);
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };
    const fetchData = async () => {
        try {
            const skillsQuery = selectedSkills.join(',');
            const candidateQuery = formData.candidate_experience;
            const response = await axios.get(
                `${BASE_API_URL}candidate/search-advance?candidate_skills=${skillsQuery}&candidate_experience=${candidateQuery}&all_skills=${allSkills}`
            );
            setTableData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [selectedSkills, formData.candidate_experience, allSkills]);

    const handleAddSkill = (skill) => {
        if (!selectedSkills.includes(skill)) {
            const updatedSelectedSkills = [...selectedSkills, skill];
            setSelectedSkills(updatedSelectedSkills);
            setAvailableSkills(availableSkills.filter(item => item !== skill));
            setFormData({ ...formData, candidate_skills: updatedSelectedSkills });

            if (updatedSelectedSkills.length > 0) {
                setErrors((prevErrors) => {
                    const { candidate_skills, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };

    const handleRemoveSkill = (skill) => {
        const updatedSelectedSkills = selectedSkills.filter(item => item !== skill);
        setSelectedSkills(updatedSelectedSkills);
        setAvailableSkills([...availableSkills, skill]);
        setFormData({ ...formData, candidate_skills: updatedSelectedSkills });

        if (updatedSelectedSkills.length === 0) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                candidate_skills: "At least one skill is required"
            }));
        }
    };

    const handleSort = async (column) => {
        if (column === sortColumn) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            try {
                const response = await axios.get(`${BASE_API_URL}candidate/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
                setTableData(response.data);
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const SkillTag = ({ skill, onRemove }) => (
        <div className="skill-tag">
            {skill}
            <button onClick={() => onRemove(skill)}>x</button>
        </div>
    );

    const convertToCSV = (data) => {
        if (data.length === 0) {
            return '';
        }
        // Get headers
        const header = Object.keys(data[0]).join(',');
        // Convert rows
        const rows = data.map(row => {
            return Object.values(row).map(value => {
                // Check if the value is an array (like candidate_skills)
                if (Array.isArray(value)) {
                    return `"${value.join(', ')}"`; // Join array elements into a single string with commas
                }
                return value;
            }).join(',');
        }).join('\n');

        return `${header}\n${rows}`;
    };

    const downloadCSV = (csv, filename) => {
        fetch(`${BASE_API_URL}candidate/export-data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ csvData: csv, filename: filename }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.path) {
                    if (window.confirm('Data exported successfully. Do you want to download the file now?')) {
                        // Construct the full URL for the download
                        const blob = new Blob([csv], { type: 'text/csv' });
                        const url = window.URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = filename;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url); // Clean up the URL.createObjectURL resource
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
        const filename = `search_data${downloadCount}.csv`; // Dynamic filename
        downloadCSV(csv, filename);
    };

    const handleAllSkillsChange = (e) => {
        const value = e.target.value;
        if (window.confirm('Are you sure you want to change the skill filter?')) {
            setAllSkills(value);
        }
    };
    const handleSearch = () => {
        setTriggerSearch(true);
    };
    const handleCheckboxChangeEmail = (email) => {
        setSelectedEmails(prevSelectedEmails =>
            prevSelectedEmails.includes(email)
                ? prevSelectedEmails.filter(e => e !== email)
                : [...prevSelectedEmails, email]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEmails([]); // Deselect all

        } else {
            setSelectedEmails(data.map(data => data.candidate_email)); // Select all
        }
        setSelectAll(!selectAll); // Toggle selectAll state
    };


    const sendEmails = async () => {
        if (selectedEmails.length === 0) {
            setMessage('Please select at least one email to send.');
            return;
        }
        setMessage('Sending emails...');
        try {
            const response = await axios.post(`${BASE_API_URL}candidate/send-mail`, { emails: selectedEmails });
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
            <Nav />
            <div style={{ backgroundColor: '#28769a' }}>
                <h1 className='headerUser'>WELCOME TO SEARCHING PAGE</h1>
            </div>
            <div className="row">
                <div className="mb-3 col-md-1 "></div>

                <div className="mb-5 col-md-5 ">
                    <label><b>Skills</b></label>
                    <select
                        className="form-control"
                        onChange={(e) => handleAddSkill(e.target.value)}
                        disabled={availableSkills.length === 0}
                        style={{ backgroundColor: availableSkills.length === 0 ? 'lightgray' : 'white' }}
                    >
                        <option value="" disabled selected hidden>Select Skills</option>
                        {availableSkills.map(skill => (
                            <option key={skill} value={skill}>{skill}</option>
                        ))}
                    </select>
                    {errors.candidate_skills && <span style={{ color: 'red' }}>{errors.candidate_skills}</span>}
                    <div className="selected-skills">
                        {selectedSkills.map(skill => (
                            <SkillTag key={skill} skill={skill} onRemove={handleRemoveSkill} />
                        ))}
                    </div>
                </div>
                <div className="mb-5 col-md-5">
                    <label><b>Candidate Experience*</b></label>
                    <select
                        name="candidate_experience"
                        value={formData.candidate_experience}
                        onChange={handleInputChange}
                        className="form-control"
                    >
                        <option value=""> Select Experience </option>
                        <option value="0-1">0 - 1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10 +</option>
                    </select>
                </div>
                <div className="mb-3 col-md-1 "></div>
                <div className="mb-3 col-md-1 "></div>
                <div className="mb-5 col-md-5">
                    <label><b>Search All Skills*</b></label>
                    <select
                        name="allSkills"
                        value={allSkills}
                        onChange={handleAllSkillsChange}
                        className="form-control"
                    >
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>


                <div className="mb-5 col-md-1   ">
                    <label><b>Action</b></label>
                    <button onClick={handleSearch} className="export_design btn btn-primary">
                        OK
                    </button>
                </div>
                <div className="mb-5 col-md-1">
                    <label><b>Export data</b></label>

                    {/* <div class="containerSearching icon_manage"> */}
                    <button onClick={openView} title="View Data" className='export_design btn btn-primary'>
                        Export&nbsp; <FontAwesomeIcon icon={faEye} />
                    </button>

                   
                </div>
                <div className="mb-5 col-md-1">
                    <label><b>Send Emails</b></label>
                    {/* <div class="containerSearching icon_manage"> */}
                    <button onClick={sendEmails} title="Send mail" className='export_design btn btn-primary'>
                    Send Emails <FontAwesomeIcon icon={faEnvelope} />
                    </button>
 
                </div>
                {message && <div className="mt-3 alert alert-success">{message}</div>}

                <div className="table-responsive">

                    <table className="table">
                        <thead className="thead-light">
                            <tr>

                                <th scope="col" onClick={() => handleSort('candidate_id')}><b>ID</b> {sortColumn === 'candidate_id' && (
                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                )}</th>
                                <th scope="col" onClick={() => handleSort('candidate_first_name')}><b>Name</b> {sortColumn === 'candidate_first_name' && (
                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                )}</th>
                                <th scope="col" onClick={() => handleSort('candidate_email')}><b>Email </b>{sortColumn === 'candidate_email' && (
                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                )}</th>


                                <th scope="col" onClick={() => handleSort('candidate_mobile')}> <b>Mobile</b> {sortColumn === 'candidate_mobile' && (
                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                )}</th>
                                <th scope="col" onClick={() => handleSort('candidate_selection_status')}><b>Hiring Status</b> {sortColumn === 'candidate_selection_status' && (
                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                )}</th>
                                <th scope="col" onClick={() => handleSort('candidate_skills')}><b>Skills </b>{sortColumn === 'candidate_skills' && (
                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                )}</th>
                                <th scope="col"  ><b>Document Proof </b></th>
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

                                    <td>{data.candidate_id}</td>
                                    <td>{data.candidate_first_name}&nbsp;{data.candidate_last_name} </td>
                                    <td>{data.candidate_email}</td>
                                    <td>{data.candidate_mobile}</td>
                                    <td>{data.candidate_selection_status}</td>
                                    <td>{data.candidate_skills.join(', ')}</td>

                                    <td>
                                        <button
                                            className="editButton"
                                            onClick={() => window.open(`http://localhost:5000/${data.candidate_document_proof}`, '_blank')}
                                            style={{ color: 'rgb(40, 118, 154)', background: 'none', border: 'none', cursor: 'pointer' }} title="Show Pdf"
                                        >
                                            <FontAwesomeIcon icon={faFilePdf} />

                                        </button>
                                    </td>
                                    <td>
                                        <input style={{ marginLeft: "18px" }}
                                            type="checkbox"
                                            checked={selectedEmails.includes(data.candidate_email)}
                                            onChange={() => handleCheckboxChangeEmail(data.candidate_email)}
                                        />
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* <div className="pagination-container">
                    <ReactPaginate
                        pageCount={pageCount}
                        onPageChange={handlePageChange}
                        containerClassName={'pagination'}
                        activeClassName={'active'}
                    />
                </div> */}
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
            <Footer />
        </>
    );
};

export default SearchModule;
