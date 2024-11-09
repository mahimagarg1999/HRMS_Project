import React, { useState, useEffect } from 'react';
import './Skills.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditSkills.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
// import lib
const SkillsModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedSkillsId, setSelectedSkillsId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [ids, setIds] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [query, setQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [availableProfile, setAvailableProfile] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState([]);

    // Event handler to move skills from available to selected


    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const openModal = (skillsId) => {
        console.log('skillsId', skillsId)
        setModalIsOpen(true);
        setSelectedSkillsId(skillsId);

    };
    const handleSort = async (column) => {
        console.log("Sort column clicked:", column);
        console.log("Current sort direction:", sortDirection);
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

            try {
                const response = await axios.get(`${BASE_API_URL}skills/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
                settableData(response.data)
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            // If a new column is clicked, set it as the sorting column and reset the direction
            setSortColumn(column);
            setSortDirection('asc');
        }
    };


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
            const response = await axios.delete(`${BASE_API_URL}skills/multi-delete`, {
                data: data // IDs ko data body mein bhejna
            });
            console.log(response.data); // Response ke saath kuch karne ke liye
            settogle(!togle);
            setIds([]);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};
        if (!formData.skills.trim()) {
            newErrors.skills = "skills is required";
            isValid = false;
        }

        if (!formData.profile.length) {
            newErrors.profile = "profile is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const [errors, setErrors] = useState({
        skills: "",
        profile: "",
    });

    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}skills/list`);
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
        let formDataNew = {
            skills: '',
            profile: [],
            description: '',
            profile_id: [],
        }
        setFormData(formDataNew);
        setIsOpen(true);

    };

    const closePopup = () => {
        setIsOpen(false);
        setFormData('')
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
    const toggleRow = (id) => {
        setExpandedRows(prevRows =>
            prevRows.includes(id) ? prevRows.filter(rowId => rowId !== id) : [...prevRows, id]
        );
    };
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        formData.profile = selectedProfile
        console.log('Form Data:', formData);
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}skills/create`, formData);
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
    const DeleteData = (id) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this item?');
        // Check if the user confirmed
        if (isConfirmed) {
            // Delete logic here
            try {
                console.log('id', id)
                const response = axios.delete(`${BASE_API_URL}skills/delete?id=${id}`)

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
    const handleChange = async (event) => {
        const searchValue = event.target.value;
        setQuery(searchValue);
        console.log('Search Value:', searchValue);
    
        if (searchValue !== '') {
            try {
                const response = await axios.get(`${BASE_API_URL}skills/search`, {
                    params: { search: searchValue }
                });
                console.log('Search Results:', response.data);
                settableData(response.data);
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            try {
                const response = await axios.get(`${BASE_API_URL}skills/list`);
                console.log('Full List Data:', response.data.data);
                settableData(response.data.data);
            } catch (error) {
                console.error('Error fetching full list:', error);
            }
        }
    };
    
    
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}profiles/list`);
                console.log("response data--->", response.data.data)
                if (response.data.success) {
                    const profiles = response.data.data;
                    const profileMap = profiles.reduce((map, item) => {
                        map[item.profile_id] = item.profile;
                        return map;
                    }, {});
                    // setProfileMap(profileMap);
                    setAvailableProfile(profiles);

                }
            } catch (error) {
                console.error("Error fetching profiles:", error);
            }
        };

        fetchProfile();
    }, []);

    const handleAddProfile = (profile) => {
        if (!selectedProfile.some(p => p.profile_id === profile.profile_id)) {
            const updatedSelectedProfile = [...selectedProfile, profile];
            setSelectedProfile(updatedSelectedProfile);
            setAvailableProfile(prev => prev.filter(p => p.profile_id !== profile.profile_id));

            // Only store profile names in formData
            setFormData(prev => ({
                ...prev,
                profile: updatedSelectedProfile.map(p => p.profile),
                profile_id: updatedSelectedProfile.map(p => p.profile_id)
            }));

            // Clear error if any profile is selected
            if (updatedSelectedProfile.length > 0) {
                setErrors(prevErrors => {
                    const { profile, ...rest } = prevErrors;
                    return rest;
                });
            }
        }
    };
    const handleRemoveProfile = (profile) => {
        const updatedSelectedProfile = selectedProfile.filter(p => p.profile_id !== profile.profile_id);
        setSelectedProfile(updatedSelectedProfile);
        setAvailableProfile(prev => [...prev, profile]);

        // Update formData to remove profile
        setFormData(prev => ({
            ...prev,
            profile: updatedSelectedProfile.map(p => p.profile),
            profile_id: updatedSelectedProfile.map(p => p.profile_id)
        }));

        // Set error if no profiles are left
        if (updatedSelectedProfile.length === 0) {
            setErrors(prevErrors => ({
                ...prevErrors,
                profile: "At least one profile is required"
            }));
        }
    };

    // ProfileTag Component
    const ProfileTag = ({ profile, onRemove }) => (
        <div className="skill-tag">
            {profile}
            <button onClick={onRemove}>x</button>
        </div>
    );



    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO SKILLS PAGE</h1>
                </div>
                <div >
                    <div class="row">
                        <div class="col-12">
                            <div class="card">
                                <div class="card-body text-center">

                                    <div className='icon_manage'>
                                        <button className="button_design" onClick={openPopup}>
                                            Add &nbsp;<FontAwesomeIcon icon={faPlusCircle} />
                                        </button>
                                        <span> <button className="button_design" onClick={() => { Deletemulti() }}    >
                                            MultiDel&nbsp; <FontAwesomeIcon icon={faTrashAlt} />
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
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Profile Data</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div class="row">
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Skills*</b></label>
                                                                            <input type="text" name="skills" value={formData.skills} onChange={handleInputChange} className="form-control" placeholder="Skill" style={{ width: '170px' }} />

                                                                            {/* <select
                                                                                name="skills"
                                                                                value={formData.skills}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Skills</option>
                                                                                <option value="JavaScript">JavaScript</option>
                                                                                <option value="React">React</option>
                                                                                <option value="Node.js">Node.js</option>
                                                                                <option value="Python">Python</option>
                                                                                <option value="HTML">HTML</option>
                                                                                <option value="CSS">CSS</option>
                                                                                <option value="MySQL">MySQL</option>
                                                                                <option value="MongoDB">MongoDB</option>
                                                                                <option value="Php">Php</option>
                                                                                <option value="Java">Java</option>
                                                                                <option value="Angular">Angular</option>
                                                                                <option value="Wordpress">Wordpress</option>
                                                                                <option value="Drupal">Drupal</option>
                                                                                <option value="Laravel">Laravel</option>
                                                                                <option value="IOS">IOS</option>
                                                                                <option value="Android">Android</option>
                                                                                <option value="Apache">Apache</option>
                                                                                <option value="Magento">Magento</option>
                                                                                <option value="WAMP">WAMP</option>
                                                                                <option value="Code Igniter">Code Igniter</option>
                                                                                <option value="Jquery">Jquery</option>
                                                                                <option value="XAMPP">XAMPP</option>
                                                                                <option value="test">test</option>
                                                                            </select> */}
                                                                             {errors.skills && <span className="error" style={{ color: 'red' }}>{errors.skills}</span>}
                                                                        </div>


                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Profile</b></label>
                                                                            <div className="skills-container">
                                                                                <div className="available-skills">
                                                                                    <select className="form-control" multiple size="4">
                                                                                        {availableProfile.map(profile => (
                                                                                            <option
                                                                                                key={profile.profile_id}
                                                                                                value={profile.profile_id}
                                                                                                onClick={() => handleAddProfile(profile)}
                                                                                            >
                                                                                                {profile.profile}
                                                                                            </option>
                                                                                        ))}
                                                                                    </select>
                                                                                </div>
                                                                                <div className="selected-skills">
                                                                                    <label>Selected Profile</label>
                                                                                    <div>
                                                                                        {selectedProfile.map(profile => (
                                                                                            <ProfileTag
                                                                                                key={profile.profile_id}
                                                                                                profile={profile.profile}
                                                                                                onRemove={() => handleRemoveProfile(profile)}
                                                                                            />
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {errors.profile && <span className="error" style={{ color: 'red' }}>{errors.profile}</span>}
                                                                        </div>
                                                                        <div class="mb-3 col-md-6">
                                                                            <label><b>Description</b></label>
                                                                            <textarea type="text" name="description" value={formData.description} onChange={handleInputChange} class="form-control" placeholder="Description" ></textarea>
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Skills</button>
                                                                    </div>
                                                                    <span style={{ color: 'green', textAlign: 'center' }}>{message && <p>{message}</p>}</span>
                                                                </form>
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
                                        placeholder="Search "
                                    />
                                </div>
                                <div className="table-responsive">
                                    <table className="table">
                                        <thead className="thead-light">
                                            <tr>
                                                <th scope="col" ><b></b></th>
                                                <th scope="col" onClick={() => handleSort('skills')}><b>Skills </b>{sortColumn === 'skills' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" onClick={() => handleSort('description')}><b>Description </b>{sortColumn === 'description' && (
                                                    <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                )}</th>
                                                <th scope="col" ><b>Profile</b></th>
                                                <th scope="col" ><b>Actions</b></th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                        {/* <span className="checkmark"></span> */}
                                                    </label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
                                            {tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                <tr key={index}>
                                                    <td></td>
                                                    <td>{data.skills} </td>
                                                    <td className="description-cell-1">
                                                        {data.description.split(' ').length > 4 ? (
                                                            <>
                                                                {expandedRows.includes(data._id) ? (
                                                                    <>
                                                                        {data.description}
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show less</button>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {data.description.split(' ').slice(0, 4).join(' ')}...
                                                                        <button className="show_more" onClick={() => toggleRow(data._id)}>Show more</button>
                                                                    </>
                                                                )}
                                                            </>                                     
                                                        ) : (
                                                            <>{data.description}</>
                                                        )}
                                                    </td>

                                                    <td>
                                                        {Array.isArray(data.profile)
                                                            ? data.profile.map(p => p.profile).join(', ') // Display only profile names
                                                            : data.profile}                                                    </td>
                                                    < td >

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
                                                            />                                                            <span className="checkmark"></span>
                                                        </label>
                                                    </td>


                                                    <ModalBox isOpen={modalIsOpen} skillsId={selectedSkillsId} onRequestClose={closeModal}>
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
                        </div>
                    </div>

                </div >

                <div>

                </div>


            </div >
            <Footer />        </>
    );
}

export default SkillsModule;





