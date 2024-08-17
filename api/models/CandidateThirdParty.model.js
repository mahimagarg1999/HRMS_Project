const mongoose = require('mongoose');
const { Schema } = mongoose;

const CandidateThirdPartySchema = new Schema({
    student_name: {
        type: String,
        required: true,
    },
    student_email: {
        type: String,
        required: true,
    },
    student_mobile: {
        type: String,
        required: true,
    },
    student_qualification: {
        type: String,
        required: true,
    },
    student_exp: {
        type: String,
        required: true,
    },
    student_position: {
        type: String,
        required: true,
    },
    student_intdate: {
        type: Date,
        required: true,
    },
    student_time: {
        type: String,
        required: true,
    },
    student_resume: {
        type: String,
        required: true,
    },
    date_time: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    technologies: {
        type: String,
        required: true,
    }
});

const canThirdParty = mongoose.model('CandidateThirdParty', CandidateThirdPartySchema);
module.exports = canThirdParty;
