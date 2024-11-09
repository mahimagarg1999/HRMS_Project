import React from 'react';
import "./Nav.css";
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const logout = () => {
    const isConfirmed = window.confirm('Are you sure you want to log out?');
    if (isConfirmed) {
      localStorage.clear();
      navigate('/login', { replace: true });
    }
  };

  if (!role) {
    // If no role is found in localStorage (not logged in), redirect to login
    navigate('/login', { replace: true });
    return null;  // Prevent rendering the navigation menu when not logged in
  }

  return (
    <div>
      {role === "user" ? (
        <div className="image-container">
          <nav className="limiter-menu-desktop overlay-text">
            <a className="logo">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBMT002DtdTkcxUC673enoeS9S3V8byaGkAgFH7dj1Sgh7rLuw01ydO33bM7aLVGdl_-g&usqp=CAU" alt="IMG-LOGO" />
            </a>
            <div className="menu-desktop">
              <ul className="main-menu">
                <li><Link to="/employee" className="nav-item">Employee</Link></li>
                <li><Link to="/candidate" className="nav-item">Candidate</Link></li>
                <li><Link to="/profile" className="nav-item">Profile</Link></li>
                <li><Link to="/birthday" className="nav-item">Birthday</Link></li>
                <li><Link to="/events" className="nav-item">Events</Link></li>
                <li><Link to="/meeting" className="nav-item">Meetings</Link></li>
                <li><Link to="/calender" className="nav-item">Calender</Link></li>
                <li><Link to="/codebank" className="nav-item">CodeBank</Link></li>
                <li><Link to="/recruitment" className="nav-item">Recruitment</Link></li>
                <li><Link to="/skills" className="nav-item">Skills</Link></li>
                <li><Link to="/helpcenter" className="nav-item">HelpCenter</Link></li>
                <li><Link to="/expenses" className="nav-item">Expenses</Link></li>
                <li><Link to="/consultancy" className="nav-item">Consultancy</Link></li>
                <li><Link to="/advanced-search" className="nav-item">Searching</Link></li>
                <li><Link to="/candidate_listing" className="nav-item">CandidateListing</Link></li>
                <li><Link to="/users" className="nav-item">Profile</Link></li>
                <li className="nav-item" onClick={logout}>Logout</li>
              </ul>
            </div>
          </nav>
        </div>
      ) : role === "employee" ? (
        <div className="image-container admin_image">
          <nav className="limiter-menu-desktop overlay-text">
            <a className="logo">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBMT002DtdTkcxUC673enoeS9S3V8byaGkAgFH7dj1Sgh7rLuw01ydO33bM7aLVGdl_-g&usqp=CAU" alt="IMG-LOGO" />
            </a>
            <div className="menu-desktop">
              <ul className="main-menu">
                <li><Link to="/admin" className="nav-item">Home</Link></li>
                <li><Link to="/changepassword" className="nav-item">Change password</Link></li>
                <li><Link to="/admincodebank" className="nav-item">A-Codebank</Link></li>
                <li><Link to="/edit-profile" className="nav-item">Edit Profile</Link></li>
                <li><Link to="/adminhelpcenter" className="nav-item">Old Help Center</Link></li>
                <li><Link to="/emphelpcenter" className="nav-item">Help Center</Link></li>
                <li><Link to="/admin-about" className="nav-item">About</Link></li>
                <li><Link to="/leave" className="nav-item">Leave</Link></li>
                <li className="nav-item" onClick={logout}>Logout</li>
              </ul>
            </div>
          </nav>
        </div>
      ) : (
        // Redirect to login if no valid role is found
        navigate('/login', { replace: true })
      )}
    </div>
  );
}

export default Nav;



// import React from 'react';
// import "./Nav.css";
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// const Nav = () => {
//   const navigate = useNavigate()
//   const logout = () => {
//     const isConfirmed = window.confirm('Are you sure you want to log out?');
//     if (isConfirmed) {
//       localStorage.clear();
//       navigate('/login');
//     }
//   };
//   return (
//     <div>
//       {localStorage.getItem("role") === "user" ? (<div class="image-container">

//         <nav class="limiter-menu-desktop overlay-text">

//           <a class="logo">
//             <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBMT002DtdTkcxUC673enoeS9S3V8byaGkAgFH7dj1Sgh7rLuw01ydO33bM7aLVGdl_-g&usqp=CAU" alt="IMG-LOGO" />
//           </a>
//           <div class="menu-desktop">
//             <ul class="main-menu">

//               <li  ><Link to="/employee" className="nav-item">Employee</Link></li>
//               <li  ><Link to="/candidate" className="nav-item">Candidate</Link></li>
//               <li ><Link to="/profile" className="nav-item">Profile</Link></li>
//               <li ><Link to="/birthday" className="nav-item">Birthday</Link></li>
//               <li ><Link to="/events" className="nav-item">Events</Link></li>
//               <li ><Link to="/meeting" className="nav-item">Meetings</Link></li>
//               <li ><Link to="/calender" className="nav-item">Calender</Link></li>

//               <li ><Link to="/codebank" className="nav-item">CodeBank</Link></li>

//               <li  ><Link to="/recruitment" className="nav-item">Recruitment</Link></li>
//               <li  ><Link to="/skills" className="nav-item">Skills</Link></li>
//               <li  ><Link to="/helpcenter" className="nav-item">HelpCenter</Link></li>
//               <li ><Link to="/expenses" className="nav-item">Expenses</Link></li>
//               <li ><Link to="/consultancy" className="nav-item">Consultancy</Link></li>
//               <li ><Link to="/advanced-search" className="nav-item">Searching</Link></li>
//               <li ><Link to="/candidate_listing" className="nav-item">CandidateListing</Link></li>


//               <li  ><Link to="/users" className="nav-item">Profile</Link></li>
//               <li className="nav-item" onClick={logout}> Logout </li>
//             </ul>
//           </div>
//           <div class="wrap-icon-header flex-w flex-r-m">
//             <div class="icon-header-item cl2 hov-cl1 trans-04 p-l-22 p-r-11 js-show-modal-search">
//               <i class="zmdi zmdi-search"></i>
//             </div>

//           </div>
//         </nav>
//       </div>) : (

//         <div class="image-container admin_image">

//           <nav class="limiter-menu-desktop overlay-text">

//             <a class="logo">
//               <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBMT002DtdTkcxUC673enoeS9S3V8byaGkAgFH7dj1Sgh7rLuw01ydO33bM7aLVGdl_-g&usqp=CAU" alt="IMG-LOGO" />
//             </a>
//             <div class="menu-desktop">
//               <ul class="main-menu">

//                 <li  ><Link to="/admin" className="nav-item">Home</Link></li>
//                 <li  ><Link to="/changepassword" className="nav-item">Change password</Link></li>
//                 <li  ><Link to="/admincodebank" className="nav-item">A-Codebank</Link></li>

//                 <li  ><Link to="/edit-profile" className="nav-item">Edit Profile</Link></li>
//                 <li  ><Link to="/adminhelpcenter" className="nav-item">Old Help Center</Link></li>
//                 <li  ><Link to="/emphelpcenter" className="nav-item">Help Center</Link></li>
//                 <li ><Link to="/admin-about" className="nav-item">About</Link></li>
//                 <li ><Link to="/leave" className="nav-item">Leave</Link></li>
//                 <li className="nav-item" onClick={logout}> Logout </li>

//               </ul>
//             </div>

//           </nav>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Nav;
