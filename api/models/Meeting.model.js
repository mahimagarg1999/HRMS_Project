const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: { 
        type: String,
    },
    participants: [{
        name: String,
        email: String
    }],
    scheduledDate: {
        type: Date,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    location: {
        type: String
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'Cancelled'],
        default: 'Scheduled'
    },
    meetingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',  // Refers to the person the meeting is directed to
        required: true
    },
    meetingWith: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'employee',  // Refers to the person conducting or attending the meeting
        required: true
    },
   
});

module.exports = mongoose.model('Meeting', meetingSchema);
