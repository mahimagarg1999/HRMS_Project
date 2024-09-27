import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the calendar styles
import axios from 'axios'; // For making API requests
import Nav from '../../navComponent/Nav';
import Footer from '../../FooterModule/Footer.js';

import './Birthday.css'
const BirthdayCalendar = () => {
  
  const [date, setDate] = useState(new Date());
  const [birthdays, setBirthdays] = useState([]);

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
        return <p className="birthday">{birthday.name}'s Birthday</p>;
      }
    }
    return null;
  };

  return (
    <div>
      <Nav />
       <div style={{ backgroundColor: '#28769a', textAlign: 'center' }}>
                    <h1 className='headerUser'>BIRTHDAY CALENDER</h1>
                </div>+
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh', width: '100%' }}>
                <Calendar
        onChange={setDate}
        value={date}
        tileContent={tileContent} 
        style={{ width: '100%' }}// Add birthday info on the calendar
      />
      </div>
       <Footer />
    </div>
  );
};

export default BirthdayCalendar;

 







// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import Nav from '../../navComponent/Nav';
// import Footer from '../../FooterModule/Footer.js';

// const BirthdayEvent = () => {
//   const [employees, setEmployees] = useState([]);
//   const [message, setMessage] = useState("");
//   const [hasBirthday, setHasBirthday] = useState(false); // New state to track if any birthday exists
//   // Fetch employee data from API
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/employee/list"); // Adjust the URL if needed
//         setEmployees(response.data.data); // Set employees data from API response
//       } catch (err) {
//         console.error("Error fetching employee data", err);
//       }
//     };
//     fetchData();
//   }, []);
//   // Function to check if today is anyone's birthday and this month
//   const checkBirthdays = () => {
//     const today = new Date();
//     const todayBirthdays = [];
//     const monthBirthdays = [];

//     employees.forEach((employee) => {
//       const employeeDob = new Date(employee.employee_dob);
//       // Check for today's birthday
//       if (
//         employeeDob.getDate() === today.getDate() &&
//         employeeDob.getMonth() === today.getMonth()
//       ) {
//         todayBirthdays.push(
//           `${employee.employee_first_name} ${employee.employee_last_name}`
//         );
//       }
//       // Check for birthdays in the current month
//       if (employeeDob.getMonth() === today.getMonth()) {
//         monthBirthdays.push(
//           `${employee.employee_first_name} ${employee.employee_last_name}`
//         );
//       }
//     });

//     // Set message and background based on birthday check
//     if (todayBirthdays.length > 0) {
//       setMessage(
//         `🎉 Happy Birthday to ${todayBirthdays.join(", ")}! 🎂`
//       );
//       setHasBirthday(true); // Set hasBirthday to true if there are birthdays today
//     } else if (monthBirthdays.length > 0) {
//       setMessage(
//         `It's not anyone's birthday today. This month's birthday(s): ${monthBirthdays.join(
//           ", "
//         )}.`
//       );
//       setHasBirthday(false); // Reset background if it's only for month birthdays
//     } else {
//       setMessage("It's not anyone's birthday today, and no one has a birthday this month.");
//       setHasBirthday(false); // No birthday, so reset background
//     }
//   };

//   return (
//     <>
//       <div>
//         <Nav />
//         <div style={{ backgroundColor: '#28769a' }}>
//           <h1 className='headerUser'>BIRTHDAY PAGE</h1>
//         </div>
//         <div
//           style={{
//             padding: "20px",
//             backgroundColor: hasBirthday ? "lightpink" : "white",  textAlign: 'center' // Change background to light pink if there is a birthday
//           }}
//         >
//           <h2>Employee Birthday Checker</h2>
//           <button onClick={checkBirthdays}>Check Today's Birthdays</button>
//           <br />
//           <div style={{background:"lightblue"}}> {message && <h4 ><b>{message}</b></h4>}</div>
 
          
//         </div>
//       </div>
//       <Footer />
//     </>
//   );
// };

// export default BirthdayEvent;






 