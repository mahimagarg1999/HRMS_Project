import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Recruitment.css'; // Import your custom CSS file

const ModalComponent = ({ isOpen1, onRequestClose, data }) => {
    console.log('ModalComponent data:', data); // Debugging log

    if (!isOpen1 || !data) {
        return null;
    }

    // Destructure data object
    const { profile, description, interviewer, profile_id, department, interview_date, notes, no_of_candidate, experience,
        salary,
        location,
        responsibilities,
        requiredSkills,
        applyNowLink,
        whatsappNumber,
        emailId
    } = data.data;

    return (
        <Modal show={isOpen1} onHide={onRequestClose} size="lg" >
            <Modal.Header closeButton>
                <Modal.Title>View Recruitment Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div>
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td className='marginShiftData'><strong>Profile:</strong></td>
                                <td >{profile}</td>
                            </tr>
                            <tr>
                                <td><strong>Description:</strong></td>
                                <td  >{description}</td>
                            </tr>
                            <tr>
                                <td><strong>Interviewer:</strong></td>
                                <td>{interviewer}</td>
                            </tr>
                            <tr>
                                <td><strong>Profile ID:</strong></td>
                                <td>{profile_id}</td>
                            </tr>
                            {/* <tr> jobs@gammastack.com
                    <td><strong>Department:</strong></td>
                    <td>{department}</td>
                </tr> */}
                            <tr>
                                <td><strong>Notes:</strong></td>
                                <td>{notes}</td>
                            </tr>
                            <tr>
                                <td><strong>No. of Candidates:</strong></td>
                                <td>{no_of_candidate}</td>
                            </tr>
                            <tr>
                                <td><strong>Interview Date:</strong></td>
                                <td>{new Date(interview_date).toLocaleDateString()}</td>
                            </tr>
                            <tr>
                                <td><strong>Experience:</strong></td>
                                <td>{experience}</td>
                            </tr>
                            <tr>
                                <td><strong>Salary:</strong></td>
                                <td>{salary}</td>
                            </tr>
                            <tr>
                                <td><strong>Location:</strong></td>
                                <td>{location}</td>
                            </tr>
                            <tr>
                                <td><strong>ApplyNowLink:</strong></td>
                                <td>{applyNowLink}</td>
                            </tr>
                            <tr>
                                <td><strong>WhatsappNo:</strong></td>
                                <td>{whatsappNumber}</td>
                            </tr>
                            <tr>
                                <td><strong>EmailId:</strong></td>
                                <td>{emailId}</td>
                            </tr>
                            <tr>
                                <td><strong>Responsibilities:</strong></td>
                                <td>{responsibilities}</td>
                            </tr>

                            <tr>
                                <td><strong>requiredSkills:</strong></td>
                                <td>{(requiredSkills || []).join(', ')}</td>
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

export default ModalComponent;



// import React from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ModalComponent = ({ isOpen1, onRequestClose, data }) => {
//     if (!data) {
//         return null;
//     }

//     return (
//         <Modal show={isOpen1} onHide={onRequestClose} size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>View Recruitment Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div>
//                     <h5>Profile: {data.profile}</h5>
//                     <p>Description: {data.description}</p>
//                     <p>Interviewer: {data.interviewer}</p>
//                     {/* Add more fields as needed */}
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

// export default ModalComponent;




// import React from 'react';
// import Modal from 'react-bootstrap/Modal';
// import Button from 'react-bootstrap/Button';
// import 'bootstrap/dist/css/bootstrap.min.css';

// const ModalComponent = ({ isOpen1, onRequestClose, data }) => {
//     if (!isOpen1) {
//         return null;
//     }

//     return (
//         <Modal show={isOpen1} onHide={onRequestClose} size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>View Recruitment Details</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <div>
//                     <h5>Profile: {data.profile}</h5>
//                     <p>Description: {data.description}</p>
//                     {/* Add more fields as needed */}
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

// export default ModalComponent;


