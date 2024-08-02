import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const CandidateByDataModalComponent = ({ isOpen1, onRequestClose, data }) => {
    console.log('ModalComponent data:', data); // Debugging log

    if (!isOpen1 || !data) {
        return null;
    }

    // Destructure data object
    const { id, student_name, student_email, student_mobile, student_qualification, student_exp, student_position, student_intdate, student_time, student_resume, status, technologies
    } = data;

    return (
        <Modal show={isOpen1} onHide={onRequestClose} size="lg" >
            <Modal.Header closeButton>
                <Modal.Title>View Candidate by api Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div>
                    <table className="table table-striped">
                        <tbody>


                            <tr>
                                <td className='marginShiftData'><strong>ID:</strong></td>
                                <td>{id}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Name:</strong></td>
                                <td>{student_name}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Email:</strong></td>
                                <td>{student_email}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Mobile:</strong></td>
                                <td>{student_mobile}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Qualification:</strong></td>
                                <td>{student_qualification}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Experience:</strong></td>
                                <td>{student_exp}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Position:</strong></td>
                                <td>{student_position}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Interview Date:</strong></td>
                                <td>{student_intdate}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Interview Time:</strong></td>
                                <td>{student_time}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Student Resume:</strong></td>
                                <td>{student_resume}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Status:</strong></td>
                                <td>{status}</td>
                            </tr>
                            <tr>
                                <td className='marginShiftData'><strong>Technologies:</strong></td>
                                <td>{technologies}</td>
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

export default CandidateByDataModalComponent;

