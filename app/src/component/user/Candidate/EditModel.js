// Modal.js
import React, {useState,useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios'; // For Axios
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import Modal from 'react-modal';

const ModalBox = ({ isOpen, onRequestClose,candidateId }) => {
  
    const [data,setData]=useState([])
    useEffect(() => {
        
        if (isOpen) {
        console.log('model open',candidateId)
        // Fetch data for the given candidateId
        if (candidateId) {
          const fetchData = async () => {
            try {
                
              const response = await axios.get(`http://localhost:5000/api/candidate/get?candidateid=${candidateId}`);
              
              
              setData(response.data.data)
              console.log('data',data)

            } catch (error) {
                console.log('model open error')

              console.error('Error fetching candidate data:', error);
            }
          };
    
          fetchData();
        }
    }
      }, [isOpen]);
  
      
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    };
  
    const handleSubmit = (e) => {
        console.log("data",data)
      e.preventDefault();
      // Handle form submission here
      try {
        const response =  axios.put('http://localhost:5000/api/candidate/edit',data );
        console.log(response.data); // Handle the response as needed
    } catch (error) {
        console.error('Error:', error);
    }    };
  
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        ariaHideApp={false}
        style={{
          overlay: {
            
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          },
          content: {
            width: '90%',
            height: '90%',
            margin: 'auto',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            padding: '20px'
          }
        }}
      >
                <button onClick={onRequestClose}>Close</button>

     <div class="row">
        <div class="col-md-6 offset-md-3">
            <div class="signup-form">
            <form onSubmit={handleSubmit} class="mt-5 border p-4 bg-light shadow">
    <div style={{ textAlign: 'center' }}>
        <h4 style={{ display: 'inline', marginRight: '10px' }} className="mb-5 text-secondary">Edit Your profile</h4>
       
    </div>
    <div class="row">
        <div class="mb-3 col-md-6">
        <input type="text" name="candidate_first_name" value={data.candidate_first_name} onChange={handleInputChange} class="form-control" placeholder="First Name"  />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_last_name" value={data.candidate_last_name} onChange={handleInputChange} class="form-control" placeholder="Last Name" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_mobile" value={data.candidate_mobile} onChange={handleInputChange} class="form-control" placeholder="Mobile Number" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_alternate_mobile" value={data.candidate_alternate_mobile} onChange={handleInputChange} class="form-control" placeholder="Alternate Mobile Number"/>
        </div>
        <div class="mb-3 col-md-6">
            <input type="email" name="candidate_email" value={data.candidate_firscandidate_emailt_name} onChange={handleInputChange} class="form-control" placeholder="Email" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_skype" value={data.candidate_skype} onChange={handleInputChange} class="form-control" placeholder="Skype ID" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_profile" value={data.candidate_profile} onChange={handleInputChange} class="form-control" placeholder="Profile" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_skills" value={data.candidate_skills} onChange={handleInputChange} class="form-control" placeholder="Skills" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_experience" value={data.candidate_experience} onChange={handleInputChange} class="form-control" placeholder="Experience" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_expected_salary" value={data.candidate_expected_salary} onChange={handleInputChange} class="form-control" placeholder="Expected Salary" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="date" name="candidate_expected_joining_date" value={data.candidate_expected_joining_date} onChange={handleInputChange} class="form-control" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_joining_immediate" value={data.candidate_joining_immediate} onChange={handleInputChange} class="form-control" placeholder="Joining Immediate" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_marrital_status" value={data.candidate_marrital_status} onChange={handleInputChange} class="form-control" placeholder="Marrital Status" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_written_round" value={data.candidate_written_round} onChange={handleInputChange} class="form-control" placeholder="Written Round" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_machine_round" value={data.candidate_machine_round} onChange={handleInputChange} class="form-control" placeholder="Machine Round" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_technical_interview_round" value={data.candidate_technical_interview_round} onChange={handleInputChange} class="form-control" placeholder="Technical Interview Round" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_hr_interview_round" value={data.candidate_hr_interview_round} onChange={handleInputChange} class="form-control" placeholder="HR Interview Round" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_selection_status" value={data.candidate_selection_status} onChange={handleInputChange} class="form-control" placeholder="Selection Status" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_feedback" value={data.candidate_feedback} onChange={handleInputChange} class="form-control" placeholder="Feedback" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_from_consultancy" value={data.candidate_from_consultancy} onChange={handleInputChange} class="form-control" placeholder="From Consultancy" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info1" value={data.candidate_info1} onChange={handleInputChange} class="form-control" placeholder="Additional Information 1" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info2" value={data.candidate_info2} onChange={handleInputChange} class="form-control" placeholder="Additional Information 2" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info3" value={data.candidate_info3} onChange={handleInputChange} class="form-control" placeholder="Additional Information 4" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info4" value={data.candidate_info4} onChange={handleInputChange} class="form-control" placeholder="Additional Information 4" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info5" value={data.candidate_info5} onChange={handleInputChange} class="form-control" placeholder="Additional Information 5" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info6" value={data.candidate_info6} onChange={handleInputChange} class="form-control" placeholder="Additional Information 6" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info7" value={data.candidate_info7} onChange={handleInputChange} class="form-control" placeholder="Additional Information 7" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info8" value={data.candidate_info8} onChange={handleInputChange} class="form-control" placeholder="Additional Information 8" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info9" value={data.candidate_info9} onChange={handleInputChange} class="form-control" placeholder="Additional Information 9" />
        </div>
        <div class="mb-3 col-md-6">
            <input type="text" name="candidate_info10" value={data.candidate_info10} onChange={handleInputChange} class="form-control" placeholder="Additional Information 10" />
        </div>
    </div>
    <div class="col-md-12">
    <button type="submit">EDit here</button>
</div>
</form>
                
                
            </div>
        </div>
    </div>
      </Modal>
    );
  };
  

export default ModalBox;