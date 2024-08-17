const mongoose = require('mongoose');
const { Schema } = mongoose;

const RecruitmentSchema = new Schema({
    profile_id: {
        type: String,
        unique: true,
        required: true
    },
    profile: {
        type: String,
        enum: ['SEO', 'Web Developer', 'Drupal Developer', 'WordPress Developer', 'QA-Tester', 'BDE', 'Android Developer', 'IOS Developer', 'ROR Developer', 'Php Developer', 'Python Developer', 'Data Analyist', 'Web Designing', "test", "test1"],
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true
    },
    interviewer: {
        type: String,
        enum: ['Mr. Arun Sharma', 'Mr. Anil Tiwari', 'Mr. Pawan Patel', 'Mr. Manoj Sahu', 'Ms. Geetanjali P'],
        default: 'Mr. Arun Sharma',
        required: true
    },
    interview_date: {
        type: Date,
    },
    notes: { type: String },
    no_of_candidate: {
        type: Number,
        default: 0
    },
    experience: { type: String, required: true },
    salary: { type: String, required: true },
    location: { type: String },
    responsibilities: { type: String, required: true },
    requiredSkills: { type: Array, required: true },
    applyNowLink: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    emailId: {
        type: String, required: true, unique: true,
    },
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const Recruitment = mongoose.model('recruitment', RecruitmentSchema);
module.exports = Recruitment;