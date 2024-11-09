import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './EditEvent.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactPaginate from 'react-paginate';
import { faEdit, faTrashAlt, faTrash, faSortUp, faSortDown, faPlusCircle, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CustomCalendar.css';

// import lib
const EventModule = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [tableData, settableData] = useState([])
    const [togle, settogle] = useState([true])
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEventsId, setSelectedEventsId] = useState(null);
    const [message, setMessage] = useState('');
    const [currentPage, setCurrentPage] = useState(0);
    const [ids, setIds] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [query, setQuery] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('ascending');
    const [date, setDate] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [showCalendar, setShowCalendar] = useState(false); // State to show/hide calendar
    const [selectedEvent, setSelectedEvent] = useState(null); // To store the clicked event
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/events/get-event');
                if (response.data.success) {
                    const formattedEvents = response.data.data.map((eventData) => ({
                        name: `${eventData.eventName}`,
                        date: eventData.eventDate,
                        // description: eventData.eventDescription,  // Add more event details if needed
                        // location: eventData.eventLocation,
                        description: `${eventData.eventDescription}`,  // Add more event details if needed
                        location: `${eventData.eventLocation}`,
                    }));
                    setEvents(formattedEvents);
                }
            } catch (error) {
                console.error('Error fetching birthdays:', error);
            }
        };

        fetchEvents();
    }, []);

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const event = events.find(
                (evt) => {
                    const evtDate = new Date(evt.date);
                    return (
                        evtDate.getFullYear() === date.getFullYear() &&
                        evtDate.getMonth() === date.getMonth() &&
                        evtDate.getDate() === date.getDate()
                    );
                }
            );
            if (event) {
                return (
                    <div className="birthday fa fa-calendar-check-o" onClick={() => handleEventClick(event)}>
                        {event.name}'s Event
                        {/* {event.description}'s Event */}
                        {/* {event.location}'s Event */}
                    </div>
                );
            }
        }
        return null;
    };

    const openEventPopup = () => {
        setShowCalendar(!showCalendar);
    };

    const closeEventModal = () => {
        setIsModalOpen(false);  // Close the modalclose
    };
    const handleEventClick = (event) => {
        setSelectedEvent(event); // Set the clicked event data
        setIsModalOpen(true);    // Open the modal
    };

    const handlePageChange = ({ selected }) => {
        setCurrentPage(selected); // Update the current page when pagination changes
    };

    const itemsPerPage = 10; // Number of items to display per page
    const offset = currentPage * itemsPerPage;
    const pageCount = Math.ceil(tableData.length / itemsPerPage);

    const openModal = (eventId) => {
        console.log('eventId', eventId)
        setModalIsOpen(true);
        setSelectedEventsId(eventId);

    };
    const handleSort = async (column) => {
        console.log("Sort column clicked:", column);
        console.log("Current sort direction:", sortDirection);
        if (column === sortColumn) {
            // If the same column is clicked again, reverse the sorting direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');

            try {
                const response = await axios.get(`${BASE_API_URL}events/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
            const response = await axios.delete(`${BASE_API_URL}events/multi-delete`, {
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
        if (!formData.eventName) validationErrors.eventName = 'Event name is required.';
        if (!formData.eventDate) validationErrors.eventDate = 'Event date is required.';
        if (!formData.eventTime) validationErrors.eventTime = 'Event time is required.';
        if (!formData.eventLocation) validationErrors.eventLocation = 'Event location is required.';

        formData.participants.forEach((participant, index) => {
            if (!participant.name) validationErrors[`name${index}`] = 'Name is required.';
            if (!participant.email) validationErrors[`email${index}`] = 'Email is required.';
            else if (!/\S+@\S+\.\S+/.test(participant.email)) validationErrors[`email${index}`] = 'Email is invalid.';
        });

        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const closeModal = () => {
        settogle(!togle)
        setModalIsOpen(false);
    };
    const [errors, setErrors] = useState({
        eventName: '',
        eventDate: '',
        eventTime: '',
        eventLocation: '',
        participants: [{ name: '', email: '', role: 'attendee' }]
    });

    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${BASE_API_URL}events/list`);
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
            eventName: '',
            eventDate: '',
            eventTime: '',
            eventDescription: '',
            eventLocation: '',
            participants: [{ name: '', email: '', role: 'attendee' }],
            status: ""
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
        console.log('Form Data:', formData);

        if (validateForm()) {
            try {
                const response = await axios.post(`${BASE_API_URL}events/create`, formData);
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
                const response = axios.delete(`${BASE_API_URL}events/delete?id=${id}`)
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
                const response = await axios.get(`${BASE_API_URL}events/search`, {
                    params: { search: searchValue }
                });
                console.log('Search Results:', response.data);
                settableData(response.data);
            } catch (error) {
                console.error('Error during search:', error);
            }
        } else {
            try {
                const response = await axios.get(`${BASE_API_URL}events/list`);
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

                const response = await axios.get(`${BASE_API_URL}events/list`);
                console.log(response.data.data); // Handle the response as needed
                settableData(response.data.data)
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
                    <h1 className='headerData'>WELCOME TO Events PAGE</h1>
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
                                        <span>
                                            <button className="button_design" onClick={openEventPopup}>
                                                Events&nbsp;<FontAwesomeIcon icon={faCalendarAlt} />
                                            </button>
                                        </span>

                                        <div className="calendar-container">
                                            <button className="button_design" onClick={openEventPopup}>
                                                Events
                                            </button>
                                            {showCalendar && (
                                                <Calendar
                                                    onChange={setDate}
                                                    value={date}
                                                    tileContent={tileContent}
                                                    className="custom-calendar" // Custom CSS class
                                                />
                                            )}

                                            {/* Modal for displaying event details */}
                                            {isModalOpen && selectedEvent && (
                                                <div className="modal-overlay" onClick={closeModal}>
                                                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                                        <h2 style={{ textAlign: 'center' }}>{selectedEvent.name}'s Event</h2>
                                                        <p><strong>Date:</strong> {new Date(selectedEvent.date).toDateString()}</p>
                                                        <p><strong>Description:</strong> {selectedEvent.description}</p>
                                                        <p><strong>Location:</strong> {selectedEvent.location}</p>
                                                        <button className="close-modal-btn" onClick={closeEventModal}>Close</button>
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
                                                                        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Events Data</h4>
                                                                        <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Event Name</b></label>
                                                                            <input
                                                                                type="text"
                                                                                name="eventName"
                                                                                value={formData.eventName}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Event Name"
                                                                            />
                                                                            {errors.eventName && <span className="error" style={{ color: 'red' }}>{errors.eventName}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Event Date*</b></label>
                                                                            <input
                                                                                type="date"
                                                                                name="eventDate"
                                                                                value={formData.eventDate}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Event Date"
                                                                            />
                                                                            {errors.eventDate && <span className="error" style={{ color: 'red' }}>{errors.eventDate}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Event Time*</b></label>
                                                                            <input
                                                                                type="time"
                                                                                name="eventTime"
                                                                                value={formData.eventTime}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Event Time"
                                                                            />
                                                                            {errors.eventTime && <span className="error" style={{ color: 'red' }}>{errors.eventTime}</span>}
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
                                                                                <option value="scheduled">scheduled</option>
                                                                                <option value="completed">completed</option>
                                                                                <option value="cancelled">cancelled</option>
                                                                            </select>
                                                                        </div>
                                                                        <div className="mb-3 col-md-6">
                                                                            <label><b>Event Location*</b></label>
                                                                            <input
                                                                                type="text"
                                                                                name="eventLocation"
                                                                                value={formData.eventLocation}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Event Location"
                                                                            />
                                                                            {errors.eventLocation && <span className="error" style={{ color: 'red' }}>{errors.eventLocation}</span>}
                                                                        </div>
                                                                        <div className="mb-3 col-md-12">
                                                                            <label><b>Event Description</b></label>
                                                                            <textarea
                                                                                name="eventDescription"
                                                                                value={formData.eventDescription}
                                                                                onChange={handleInputChange}
                                                                                className="form-control"
                                                                                placeholder="Event Description"
                                                                            />
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
                                                                                    {errors[`name${index}`] && <span className="error" style={{ color: 'red' }}>{errors[`name${index}`]}</span>}
                                                                                    <input
                                                                                        type="email"
                                                                                        name="email"
                                                                                        placeholder="Email"
                                                                                        value={participant.email}
                                                                                        onChange={(e) => handleParticipantChange(index, e)}
                                                                                        className="form-control"
                                                                                    />
                                                                                    {errors[`email${index}`] && <span className="error" style={{ color: 'red' }}>{errors[`email${index}`]}</span>}
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    <div class="col-md-12">
                                                                        <button type="submit">Add Events</button>
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
                                                <th scope="col" onClick={() => handleSort('eventName')}>
                                                    <b>Name</b>
                                                    {sortColumn === 'eventName' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}
                                                </th>
                                                <th scope="col" onClick={() => handleSort('eventDate')}>
                                                    <b>Event Date</b>
                                                    {sortColumn === 'eventDate' && (
                                                        <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} />
                                                    )}
                                                </th>
                                                <th scope="col"><b>Event Time</b></th>
                                                <th scope="col"><b>Description</b></th>
                                                <th scope="col"><b>Location</b></th>
                                                <th scope="col"><b>Status</b></th>

                                                {/* <th scope="col"><b>Participants Name</b></th>
                                                <th scope="col"><b>Participants Role</b></th>
                                                <th scope="col"><b>Participants Email</b></th> */}
                                                <th scope="col"><b>Actions</b></th>
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
                                                    <td>{data.eventName}</td>
                                                    <td>{new Date(data.eventDate).toISOString().split('T')[0]}</td>
                                                    <td>{data.eventTime}</td>
                                                    <td>{data.eventDescription}</td>
                                                    <td>{data.eventLocation}</td>
                                                    <td style={{
                                                        color: data.status === 'completed' ? 'green' : data.status === 'scheduled' ? 'orange' : data.status === 'cancelled' ? 'red' : 'black'
                                                    }}>
                                                        {data.status}
                                                    </td>

                                                    {/* <td>
                                                         {data.participants.map((participant, i) => (
                                                            <div key={i}>
                                                                <p>{participant.name}  </p>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                         {data.participants.map((participant, i) => (
                                                            <div key={i}>
                                                                <p>  ({participant.role})  </p>
                                                            </div>
                                                        ))}
                                                    </td>
                                                    <td>
                                                         {data.participants.map((participant, i) => (
                                                            <div key={i}>
                                                                <p> {participant.email}</p>
                                                            </div>
                                                        ))}
                                                    </td> */}
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
                                                </tr>
                                            ))}
                                            {/* Modal for editing events */}
                                            <ModalBox isOpen={modalIsOpen} eventId={selectedEventsId} onRequestClose={closeModal}>
                                                <h2>Modal Title</h2>
                                                <p>Modal Content</p>
                                            </ModalBox>
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

export default EventModule;





