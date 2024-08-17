const mongoose = require('mongoose');
const { Schema } = mongoose;
const CandidateSchema = new Schema({
    candidate_id: {
        type: String,
        unique: true,
        required: true
    },
    candidate_first_name: {
        type: String,
        required: true
    },
    candidate_last_name: {
        type: String,
        required: true
    },
    candidate_mobile: {
        type: String,
        required: true
    },
    candidate_alternate_mobile: {
        type: String,
    },
    candidate_email: {
        type: String,
        required: true,
        unique: true
    },
    candidate_skype: {
        type: String,
    },
    candidate_linkedIn_profile: {
        type: String,
    },
    candidate_skills: {
        type: Array,
        required: true
    },
    candidate_experience: {
        type: String,
        required: true
    },
    candidate_expected_salary: {
        type: String,
        required: true
    },
    candidate_expected_joining_date: {
        type: Date,
        default: Date.now
    },
    candidate_marrital_status: {
        type: String,
    },
    
    interview_rounds : {
        type: String,
    },
    
    candidate_selection_status: {
        type: String,
    },
    candidate_feedback: {
        type: String,
    },
    source_of_candidate: {
        type: String,
    },
    candidate_address: {
        type: String,
    },
    candidate_document_proof: {
        type: String,
    },
    tenth_percentage: {
        type: Number
    },
    twelfth_percentage: {
        type: Number
    },
    graduationPercentage: {
        type: Number
    },
    postGraduationPercentage: {
        type: Number
    },
    profile: {
        type: String,
        required: true
    },
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const Candidate = mongoose.model('candidate', CandidateSchema);
module.exports = Candidate;