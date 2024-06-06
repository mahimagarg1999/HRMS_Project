// import logo from './logo.svg';
import './App.css';
import Login from './component/Login/LoginForm.js';
// import Nav from './component/navComponent/Nav.js';
import Home from './component/Home/home.js';
import SignUp from './component/signup/signup.js'
import Employee from './component/user/Employee/Employee.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Candidate from './component/user/Candidate/Candidate.js'
import Helpcenter from './component/user/HelpCenterModel/HelpCenter.js';
import Expenses from './component/user/ExpensesModel/Expenses.js'
import Consultancy from './component/user/ConsultancyModel/Consultancy.js'
import AdminHome from './component/Admin/AdminModule/AdminHome';
import ChangePassword from './component/Admin/ChangePasswordModule/ChangePassword';
import EditProfile from './component/Admin/EditProfileModule/EditProfile.js';
import UserModel from './component/user/UserModel/UserModel.js';
import UserHome from './component/user/UserHome/UserHome';
import Userdata from './component/Admin/UserDataModule/Userdata.js';
import AboutHome from './component/Admin/AboutModule/AboutModule.js';
import HelpCenterModoule from './component/Admin/AdminHelpCenterModule/AdminHelpCenter.js';

function App() {
  return (
    <Router>
      <Routes>
         <Route path="/*" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/users" element={<UserModel />} />
        <Route path="/user" element={<UserHome />} />
        <Route path="/admin-user" element={<Userdata />} />


        {/* <Route path="/uhome" element={<UserHome />} /> */}
        {/* <Route path="/img_p" element={<IMgProduct />} /> */}
        {/* <Route path="/*" element={<Nav />} /> */}
        <Route path="/home" element={<Home />} />
        <Route path="/candidate" element={<Candidate />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/helpcenter" element={<Helpcenter />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/consultancy" element={<Consultancy />} />
        <Route path="/changepassword" element={<ChangePassword />} />
        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/admin-about" element={<AboutHome />} />
        <Route path="/adminhelpcenter" element={<HelpCenterModoule />} />


      </Routes>
    </Router>
  );
}

export default App;
