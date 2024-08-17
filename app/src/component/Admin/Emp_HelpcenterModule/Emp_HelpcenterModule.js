// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import Modal from 'react-modal';
// import { BASE_API_URL } from '../../../lib/constants.jsx';

// // Ensure Modal is attached to the root element
// Modal.setAppElement('#root');

// const EmpHelpCenterModule = () => {
//   const [modalIsOpen, setModalIsOpen] = useState(false);
//   const [modalContent, setModalContent] = useState(null);

//   useEffect(() => {
//     const fetchDataById = async () => {
//       const userId = localStorage.getItem('_id'); // Get user ID from local storage
//       if (!userId) {
//         console.error('User ID is not available');
//         return;
//       }
//       try {
//         const response = await axios.get(`${BASE_API_URL}helpcenter/get?helpcenterid=${userId}`);
//         console.log('API response:', response.data); // Log the entire response
//         if (response.data.success) {
//           if (Array.isArray(response.data.data) && response.data.data.length > 0) {
//             setModalContent(response.data.data); // Update modal content with the fetched data
//             setModalIsOpen(true); // Open the modal
//           } else {
//             setModalContent([]); // Ensure modalContent is an empty array
//           }
//         } else {
//           console.error('Error fetching data:', response.data.msg);
//         }
//       } catch (error) {
//         console.error('Error:', error);
//       }
//     };
    
    

//     fetchDataById(); // Call fetchDataById on component mount
//   }, []); // Empty dependency array means this useEffect runs once on mount

//   const handleCloseModal = () => {
//     setModalIsOpen(false);
//   };

//   return (
//     <>
//       <div className='mainDiv'>
//         <button className="button_design" onClick={() => setModalIsOpen(true)}>
//           Get Data By ID
//         </button>
//       </div>

//       <Modal isOpen={modalIsOpen} onRequestClose={handleCloseModal}>
//         <h2>Fetched Data</h2>
//         {modalContent && modalContent.length > 0 ? (
//           <div className="table-responsive">
//             <table className="table table-bordered">
//               <thead>
//                 <tr>
//                   <th>ID</th>
//                   <th>Ticket ID</th>
//                   <th>Employee ID</th>
//                   <th>Description</th>
//                   <th>Priority</th>
//                   <th>Department</th>
//                   <th>Created Date</th>
//                   <th>Solved Date</th>
//                   <th>Status</th>
//                   <th>Managed By</th>
//                   <th>Solved By</th>
//                   <th>Duration</th>
//                 </tr>
//               </thead>
//               <tbody>
//               {modalContent && modalContent.length > 0 ? (
//   <div className="table-responsive">
//     <table className="table table-bordered">
//       <thead>
//         <tr>
//           <th>ID</th>
//           <th>Ticket ID</th>
//           <th>Employee ID</th>
//           <th>Description</th>
//           <th>Priority</th>
//           <th>Department</th>
//           <th>Created Date</th>
//           <th>Solved Date</th>
//           <th>Status</th>
//           <th>Managed By</th>
//           <th>Solved By</th>
//           <th>Duration</th>
//         </tr>
//       </thead>
//       <tbody>
//         {modalContent.map((item) => (
//           <tr key={item._id}>
//             <td>{item._id}</td>
//             <td>{item.helpcenter_ticket_id}</td>
//             <td>{item.helpcenter_employee_id}</td>
//             <td>{item.helpcenter_ticket_description}</td>
//             <td>{item.helpcenter_ticket_priority}</td>
//             <td>{item.helpcenter_ticket_department}</td>
//             <td>{new Date(item.helpcenter_ticket_created_date).toLocaleDateString()}</td>
//             <td>{new Date(item.helpcenter_ticket_solved_date).toLocaleDateString()}</td>
//             <td>{item.helpcenter_ticket_status}</td>
//             <td>{item.helpcenter_ticket_managed_by}</td>
//             <td>{item.helpcenter_ticket_solved_by}</td>
//             <td>{item.helpcenter_solve_duration}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>
// ) : (
//   <p>No data available</p>
// )}

//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p>No data available</p>
//         )}
//         <button onClick={handleCloseModal}>Close</button>
//       </Modal>
//     </>
//   );
// };

// export default EmpHelpCenterModule;




