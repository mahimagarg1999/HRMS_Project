import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
 
const ModalComponent = ({ isOpen1, onRequestClose, data }) => {
    console.log('ModalComponent data:', data); // Debugging log

    if (!isOpen1 || !data) {
        return null;
    }

    // Destructure data object
    const {
         helpcenter_ticket_id,
        helpcenter_employee_id,
        helpcenter_ticket_description,
        helpcenter_ticket_priority,
        helpcenter_ticket_department,
        helpcenter_ticket_created_date,
        helpcenter_ticket_solved_date,
        
        helpcenter_solve_duration,
        helpcenter_ticket_managed_by,
        helpcenter_ticket_solved_by,
        helpcenter_ticket_status
    } = data.data;

    return (
        <Modal show={isOpen1} onHide={onRequestClose} size="lg" >
            <Modal.Header closeButton>
                <Modal.Title>View HelpCenter Details</Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-body-custom">
                <div>
                <table className="table table-striped">
    <tbody>
        
        <tr>
            <td><strong>Helpcenter Ticket ID:</strong></td>
            <td>{helpcenter_ticket_id}</td>
        </tr>
        <tr>
            <td><strong>Employee ID:</strong></td>
            <td>{helpcenter_employee_id}</td>
        </tr>
        <tr>
            <td><strong>Ticket Description:</strong></td>
            <td>{helpcenter_ticket_description}</td>
        </tr>
        <tr>
            <td><strong>Priority:</strong></td>
            <td>{helpcenter_ticket_priority}</td>
        </tr>
        <tr>
            <td><strong>Department:</strong></td>
            <td>{helpcenter_ticket_department}</td>
        </tr>
        <tr>
            <td><strong>Created Date:</strong></td>
            <td>{new Date(helpcenter_ticket_created_date).toLocaleDateString()}</td>
        </tr>
        <tr>
            <td><strong>Solved Date:</strong></td>
            <td>{new Date(helpcenter_ticket_solved_date).toLocaleDateString()}</td>
        </tr>
        
       
        <tr>
            <td><strong>Solve Duration:</strong></td>
            <td>{helpcenter_solve_duration}</td>
        </tr>
        <tr>
            <td><strong>Managed By:</strong></td>
            <td>{helpcenter_ticket_managed_by}</td>
        </tr>
        <tr>
            <td><strong>Solved By:</strong></td>
            <td>{helpcenter_ticket_solved_by}</td>
        </tr>
        <tr>
            <td><strong>Status:</strong></td>
            <td>{helpcenter_ticket_status}</td>
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
 


