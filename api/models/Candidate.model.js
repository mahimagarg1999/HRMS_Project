const mongoose = require('mongoose');
 const { Schema } = mongoose;

const CandidateSchema = new Schema({
    candidate_id:{
        type: String,
        required: true
   },
   candidate_first_name:{
        type: String,
        required: true
   },
   candidate_last_name:{
        type: String,
        required: true
   },
candidate_mobile:{
        type: String,
        required: true
   },
candidate_alternate_mobile:{
        type: String,
        required: true
   },
candidate_email:{
        type: String,
        required: true
   },
candidate_skype:{
        type: String,
        required: true
   },
  candidate_profile:{
        type: String,
        required: true
   },
   candidate_skills:{
        type: String,
        required: true
   },
   candidate_experience:{
        type: String,
        required: true
   },
   candidate_expected_salary:{
        type: String,
        required: true
   },
   candidate_expected_joining_date:{
        type: Date,
        default: Date.now
   },
   candidate_joining_immediate:{
        type: String,
        required: true
   },


   candidate_marrital_status:{
        type: Date,
        default: Date.now
    },
   candidate_written_round:{
        type: String,
        required: true
    },
    candidate_machine_round:{
        type: String,
        required: true
    },
    candidate_technical_interview_round:{
        type: String,
        required: true
    },
    candidate_hr_interview_round:{
        type: String,
        required: true
    },
    candidate_selection_status:{
        type: String,
        required: true
    },
    candidate_feedback:{
        type: String,
        required: true
    }, 
    candidate_from_consultancy:{
        type: String,
        required: true
    },
   candidate_info1:{
        type: String,
        required: true
   },
candidate_info2:{
        type: String,
        required: true
   },
candidate_info3:{
        type: String,
        required: true
   },
candidate_info4:{
        type: String,
        required: true
   },
candidate_info5:{
        type: String,
        required: true
   },
candidate_info6:{
        type: String,
        required: true
   },
candidate_info7:{
        type: String,
        required: true
   },
candidate_info8:{
        type: String,
        required: true
   },
candidate_info9:{
        type: String,
        required: true
   },
candidate_info10:{
        type: String,
        required: true
   },
},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const Candidate = mongoose.model('candidate', CandidateSchema);

module.exports = Candidate;