import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import ModalBox from './Edit_Emp_HelpcenterModule.js';
import Nav from '../../navComponent/Nav';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faList, faSortUp, faSortDown, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import ReactPaginate from 'react-paginate';
import Footer from '../../FooterModule/Footer.js';
import { BASE_API_URL } from '../../../lib/constants.jsx';
import Modal from 'react-modal';
import CloseButton from 'react-bootstrap/CloseButton';
Modal.setAppElement('#root');
const EmpHelpCenterModule = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tableData, settableData] = useState([])
  const [togle, settogle] = useState([true])
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedHelpCenterId, setSelectedHelpCenterId] = useState(null);
  const [message, setMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('ascending');
  const [ids, setIds] = useState([]);
  const id = localStorage.getItem("_id")
  const [query, setQuery] = useState('');
  const empCode = localStorage.getItem("employee_code")
  const [helpcenterempid, setHelpcenterEmpId] = useState('');

  const handlePageChange = ({ selected }) => {
    setCurrentPage(selected); // Update the current page when pagination changes
  };

  const itemsPerPage = 10; // Number of items to display per page
  const offset = currentPage * itemsPerPage;
  const pageCount = Math.ceil(tableData.length / itemsPerPage);

  const handleSort = async (column) => {
    if (column === sortColumn) {
      // If the same column is clicked again, reverse the sorting direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
      try {
        const response = await axios.get(`${BASE_API_URL}helpcenter/sortorder?order=${sortDirection}&coloum=${sortColumn}`);
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
      const response = await axios.delete(`${BASE_API_URL}helpcenter/multi-delete`, {
        data: data // IDs ko data body mein bhejna
      });
      console.log(response.data); // Response ke saath kuch karne ke liye
      settogle(!togle);
      setIds([]);
    } catch (error) {
      console.error('Error:', error);
    }
  };



  const openModal = (helpCenterId) => {
    console.log('helpCenterId', helpCenterId)
    setModalIsOpen(true);
    setSelectedHelpCenterId(helpCenterId);

  };

  const closeModal = () => {
    settogle(!togle)
    setModalIsOpen(false);
  };

  const [formData, setFormData] = useState({
    helpcenter_ticket_description: '',
    helpcenter_ticket_priority: '',
    helpcenter_ticket_department: ''

  });
 
  useEffect(() => {
    const fetchData = async () => {
      try {

        const response = await axios.get(`${BASE_API_URL}helpcenter/list`);
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
    setFormData('');
    let formDataNew = {
      helpcenter_ticket_id: '',
      helpcenter_employee_id: localStorage.getItem("_id"),
      helpcenter_ticket_description: '',
      helpcenter_ticket_priority: '',
      helpcenter_ticket_department: '',

    }
    setFormData(formDataNew);
    setIsOpen(true);
  };


  const closePopup = () => {
    setIsOpen(false);
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
    // Handle form submission here, for example, send data to backend or perform validation
    console.log('', formData);
    if (validateForm()) {
      try {
        const response = await axios.post(`${BASE_API_URL}helpcenter/create`, formData);
        settogle(!togle)
        console.log(response.data); // Handle the response as needed
        setMessage(response.data.msg);

      } catch (error) {
        console.error('Error:', error);

      }
    }
  };
  const DeleteData = async (id) => {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');

    // Check if the user confirmed
    if (isConfirmed) {
      // Delete logic here
      try {
        console.log('id', id)
        const response = await axios.delete(`${BASE_API_URL}helpcenter/delete?id=${id}`)

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
  // validation
  const [errors, setErrors] = useState({
    
  });

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};
  
    setErrors(newErrors);
    return isValid;
  };
  const handleChange = async (event) => {
    setQuery(event.target.value);
    console.log(event.target.value)
    if (event.target.value !== '') {
      try {
        const response = await axios.get(`${BASE_API_URL}helpcenter/search?search=${event.target.value}`, {
        });
        console.log(query)
        settableData(response.data)
      } catch (error) {
        console.error('Error:', error);
      }
    }
    else {
      try {
        const response = await axios.get(`${BASE_API_URL}helpcenter/list`);
        console.log(response.data.data); // Handle the response as needed
        settableData(response.data.data)
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };


  return (
    <>
      <div >
        <Nav />
        <div style={{ backgroundColor: '#28769a' }}>
          <h1 className='headerUser'>WELCOME TO HELPCENTER PAGE</h1>
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
                      MultiDel&nbsp;<FontAwesomeIcon icon={faTrashAlt} />
                    </button></span>

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
                                    <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Add Helpcenter Data</h4>
                                    <button style={{ float: 'right', fontSize: '20px', backgroundColor: '#ddc7c7', border: 'none' }} className="close" onClick={closePopup}>&times;</button>
                                  </div>
                                  <div class="row">



                                    <div class="mb-3 col-md-6">
                                      <label><b>Ticket Priority</b></label>
                                      <select
                                        name="helpcenter_ticket_priority"
                                        value={formData.helpcenter_ticket_priority}
                                        onChange={handleInputChange}
                                        className="form-control"
                                      >
                                        <option value="">Select Ticket Priority</option>
                                        <option value="low">low</option>
                                        <option value="medium">medium</option>
                                        <option value="high">high</option>


                                      </select>
                                    </div>
                                    <div class="mb-3 col-md-6">
                                      <lable><b>Ticket Department</b></lable>
                                      <select
                                        name="helpcenter_ticket_department"
                                        value={formData.helpcenter_ticket_department}
                                        onChange={handleInputChange}
                                        className="form-control"
                                      >
                                        <option value="">Select Ticket Department</option>
                                        <option value="Administer">Administer</option>
                                        <option value="HR">HR</option>
                                      </select>
                                    </div>


                                    <div class="mb-3 col-md-6">
                                      <label><b>Ticket Description*</b></label>
                                      <textarea
                                        name="helpcenter_ticket_description"
                                        value={formData.helpcenter_ticket_description}
                                        onChange={handleInputChange}
                                        class="form-control"
                                        placeholder="Ticket Description"
                                      >
                                      </textarea>
                                      {errors.helpcenter_ticket_description && <span className="error" style={{ color: 'red' }}>{errors.helpcenter_ticket_description}</span>}

                                    </div>


                                    <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>
                                  </div>
                                  <div class="col-md-12">
                                    <button type="submit">ADD HELPCENTER</button>
                                  </div>
                                  <span style={{ color: 'green' }}>{message && <p>{message}</p>}</span>

                                </form>

                                <p class="text-center mt-3 text-secondary">If you have account, Please <a href="#">Login Now</a></p>
                              </div>
                            </div>
                          </div>
                        </div>       </div>
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
        </div>
        <div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EmpHelpCenterModule;

