const mongoose = require('mongoose');
const { Schema } = mongoose;
const ConsultancySchema = new Schema({
    consultancy_id: {
        type: String,
        required: true
    },
    consultancy_name: {
        type: String,
        required: true,
        unique: true
    },
    consultancy_email: {
        type: String,
        required: true
    },
    consultancy_website: {
        type: String,
        required: true
    },
    consultancy_mobile: {
        type: String,
        required: true
    },
    consultancy_alternate_mobile: {
        type: String,
        required: true
    },
    consultancy_city: {
        type: String,
        required: true
    },
    consultancy_state: {
        type: String,
        required: true
    },
    consultancy_address: {
        type: String,
        required: true
    },
    consultancy_details: {
        type: String,
        required: true
    }


});


const Consultancy = mongoose.model("consultancy", ConsultancySchema);


module.exports = Consultancy;
