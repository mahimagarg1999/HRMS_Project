import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Candidate.css'; // Import your custom CSS file
import CloseButton from 'react-bootstrap/CloseButton';

const CandidateDataModal = ({ isOpen1, onRequestClose, data }) => {
    console.log('ModalComponent data:', data); // Debugging log

    if (!isOpen1 || !data) {
        return null;
    }

    // Destructure data object
    const {
        candidate_id,
        candidate_first_name,
        candidate_last_name,
        candidate_mobile,
        candidate_alternate_mobile,
        candidate_email,
        candidate_skype,
        candidate_linkedIn_profile,
        candidate_skills,
        candidate_experience,
        candidate_expected_salary,
        candidate_expected_joining_date,
        candidate_marrital_status,
        candidate_machine_round,
        candidate_technical_interview_round,
        candidate_hr_interview_round,
        candidate_selection_status,
        candidate_feedback,
        source_of_candidate,
        candidate_address,
        candidate_document_proof,
        tenth_percentage,
        twelfth_percentage,
        graduationPercentage,
        profile
    } = data.data;

    return (
        <Modal show={isOpen1} onHide={onRequestClose} size="lg"
            style={{
                overlay: {

                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                },
                content: {
                    width: '100%',
                    height: '100%',
                    margin: 'auto',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    padding: '20px',
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    border: 'none',
                    // overflow: 'hidden', // Prevent scroll

                }
            }}>
            <Modal.Header closeButton>
                <Modal.Title>View Candidate Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div>

                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td className='canmarginShiftData'><strong>Candidate ID:</strong></td>
                                <td>{candidate_id}</td>
                            </tr>
                            <tr>
                                <td><strong>First Name:</strong></td>
                                <td>{candidate_first_name}</td>
                            </tr>
                            <tr>
                                <td><strong>Last Name:</strong></td>
                                <td>{candidate_last_name}</td>
                            </tr>
                            <tr>
                                <td><strong>Mobile:</strong></td>
                                <td>{candidate_mobile}</td>
                            </tr>
                            <tr>
                                <td><strong>Alternate Mobile:</strong></td>
                                <td>{candidate_alternate_mobile}</td>
                            </tr>
                            <tr>
                                <td><strong>Email:</strong></td>
                                <td>{candidate_email}</td>
                            </tr>
                            <tr>
                                <td><strong>Skype:</strong></td>
                                <td>{candidate_skype}</td>
                            </tr>
                            <tr>
                                <td><strong>LinkedIn Profile:</strong></td>
                                <td>{candidate_linkedIn_profile}</td>
                            </tr>
                            <tr>
                                <td><strong>Skills:</strong></td>
                                <td>{(candidate_skills || []).join(', ')}</td>
                            </tr>
                            <tr>
                                <td><strong>Experience:</strong></td>
                                <td>{candidate_experience}</td>
                            </tr>
                            <tr>
                                <td><strong>Expected Salary:</strong></td>
                                <td>{candidate_expected_salary}</td>
                            </tr>
                            <tr>
                                <td><strong>Expected Joining Date:</strong></td>
                                <td>{candidate_expected_joining_date}</td>
                            </tr>
                            <tr>
                                <td><strong>Marital Status:</strong></td>
                                <td>{candidate_marrital_status}</td>
                            </tr>
                            <tr>
                                <td><strong>Machine Round:</strong></td>
                                <td>{candidate_machine_round}</td>
                            </tr>
                            <tr>
                                <td><strong>Technical Interview Round:</strong></td>
                                <td>{candidate_technical_interview_round}</td>
                            </tr>
                            <tr>
                                <td><strong>HR Interview Round:</strong></td>
                                <td>{candidate_hr_interview_round}</td>
                            </tr>
                            <tr>
                                <td><strong>Selection Status:</strong></td>
                                <td>{candidate_selection_status}</td>
                            </tr>
                            <tr>
                                <td><strong>Feedback:</strong></td>
                                <td>{candidate_feedback}</td>
                            </tr>
                            <tr>
                                <td><strong>Source of Candidate:</strong></td>
                                <td>{source_of_candidate}</td>
                            </tr>
                            <tr>
                                <td><strong>Address:</strong></td>
                                <td>{candidate_address}</td>
                            </tr>
                            <tr>
                                <td><strong>Document Proof:</strong></td>
                                <td>{candidate_document_proof}</td>
                            </tr>
                            <tr>
                                <td><strong>10th Percentage:</strong></td>
                                <td>{tenth_percentage}</td>
                            </tr>
                            <tr>
                                <td><strong>12th Percentage:</strong></td>
                                <td>{twelfth_percentage}</td>
                            </tr>
                            <tr>
                                <td><strong>Graduation Percentage:</strong></td>
                                <td>{graduationPercentage}</td>
                            </tr>
                            <tr>
                                <td><strong>Profile:</strong></td>
                                <td>{profile}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onRequestClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CandidateDataModal;











// import React from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const CandidateDataModal = ({ isOpen1, onRequestClose, data }) => {
//     console.log('ModalComponent data:', data); // Debugging log

//     if (!isOpen1 || !data) {
//         return null;
//     }

//     // Destructure data object
//     const { candidate_id,
//         candidate_first_name,
//         candidate_last_name,
//         candidate_mobile,
//         candidate_alternate_mobile,
//         candidate_email,
//         candidate_skype,
//         candidate_linkedIn_profile,
//         candidate_skills,
//         candidate_experience,
//         candidate_expected_salary,
//         candidate_expected_joining_date,
//         candidate_marrital_status,
//         candidate_machine_round,
//         candidate_technical_interview_round,
//         candidate_hr_interview_round,
//         candidate_selection_status,
//         candidate_feedback,

//         source_of_candidate,
//         candidate_address

//     } = data.data;

//     return (
//         <Modal show={isOpen1} onHide={onRequestClose} size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>View Candidate Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div>
//                     <table>
//                         <tbody>
//                             <tr>
//                                 <td className='marginShiftData'><strong>candidate_id:</strong></td>
//                                 <td >{candidate_id}</td>
//                             </tr>
//                             <tr>
//                                 <td><strong>candidate_first_name:</strong></td>
//                                 <td  >{candidate_first_name}</td>
//                             </tr>
//                             <tr>
//                                 <td><strong>candidate_last_name:</strong></td>
//                                 <td>{candidate_last_name}</td>
//                             </tr>
//                             <tr>
//                                 <td><strong>candidate_mobile:</strong></td>
//                                 <td>{candidate_mobile}</td>
//                             </tr>
//                             {/* <tr> jobs@gammastack.com
//                     <td><strong>Department:</strong></td>
//                     <td>{department}</td>
//                 </tr> */}
//                             <tr>
//                                 <td><strong>candidate_alternate_mobile:</strong></td>
//                                 <td>{candidate_alternate_mobile}</td>
//                             </tr>
//                             <tr>
//                                 <td><strong>candidate_email:</strong></td>
//                                 <td>{candidate_email}</td>
//                             </tr>
//                             {/* <tr>
//                                 <td><strong>Interview Date:</strong></td>
//                                 <td>{new Date(interview_date).toLocaleDateString()}</td>
//                             </tr>
//                             <tr>
//                                 <td><strong>Experience:</strong></td>
//                                 <td>{experience}</td>
//                             </tr> */}
//                           <tr>
//         <td><strong>Skype:</strong></td>
//         <td>{candidate_skype}</td>
//     </tr>
//     <tr>
//         <td><strong>LinkedIn Profile:</strong></td>
//         <td>{candidate_linkedIn_profile}</td>
//     </tr>
//     <tr>
//         <td><strong>Skills:</strong></td>
//         <td>{candidate_skills}</td>
//     </tr>
//     <tr>
//         <td><strong>Experience:</strong></td>
//         <td>{candidate_experience}</td>
//     </tr>
//     <tr>
//         <td><strong>Expected Salary:</strong></td>
//         <td>{candidate_expected_salary}</td>
//     </tr>
//     <tr>
//         <td><strong>Expected Joining Date:</strong></td>
//         <td>{candidate_expected_joining_date}</td>
//     </tr>
//     <tr>
//         <td><strong>Marital Status:</strong></td>
//         <td>{candidate_marrital_status}</td>
//     </tr>
//     <tr>
//         <td><strong>Machine Round:</strong></td>
//         <td>{candidate_machine_round}</td>
//     </tr>
//     <tr>
//         <td><strong>Technical Interview Round:</strong></td>
//         <td>{candidate_technical_interview_round}</td>
//     </tr>
//     <tr>
//         <td><strong>HR Interview Round:</strong></td>
//         <td>{candidate_hr_interview_round}</td>
//     </tr>
//     <tr>
//         <td><strong>Selection Status:</strong></td>
//         <td>{candidate_selection_status}</td>
//     </tr>
//     <tr>
//         <td><strong>Feedback:</strong></td>
//         <td>{candidate_feedback}</td>
//     </tr>
//     <tr>
//         <td><strong>Source of Candidate:</strong></td>
//         <td>{source_of_candidate}</td>
//     </tr>
//     <tr>
//         <td><strong>Address:</strong></td>
//         <td>{candidate_address}</td>
//     </tr>

//                             {/* <tr>
//                                 <td><strong>requiredSkills:</strong></td>
//                                 <td>{(requiredSkills || []).join(', ')}</td>
//                             </tr> */}

//                         </tbody>
//                     </table>
//                 </div>
//             </Modal.Body>
//             <Modal.Footer>
//                 <Button variant="secondary" onClick={onRequestClose}>
//                     Close
//                 </Button>
//             </Modal.Footer>
//         </Modal>
//     );
// };

// export default CandidateDataModal;


