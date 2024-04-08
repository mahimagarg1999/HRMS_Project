const mongoose = require('mongoose');
const { Schema } = mongoose;
const EmployeeSchema = new Schema({
   
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
    },
    employee_city: {
        type: String,
    },
    employee_state: {
        type: String,
    },
    employee_other_info: {
        type: String,
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
    },
    employee_experience: {
        type: String,
        required: true
    },
    employee_resume: {
        type: String,
    },
    employee_id_proof: {
        type: String,
    },
    employee_permanant_address_proof: {
        type: String,
    },
    employee_local_address_proof: {
        type: String,
    },
    employee_reference_one_name: {
        type: String,
     },
    employee_reference_one_mobile: {
        type: String,
     },
    employee_reference_two_name: {
        type: String,
     },
    employee_reference_two_mobile: {
        type: String,
     },
    employee_info1: {
        type: String,
     },
    employee_info2: {
        type: String,
     },
    employee_info3: {
        type: String,
     },
    employee_info4: {
        type: String,
     },
    employee_info5: {
        type: String,
     },
    employee_info6: {
        type: String,
     },
    employee_info7: {
        type: String,
     },
    employee_info8: {
        type: String,
     },
    employee_info9: {
        type: String,
     },
    employee_info10: {
        type: String,
     }
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const Employee = mongoose.model('employee', EmployeeSchema);

module.exports = Employee;