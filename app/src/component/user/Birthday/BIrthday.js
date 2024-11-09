import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles
import axios from 'axios'; // For making API requests
import Nav from '../../navComponent/Nav';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';

import './Birthday.css'
const BirthdayCalendar = () => {

  const [date, setDate] = useState(new Date());
  const [birthdays, setBirthdays] = useState([]);
  const [tableData, settableData] = useState([])
  const [query, setQuery] = useState('');
  const [togle, settogle] = useState([true])
  const [selectedBirthday, setSelectedBirthday] = useState(null); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch birthdays from the API
  useEffect(() => {
    const fetchBirthdays = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/employee/get-dob');
        if (response.data.success) {
          const formattedBirthdays = response.data.data.map((employee) => ({
            name: `${employee.employee_first_name}`,
            date: employee.employee_dob,
          }));
          setBirthdays(formattedBirthdays);
        }
      } catch (error) {
        console.error('Error fetching birthdays:', error);
      }
    };

    fetchBirthdays();
  }, []);

  // Function to check if a date has a birthday
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const birthday = birthdays.find(
        (bday) => {
          const bdayDate = new Date(bday.date);
          // Compare only month and day, ignore the year
          return (
            bdayDate.getMonth() === date.getMonth() &&
            bdayDate.getDate() === date.getDate()
          );
        }
      );
      if (birthday) {
        return <div className="birthday fa fa-birthday-cake"> {birthday.name}'s Birthday</div>;
      }
    }
    return null;
  };
  const handleChange = async (event) => {
    setQuery(event.target.value);
    console.log(event.target.value)
    if (event.target.value !== '') {
      try {
        const response = await axios.get(`${BASE_API_URL}employee/search?search=${event.target.value}`, {
        });
        console.log(query)
        settableData(response.data)
      } catch (error) {
        console.error('Error:', error);
      } 
    }
    else {
      try {
        const response = await axios.get(`${BASE_API_URL}employee/list`);
        console.log(response.data.data); // Handle the response as needed
        settableData(response.data.data)
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };
  const closeEventModal = () => {
    setIsModalOpen(false);  // Close the modalclose
};

  return (
    <div>
      <Nav />
      <div style={{ backgroundColor: '#28769a', textAlign: 'center' }}>
        <h1 className='headerUser'>BIRTHDAY CALENDER</h1>
      </div>
      <div className="calendar-container">

        <Calendar
          onChange={setDate}
          value={date}
          tileContent={tileContent}
          className="custom-calendar" // Custom CSS class
        />
        {isModalOpen && selectedBirthday && (
          <div className="modal-overlay" onClick={closeEventModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2 style={{ textAlign: 'center' }}>{selectedBirthday.name}'s Event</h2>
              <p><strong>Date:</strong> {new Date(selectedBirthday.date).toDateString()}</p>
              <p><strong>Description:</strong> {selectedBirthday.description}</p>
              <p><strong>Location:</strong> {selectedBirthday.location}</p>
              <button className="close-modal-btn" onClick={closeEventModal}>Close</button>
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
};

export default BirthdayCalendar;

