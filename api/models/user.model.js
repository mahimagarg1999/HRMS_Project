const mongoose = require('mongoose');
const { Schema } = mongoose;
// var connection = require('../config/mongo-connection');

const UserSchema = mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
    },
    email: { type: String, unique: true, required: true },
    password: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
    },
    gender: {
        type: String,
    },
    standard: {
        type: String,
    },
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    role: {
        type: String,
        default: 'user'

    },

},
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
    });
const UserData = mongoose.model('user', UserSchema);

module.exports = UserData;





