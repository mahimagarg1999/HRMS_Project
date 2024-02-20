const mongoose = require('mongoose');
// const Schema = mongoose.Schema;
const { Schema } = mongoose;

const EmployeeSchema = new Schema({
    employee_id: {
        type: String,
        required: true
    },
    employee_first_name: {
        type: String,
        required: true
    },
    employee_last_name: {
        type: String,
        required: true
    },
    employee_mobile: {
        type: String,
        required: true
    },
    employee_alternate_mobile: {
        type: String,
        required: true
    },
    employee_email: {
        type: String,
        required: true,
        unique: true
    },
    employee_password: {
        type: String,
        required: true
    },
    employee_address: {
        type: String,
        required: true
    },
    employee_city: {
        type: String,
        required: true
    },
    employee_state: {
        type: String,
        required: true
    },
    employee_other_info: {
        type: String,
        required: true
    },
    employee_dob: {
        type: Date,
        default: Date.now
    },
    employee_doj: {
        type: Date,
        default: Date.now
    },
    employee_skills: {
        type: String,
        required: true
    },
    employee_experience: {
        type: String,
        required: true
    },
    employee_resume: {
        type: String,
        required: true
    },
    employee_id_proof: {
        type: String,
        required: true
    },
    employee_permanant_address_proof: {
        type: String,
        required: true
    },
    employee_local_address_proof: {
        type: String,
        required: true
    },
    employee_reference_one_name: {
        type: String,
        required: true
    },
    employee_reference_one_mobile: {
        type: String,
        required: true
    },
    employee_reference_two_name: {
        type: String,
        required: true
    },
    employee_reference_two_mobile: {
        type: String,
        required: true
    },
    employee_info1: {
        type: String,
        required: true
    },
    employee_info2: {
        type: String,
        required: true
    },
    employee_info3: {
        type: String,
        required: true
    },
    employee_info4: {
        type: String,
        required: true
    },
    employee_info5: {
        type: String,
        required: true
    },
    employee_info6: {
        type: String,
        required: true
    },
    employee_info7: {
        type: String,
        required: true
    },
    employee_info8: {
        type: String,
        required: true
    },
    employee_info9: {
        type: String,
        required: true
    },
    employee_info10: {
        type: String,
        required: true
    }
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;