// // import logo from './logo.svg';
// import './App.css';
// import Login from './component/Login/LoginForm.js';
// // import Nav from './component/navComponent/Nav.js';
// import Home from './component/Home/home.js';
// import SignUp from './component/signup/signup.js'
// import Employee from './component/user/Employee/Employee.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Route, Routes,Navigate } from 'react-router-dom';
// import Candidate from './component/user/Candidate/Candidate.js'
// import Helpcenter from './component/user/HelpCenterModel/HelpCenter.js';
// import Expenses from './component/user/ExpensesModel/Expenses.js'
// import Consultancy from './component/user/ConsultancyModel/Consultancy.js'
// import AdminHome from './component/Admin/AdminModule/AdminHome';
// import ChangePassword from './component/Admin/ChangePasswordModule/ChangePassword';
// import EditProfile from './component/Admin/EditProfileModule/EditProfile.js';
// import UserModel from './component/user/UserModel/UserModel.js';
// import UserHome from './component/user/UserHome/UserHome';
// import Userdata from './component/Admin/UserDataModule/Userdata.js';
// import AboutHome from './component/Admin/AboutModule/AboutModule.js';
// import HelpCenterModoule from './component/Admin/AdminHelpCenterModule/AdminHelpCenter.js';

// function App() {
//   const PrivateRoute = ({  element, path }) => {
//     const isLoggedIn=false;
//     // Check if localStorage has the necessary data
//     if(localStorage.length === 0)
//       {
//          isLoggedIn = false
//       console.log('isLoggedIn', isLoggedIn);  
//       }
//       else
//       {
//          isLoggedIn = true
//       console.log('isLoggedIn', isLoggedIn);  
//       }
//       const ele = isLoggedIn === true ? element : <Navigate to="/login"  />;

//       return <Route path={path} element={ele} />;


//     // return isLoggedIn ? children : <Navigate to="/login" />;
//   };
//   if(localStorage.length === 0)
//     {
//       const isLoggedIn = !false
//     console.log('isLoggedIn', isLoggedIn);  
//     }
//     else
//     {
//       const isLoggedIn = !true
//     console.log('isLoggedIn', isLoggedIn);  
//     }
 
//   return (
//     <Router>
//       <Routes>
//          <Route path="/*" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/admin" element={<AdminHome />} />
//         <Route path="/users" element={<UserModel />} />
//         <Route path="/user" element={<UserHome />} />
//         <Route path="/admin-user" element={<Userdata />} />

//         {/ <Route path="/uhome" element={<UserHome />} /> /}
//         {/ <Route path="/img_p" element={<IMgProduct />} /> /}
//         {/ <Route path="/*" element={<Nav />} /> /}
//         <Route path="/home" element={<Home />} />
//         <Route path="/candidate" element={<Candidate />} />
//         <Route path="/employee" element={<Employee />} />
//         <Route path="/helpcenter" element={<Helpcenter />} />
//         <Route path="/expenses" element={<Expenses />} />
//         <Route path="/consultancy" element={<Consultancy />} />
//         <Route path="/changepassword" element={<ChangePassword />} />
//         <Route path="/edit-profile" element={<EditProfile />} />

//         <Route path="/admin-about" element={<AboutHome />} />
//         {/ <Route path="/adminhelpcenter" element={<HelpCenterModoule />} /> /}
//         <PrivateRoute exact path="adminhelpcenter" element={<HelpCenterModoule/>}/>

//       </Routes>
//     </Router>
//   );
// }

// export default App;

