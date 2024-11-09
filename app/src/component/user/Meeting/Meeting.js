import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditMeeting.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './Meeting.css';

// import lib
const MeetingModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
 
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedMeetingId, setSelectedMeetingId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [ids, setIds] = useState([]);
    const [query, setQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [date, setDate] = useState(new Date());
    const [meetings, setMeetings] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false); // State to show/hide calendar
    const [selectedMeeting, setSelectedMeeting] = useState(null); // To store the clicked Meeting
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeIds, setEmployeeIds] = useState([]); // Store fetched employee IDs

    const fetchEmployeeIds = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/get-emp-id-for-meeting');
            console.log(response.data); // Log the response to verify its structure
            if (response.data.success) {
                setEmployeeIds(response.data.data); // Set the employee data
                console.log("response.data.success", response.data.success)
            } else {
                console.error("Failed to fetch employee IDs:", response.data.msg);
            }
        } catch (error) {
            console.error("Error fetching employee IDs:", error);
        }
    };



    useEffect(() => {
        const fetchMeetings = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}meeting/get-meeting`);
                if (response.data.success) {
                    const formattedMeetings = response.data.data.map((meetingData) => ({
                        name: `${meetingData.title}`,
                        date: meetingData.scheduledDate,
                        s_time: `${meetingData.startTime}`,  // Add more meeting details if needed
                        e_time: `${meetingData.endTime}`,
                        location: `${meetingData.location}`,
                        meeting_to: `${meetingData.meetingTo.employee_first_name} ${meetingData.meetingTo.employee_last_name}`,
                        meeting_with: `${meetingData.meetingWith.employee_first_name} ${meetingData.meetingWith.employee_last_name}`,
                    }));
                    setMeetings(formattedMeetings);
                }
            } catch (error) {
                console.error('Error fetching birthdays:', error);
            }
        };

        fetchMeetings();
    }, []);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const meeting = meetings.find(
                (mtng) => {
                    const mtngDate = new Date(mtng.date);
                    return (
                        mtngDate.getFullYear() === date.getFullYear() &&
                        mtngDate.getMonth() === date.getMonth() &&
                        mtngDate.getDate() === date.getDate()
                    );
                }
            );
            if (meeting) {
                return (
                    <div className="birthday fa fa-users" onClick={() => handleMeetingClick(meeting)}>
                        {meeting.name}'s Meeing

                    </div>
                );
            }
        }
        return null;
    };

    const openMeetingPopup = () => {
        setShowCalendar(!showCalendar);
    };

    const closeMeetingModal = () => {
        setIsModalOpen(false);  // Close the modalclose
    };
    const handleMeetingClick = (meeting) => {
        setSelectedMeeting(meeting); // Set the clicked meeting data
        setIsModalOpen(true);    // Open the modal
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10;
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const openModal = (meetingId) => {
        console.log('meetingId', meetingId)
        setModalIsOpen(true);
        setSelectedMeetingId(meetingId);

    };
    const handleSort = async (column) => {
        console.log("Sort column clicked:", column);
        console.log("Current sort direction:", sortDirection);
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

            try {
                const response = await axios.get(`${BASE_API_URL}meeting/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
            const response = await axios.delete(`${BASE_API_URL}meeting/multi-delete`, {
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
        let validationErrors = {};
        if (!formData.title) validationErrors.title = 'Title is required.';
        if (!formData.scheduledDate) validationErrors.scheduledDate = 'Scheduled date is required.';
        if (!formData.startTime) validationErrors.startTime = 'Start time is required.';
        if (!formData.endTime) validationErrors.endTime = 'End time is required.';
        if (!formData.meetingTo) validationErrors.meetingTo = 'Meeting to is required.';
        if (!formData.meetingWith) validationErrors.meetingWith = 'Meeting with is required.';
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };
    
    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const [errors, setErrors] = useState({
        title: '',
        scheduledDate: '',
        startTime: '',
        endTime: '',
        endTime: '',
        meetingTo: '',
        meetingWith: '',
    });

    const [formData, setFormData] = useState({});

    const openPopup = () => {
        setMessage('');
        let formDataNew = {
            title: '',
            description: '',
            participants: [{ name: '', email: '', role: 'attendee' }],
            scheduledDate: '',
            startTime: '',
            endTime: '',
            location: '',
            status: '',
            meetingTo: '',
            meetingWith: ''
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
    // Function to handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);  // Check if formData is correct before submission
        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}meeting/create`, formData);
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
                const response = axios.delete(`${BASE_API_URL}meeting/delete?id=${id}`)
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
                const response = await axios.get(`${BASE_API_URL}meeting/search`, {
                    params: { search: searchValue }
                });
                console.log('Search Results:', response.data);
                settableData(response.data);
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            try {
                const response = await axios.get(`${BASE_API_URL}meeting/list`);
                console.log('Full List Data:', response.data.data);
                settableData(response.data.data);
            } catch (error) {
                console.error('Error fetching full list:', error);
            }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}meeting/list`);
                console.log(response.data.data); // Check if data is available
                settableData(response.data.data || []); // Default to an empty array if no data
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
    }, [togle]);


    const handleParticipantChange = (index, e) => {
        const { name, value } = e.target;
        const updatedParticipants = [...formData.participants];
        updatedParticipants[index][name] = value;
        setFormData((prevData) => ({
            ...prevData,
            participants: updatedParticipants
        }));
    };
    return (
        <>
            <div >
                <Nav />
                <div style={{ backgroundColor: '#28769a' }}>
                    <h1 className='headerData'>WELCOME TO Meeting PAGE</h1>
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
                                        </button></span>


                                        <div className="calendar-container">
                                            <button className="button_design" onClick={openMeetingPopup}>
                                                Meetings
                                            </button>
                                            {showCalendar && (
                                                <Calendar
                                                    onChange={setDate}
                                                    value={date}
                                                    tileContent={tileContent}
                                                    className="custom-calendar" // Custom CSS class
                                                />
                                            )}
                                            {/* Modal for displaying meeting details */}
                                            {isModalOpen && selectedMeeting && (
                                                <div className="modal-overlay" onClick={closeModal}>
                                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                        <h2 style={{ textAlign: 'center' }}>{selectedMeeting.name}'s Meeting</h2>
                                                        <p><strong>Date:</strong> {new Date(selectedMeeting.date).toDateString()}</p>
                                                        <p><strong>Location:</strong> {selectedMeeting.location}</p>
                                                        <p><strong>Start Time:</strong> {selectedMeeting.s_time}</p>
                                                        <p><strong>End Time:</strong> {selectedMeeting.e_time}</p>
                                                        <p><strong>Meeting To:</strong> {selectedMeeting.meeting_to}</p>
                                                        <p><strong>Meeting with:</strong> {selectedMeeting.meeting_with}</p>

                                                        <button className="close-modal-btn" onClick={closeMeetingModal}>Close</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Meetings Data</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Meeting Name</b></label>
                                                                            <input
                                                                                type="text"
                                                                                name="title"
                                                                                value={formData.title}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Meeting Name"
                                                                            />
                                                                            {errors.meetingName && <span className="error" style={{ color: 'red' }}>{errors.meetingName}</span>}
                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Description  </b></label>
                                                                            <input
                                                                                type="text"
                                                                                name="description"
                                                                                value={formData.description}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="description"
                                                                            />
                                                                        </div>

                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Scheduled Date*</b></label>
                                                                            <input
                                                                                type="date"
                                                                                name="scheduledDate"
                                                                                value={formData.scheduledDate}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Scheduled Date"
                                                                            />
                                                                            {errors.scheduledDate && <span className="error" style={{ color: 'red' }}>{errors.scheduledDate}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Start Time*</b></label>
                                                                            <input
                                                                                type="time"
                                                                                name="startTime"
                                                                                value={formData.startTime}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Start Time"
                                                                            />
                                                                            {errors.startTime && <span className="error" style={{ color: 'red' }}>{errors.startTime}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>End Time*</b></label>
                                                                            <input
                                                                                type="time"
                                                                                name="endTime"
                                                                                value={formData.endTime}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="End Time"
                                                                            />
                                                                            {errors.endTime && <span className="error" style={{ color: 'red' }}>{errors.endTime}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Meeting Location*</b></label>
                                                                            <input
                                                                                type="text"
                                                                                name="location"
                                                                                value={formData.location}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Location"
                                                                            />
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Status</b></label>
                                                                            <select
                                                                                name="status"
                                                                                value={formData.status}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                            >
                                                                                <option value="">Select Status</option>
                                                                                <option value="Scheduled">Scheduled</option>
                                                                                <option value="Completed">Completed</option>
                                                                                <option value="Cancelled">Cancelled</option>
                                                                            </select>
                                                                        </div>
 
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Meeting To*</b></label>
                                                                            <select
                                                                                name="meetingTo"
                                                                                value={formData.meetingTo}
                                                                                onChange={handleInputChange}
                                                                                onFocus={fetchEmployeeIds}  
                                                                                className="form-control"
                                                                                required
                                                                            >
                                                                                <option value="">Select an employee</option>
                                                                                {employeeIds.map(employee => (
                                                                                    <option key={employee._id} value={employee._id}>
                                                                                        {employee._id}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.meetingTo && (
                                                                                <span className="error" style={{ color: 'red' }}>
                                                                                    {errors.meetingTo}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Meeting With*</b></label>
                                                                            <select
                                                                                name="meetingWith"
                                                                                value={formData.meetingWith}
                                                                                onChange={handleInputChange}
                                                                                onFocus={fetchEmployeeIds}
                                                                                className="form-control"
                                                                                required
                                                                            >
                                                                                <option value="">Select an employee</option>
                                                                                {employeeIds.map(employee => (
                                                                                    <option key={employee._id} value={employee._id}>
                                                                                        {employee._id}
                                                                                    </option>
                                                                                ))}
                                                                            </select>
                                                                            {errors.meetingWith && (
                                                                                <span className="error" style={{ color: 'red' }}>
                                                                                    {errors.meetingWith}
                                                                                </span>
                                                                            )}
                                                                        </div>

                                                                        <div className="mb-3 col-md-12">
                                                                            <h4>Participants:</h4>
                                                                            {formData.participants.map((participant, index) => (
                                                                                <div key={index} className="mb-3">
                                                                                    <input
                                                                                        type="text"
                                                                                        name="name"
                                                                                        placeholder="Name"
                                                                                        value={participant.name}
                                                                                        onChange={(e) => handleParticipantChange(index, e)}
                                                                                        className="form-control"
                                                                                    />
                                                                                     <input
                                                                                        type="email"
                                                                                        name="email"
                                                                                        placeholder="Email"
                                                                                        value={participant.email}
                                                                                        onChange={(e) => handleParticipantChange(index, e)}
                                                                                        className="form-control"
                                                                                    />
                                                                                 </div>
                                                                            ))}
                                                                        </div>


                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Meetings</button>
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
                                                <th scope="col" onClick={() => handleSort('title')}>
                                                    <b>Name</b>
                                                    {sortColumn === 'title' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}
                                                </th>
                                                <th scope="col" onClick={() => handleSort('scheduledDate')}>
                                                    <b>scheduled Date</b>
                                                    {sortColumn === 'scheduledDate' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}
                                                </th>
                                                <th scope="col"><b>startTime</b></th>
                                                <th scope="col"><b>endTime</b></th>
                                                <th scope="col"><b>status</b></th>
                                                <th scope="col"><b>location</b></th>


                                                <th scope="col"><b>Actions</b></th>
                                                <th>
                                                    <label className="customcheckbox m-b-20">
                                                        <input type="checkbox" id="mainCheckbox" />
                                                    </label>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="customtable">
    {tableData && tableData.length > 0 ? (
        tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
            <tr key={index}>
                <td>{data.title}</td>
                <td>{data.scheduledDate}</td>
                <td>{data.startTime}</td>
                <td>{data.endTime}</td>

                {/* Conditional styling for status */}
                <td style={{
                    color: data.status === 'Completed' ? 'green' : data.status === 'Scheduled' ? 'orange' : data.status === 'Cancelled' ? 'red' : 'black'
                }}>
                    {data.status}
                </td>

                <td>{data.location}</td>

                <td>
                    <button className="editButton" onClick={() => DeleteData(data._id)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <button className="editButton" onClick={() => openModal(data._id)} title="Edit Data">
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
                <ModalBox isOpen={modalIsOpen} meetingId={selectedMeetingId} onRequestClose={closeModal}>
                    <h2>Modal Title</h2>
                    <p>Modal Content</p>
                </ModalBox>
            </tr>
        ))
    ) : (
        <tr>
            <td colSpan="8">No data available</td>
        </tr>
    )}
</tbody>

                                        {/* <tbody className="customtable">
                                            {tableData && tableData.length > 0 ? (
                                                tableData.slice(offset, offset + itemsPerPage).map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{data.title}</td>
                                                        <td>{data.scheduledDate}</td>
                                                        <td>{data.startTime}</td>
                                                        <td>{data.endTime}</td>
                                                        <td>{data.status}</td>

                                                        <td>{data.location}</td>

                                                        <td>
                                                            <button className="editButton" onClick={() => DeleteData(data._id)}>
                                                                <FontAwesomeIcon icon={faTrash} />
                                                            </button>
                                                            <button className="editButton" onClick={() => openModal(data._id)} title="Edit Data">
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
                                                        <ModalBox isOpen={modalIsOpen} meetingId={selectedMeetingId} onRequestClose={closeModal}>
                                                            <h2>Modal Title</h2>
                                                            <p>Modal Content</p>
                                                        </ModalBox>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="8">No data available</td>

                                                </tr>

                                            )}

                                        </tbody> */}

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

export default MeetingModule;





