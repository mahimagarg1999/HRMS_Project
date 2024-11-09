import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';
import Nav from '../../navComponent/Nav';
import Footer from '../../FooterModule/Footer.js';
import './calender.css';
import 'font-awesome/css/font-awesome.min.css';


const BASE_API_URL = "http://localhost:5000/api/events/calendar/get-all";

const CalendarModule = () => {
  const [date, setDate] = useState(new Date());
  const [birthdays, setBirthdays] = useState([]);
  const [events, setEvents] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('all'); // state for dropdown selection

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(BASE_API_URL);
        const { events, meetings, birthdays } = response.data;

        setEvents(events || []);
        setMeetings(meetings || []);
        setBirthdays(
          (birthdays || []).map((birthday) => ({
            name: birthday.name,
            date: birthday.date,
          }))
        );
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const birthday = birthdays.find((bday) => {
        const bdayDate = new Date(bday.date);
        return bdayDate.getMonth() === date.getMonth() && bdayDate.getDate() === date.getDate();
      });
  
      const event = events.find((event) => {
        const eventDate = new Date(event.eventDate);
        return eventDate.getMonth() === date.getMonth() && eventDate.getDate() === date.getDate();
      });
  
      const meeting = meetings.find((meeting) => {
        const meetingDate = new Date(meeting.scheduledDate);
        return meetingDate.getMonth() === date.getMonth() && meetingDate.getDate() === date.getDate();
      });
  
      // Show content based on filterType
      if (filterType === 'all') {
        return (
          <div className="tile-content">
            {birthday && <p className="birthday"><i className="fa fa-birthday-cake"></i> {birthday.name}'s Birthday</p>}
            {event && <p className="event"><i className="fa fa-calendar-check-o"></i> {event.eventName} (Event)</p>}
            {meeting && <p className="meeting"><i className="fa fa-users"></i> {meeting.title} (Meeting)</p>}
          </div>
        );
      } else if (filterType === 'event' && event) {
        return <div className="tile-content"><p className="event"><i className="fa fa-calendar-check-o"></i> {event.eventName} (Event)</p></div>;
      } else if (filterType === 'meeting' && meeting) {
        return <div className="tile-content"><p className="meeting"><i className="fa fa-users"></i> {meeting.title} (Meeting)</p></div>;
      } else if (filterType === 'birthday' && birthday) {
        return <div className="tile-content"><p className="birthday"><i className="fa fa-birthday-cake"></i> {birthday.name}'s Birthday</p></div>;
      }
    }
    return null;
  };
  

  const handleTileClick = (clickedDate) => {
    const birthday = birthdays.find((bday) => {
      const bdayDate = new Date(bday.date);
      return bdayDate.getMonth() === clickedDate.getMonth() && bdayDate.getDate() === clickedDate.getDate();
    });

    const event = events.find((event) => {
      const eventDate = new Date(event.eventDate);
      return eventDate.getMonth() === clickedDate.getMonth() && eventDate.getDate() === clickedDate.getDate();
    });

    const meeting = meetings.find((meeting) => {
      const meetingDate = new Date(meeting.scheduledDate);
      return meetingDate.getMonth() === clickedDate.getMonth() && meetingDate.getDate() === clickedDate.getDate();
    });

    if (
      (filterType === 'all' && (birthday || event || meeting)) ||
      (filterType === 'event' && event) ||
      (filterType === 'meeting' && meeting) ||
      (filterType === 'birthday' && birthday)
    ) {
      setSelectedItem({ birthday, event, meeting });
      setIsModalOpen(true);
    }
  };

  const handleFilterChange = (e) => {
    setFilterType(e.target.value);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  const filteredData = () => {
    if (filterType === 'event') {
      return selectedItem && selectedItem.event;
    }
    if (filterType === 'meeting') {
      return selectedItem && selectedItem.meeting;
    }
    if (filterType === 'birthday') {
      return selectedItem && selectedItem.birthday;
    }
    return selectedItem;
  };

  return (
    <div>
      <Nav />
      <div style={{ backgroundColor: '#28769a', textAlign: 'center' }}>
        <h1 className="headerUser">BIRTHDAY CALENDAR</h1>
      </div>
      <div className="calendar-container">
        <div className="dropdown-container">
          <select onChange={handleFilterChange} value={filterType}>
            <option value="all">All</option>
            <option value="event">Event</option>
            <option value="meeting">Meeting</option>
            <option value="birthday">Birthday</option>
          </select>
        </div>
        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          onClickDay={handleTileClick}
          className="custom-calendar"
        />
        {isModalOpen && selectedItem && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              {filteredData() && (
                <>
                  {filterType !== 'all' && (
                    <h2 style={{ textAlign: 'center' }}>
                      {filterType === 'event' ? filteredData().eventName : filterType === 'meeting' ? filteredData().title : filteredData().name} Details
                    </h2>
                  )}
                  {filterType === 'event' && (
                    <>
                      <p><strong>Event Name:</strong> {filteredData().eventName}</p>
                      <p><strong>Description:</strong> {filteredData().eventDescription}</p>
                      <p><strong>Date:</strong> {new Date(filteredData().eventDate).toDateString()}</p>
                      <p><strong>Location:</strong> {filteredData().location}</p>
                    </>
                  )}
                  {filterType === 'meeting' && (
                    <>
                      <p><strong>Meeting Title:</strong> {filteredData().title}</p>
                      <p><strong>Meeting Description:</strong> {filteredData().meetingDescription}</p>
                      <p><strong>Scheduled Date:</strong> {new Date(filteredData().scheduledDate).toDateString()}</p>
                      <p><strong>Location:</strong> {filteredData().meetingLocation}</p>
                    </>
                  )}
                  {filterType === 'birthday' && (
                    <>
                      <p><strong>Birthday Name:</strong> {filteredData().name}</p>
                      <p><strong>Birthday Date:</strong> {new Date(filteredData().date).toDateString()}</p>
                    </>
                  )}
                  <button className="close-modal-btn" onClick={closeModal}>Close</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default CalendarModule;


 