import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './component/Login/LoginForm.js';
import Home from './component/Home/home.js';
import SignUp from './component/signup/signup.js';
import Employee from './component/user/Employee/Employee.js';
import Candidate from './component/user/Candidate/Candidate.js';
import Helpcenter from './component/user/HelpCenterModel/HelpCenter.js';
import Expenses from './component/user/ExpensesModel/Expenses.js';
import Consultancy from './component/user/ConsultancyModel/Consultancy.js';
import AdminHome from './component/Admin/AdminModule/AdminHome';
import ChangePassword from './component/Admin/ChangePasswordModule/ChangePassword';
import EditProfile from './component/Admin/EditProfileModule/EditProfile.js';
import UserModel from './component/user/UserModel/UserModel.js';
import UserHome from './component/user/UserHome/UserHome';
import Userdata from './component/Admin/UserDataModule/Userdata.js';
import AboutHome from './component/Admin/AboutModule/AboutModule.js';
import HelpCenterModoule from './component/Admin/AdminHelpCenterModule/AdminHelpCenter.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecruitmentModule from './component/user/Recruitment/Recruitment.js';
import ModalComponent from './component/user/Recruitment/ModelComponent.js';
import SkillsModule from './component/user/Skills/Skills.js';
import SearchModule from './component/user/Search/SearchModel.js';
import CandidateByApiModule from './component/user/CandidateByApi/CandidateByApi.js';
import CandidateDataModal from './component/user/Candidate/CandidateDataModal.js';
import CandidateByDataModalComponent from './component/user/CandidateByApi/CandidateByDataModal.js';
import EmployeeDataModal from './component/user/Employee/EmployeeDataModal.js';
 const PrivateRoute = ({ element }) => {
  const isLoggedIn = localStorage.length > 0;
  return isLoggedIn ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<PrivateRoute element={<AdminHome />} />} />
        <Route path="/users" element={<PrivateRoute element={<UserModel />} />} />
        <Route path="/user" element={<PrivateRoute element={<UserHome />} />} />
        <Route path="/admin-user" element={<PrivateRoute element={<Userdata />} />} />
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/candidate" element={<PrivateRoute element={<Candidate />} />} />
        <Route path="/employee" element={<PrivateRoute element={<Employee />} />} />
        <Route path="/helpcenter" element={<PrivateRoute element={<Helpcenter />} />} />
        <Route path="/expenses" element={<PrivateRoute element={<Expenses />} />} />
        <Route path="/consultancy" element={<PrivateRoute element={<Consultancy />} />} />
        <Route path="/changepassword" element={<PrivateRoute element={<ChangePassword />} />} />
        <Route path="/edit-profile" element={<PrivateRoute element={<EditProfile />} />} />
        <Route path="/admin-about" element={<PrivateRoute element={<AboutHome />} />} />
        <Route path="/adminhelpcenter" element={<PrivateRoute element={<HelpCenterModoule />} />} />
        <Route path="/recruitment" element={<RecruitmentModule />} />
        <Route path="/view-recruitment" element={<ModalComponent />} />
        <Route path="/skills" element={<SkillsModule />} />
        <Route path="/advanced-search" element={<SearchModule />} />
        <Route path="/candidate_listing" element={<CandidateByApiModule />} />
        <Route path="/candidate_data" element={<CandidateDataModal />} />
        <Route path="/can_trd_party_data/:id" element={<CandidateByDataModalComponent />} />
        <Route path="/employee_data" element={<EmployeeDataModal />} />



      </Routes>
    </Router>
  );
}

export default App;
















// // import logo from './logo.svg';
// import './App.css';
// import Login from './component/Login/LoginForm.js';
// // import Nav from './component/navComponent/Nav.js';
// import Home from './component/Home/home.js';
// import SignUp from './component/signup/signup.js'
// import Employee from './component/user/Employee/Employee.js';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import Candidate from './component/user/Candidate/Candidate.js'
// import Helpcenter from './component/user/HelpCenterModel/HelpCenter.js';
// import Expenses from './component/user/ExpensesModel/Expenses.js'
// import Consultancy from './component/user/ConsultancyModel/Consultancy.js'
// import AdminHome from './component/Admin/AdminModule/AdminHome';
// import ChangePassword from './component/Admin/ChangePasswordModule/ChangePassword';
// import EditProfile from './component/Admin/EditProfileModule/EditProfile.js';
// import UserModel from './component/user/UserModel/UserModel.js';
// import UserHome from './component/user/UserHome/UserHome';
// import Userdata from './component/Admin/UserDataModule/Userdata.js';
// import AboutHome from './component/Admin/AboutModule/AboutModule.js';
// import HelpCenterModoule from './component/Admin/AdminHelpCenterModule/AdminHelpCenter.js';
// import RecruitmentModule from './component/user/Recruitment/Recruitment.js';

// function App() {
//   return (
//     <Router>
//       <Routes>
//         <Route path="/*" element={<Login />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<SignUp />} />
//         <Route path="/admin" element={<AdminHome />} />
//         <Route path="/users" element={<UserModel />} />
//         <Route path="/user" element={<UserHome />} />
//         <Route path="/admin-user" element={<Userdata />} />


//         {/* <Route path="/uhome" element={<UserHome />} /> */}
//         {/* <Route path="/img_p" element={<IMgProduct />} /> */}
//         {/* <Route path="/*" element={<Nav />} /> */}
//         <Route path="/home" element={<Home />} />
//         <Route path="/candidate" element={<Candidate />} />
//         <Route path="/employee" element={<Employee />} />
//         <Route path="/helpcenter" element={<Helpcenter />} />
//         <Route path="/expenses" element={<Expenses />} />
//         <Route path="/consultancy" element={<Consultancy />} />
//         <Route path="/changepassword" element={<ChangePassword />} />
//         <Route path="/edit-profile" element={<EditProfile />} />

//         <Route path="/admin-about" element={<AboutHome />} />
//         <Route path="/adminhelpcenter" element={<HelpCenterModoule />} />
//         <Route path="/recruitment" element={<RecruitmentModule />} />

//       </Routes>
//     </Router>
//   );
// }

// export default App;
