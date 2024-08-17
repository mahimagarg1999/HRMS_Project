const mongoose = require('mongoose');
const { Schema } = mongoose;

const EMPHelpcenterSchema = new Schema({
    helpcenter_ticket_id: {
        type: String,
    },
    helpcenter_employee_id: {
        type: String,
    },
    helpcenter_ticket_description: {
        type: String,   
        required: true
    },
    helpcenter_ticket_priority: {
        type: String,
    },
    helpcenter_ticket_department: {
        type: String,
    },
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const HelpCenter = mongoose.model('emp_helpcenter', EMPHelpcenterSchema);
module.exports = HelpCenter;    