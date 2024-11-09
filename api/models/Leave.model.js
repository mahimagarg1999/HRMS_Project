const mongoose = require('mongoose');
const { Schema } = mongoose;
const LeaveSchema = new Schema({
  employee_id: {
    type: String,
    required: true,
  },
  leave_type: {
    type: String,
    enum: ['Sick Leave', 'Casual Leave', 'Annual Leave', 'Maternity Leave', 'Paternity Leave', 'Other'],
   },
  start_date: {
    type: Date,
    required: true
  },
  end_date: {
    type: Date,
    required: true
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },

  applied_on: {
    type: Date,
   },
  approved_by: {
    type: String,
    enum: ['Arun Sir', 'Anil Sir', 'Pawan Sir', 'Manoj Sir', "Hr ma'am"],
    default: 'Arun Sir'
  },
  comments: {
    type: String,
   }
});
const Leave = mongoose.model('leaveModule', LeaveSchema);
module.exports = Leave;
