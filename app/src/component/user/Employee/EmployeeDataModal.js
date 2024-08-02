import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeeDataModal = ({ isOpen1, onRequestClose, data }) => {
    console.log('ModalComponent data:', data); // Debugging log

    if (!isOpen1 || !data) {
        return null;
    }

    // Destructure data object
    const { employee_code, employee_first_name, employee_last_name, employee_mobile,
        employee_alternate_mobile, employee_email, employee_password, employee_address,
        employee_city, employee_state, employee_other_info, employee_dob, employee_doj,
        employee_skills, employee_experience, employee_resume, employee_id_proof,
        employee_permanant_address_proof, employee_local_address_proof,
        employee_reference_one_name, employee_reference_one_mobile,
        employee_reference_two_name, employee_reference_two_mobile,
        employee_pan_card, employee_marksheet, employee_experience_letter,
        image, resumePdfName, proofPdfName, panPdfName, marksheetPdfName,
        experiencePdfName, imageName } = data.data;

    return (
        <Modal show={isOpen1} onHide={onRequestClose} size="lg" >
            <Modal.Header closeButton>
                <Modal.Title>View Employee Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div>
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <td className='empmarginShiftData'><strong>Image:</strong></td>
                                <td><img src={`http://localhost:5000/${image}`} alt="Employee" style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    objectFit: 'cover'
                                }} /></td>

                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Employee Code:</strong></td>
                                <td>{employee_code}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>First Name:</strong></td>
                                <td>{employee_first_name}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Last Name:</strong></td>
                                <td>{employee_last_name}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Mobile:</strong></td>
                                <td>{employee_mobile}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Alternate Mobile:</strong></td>
                                <td>{employee_alternate_mobile}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Email:</strong></td>
                                <td>{employee_email}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Password:</strong></td>
                                <td>{employee_password}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Address:</strong></td>
                                <td>{employee_address}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>City:</strong></td>
                                <td>{employee_city}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>State:</strong></td>
                                <td>{employee_state}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Other Info:</strong></td>
                                <td>{employee_other_info}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Date of Birth:</strong></td>
                                <td>{employee_dob}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Date of Joining:</strong></td>
                                <td>{employee_doj}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Skills:</strong></td>
                                <td>{(employee_skills || []).join(', ')}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Experience:</strong></td>
                                <td>{employee_experience}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Resume:</strong></td>
                                <td>{employee_resume}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>ID Proof:</strong></td>
                                <td>{employee_id_proof}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Permanent Address Proof:</strong></td>
                                <td>{employee_permanant_address_proof}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Local Address Proof:</strong></td>
                                <td>{employee_local_address_proof}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Reference One Name:</strong></td>
                                <td>{employee_reference_one_name}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Reference One Mobile:</strong></td>
                                <td>{employee_reference_one_mobile}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Reference Two Name:</strong></td>
                                <td>{employee_reference_two_name}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Reference Two Mobile:</strong></td>
                                <td>{employee_reference_two_mobile}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>PAN Card:</strong></td>
                                <td>{employee_pan_card}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Marksheet:</strong></td>
                                <td>{employee_marksheet}</td>
                            </tr>
                            <tr>
                                <td className='empmarginShiftData'><strong>Experience Letter:</strong></td>
                                <td>{employee_experience_letter}</td>
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

export default EmployeeDataModal;

