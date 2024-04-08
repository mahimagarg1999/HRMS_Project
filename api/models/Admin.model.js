const mongoose = require('mongoose');
const { Schema } = mongoose;


const AdminSchema = new Schema({
   admin_name:{
        type: String,
        required: true
   },
    admin_email:{
        type: String,
        required: true,
        unique: true
    },
     admin_password:{
        type: String,
        required: true
    },
     admin_city:{
        type: String,
        required: true
    },
     admin_state:{
        type: String,
        required: true
    },
     admin_address:{
        type: String,
        required: true
    },
     admin_phone:{
        type: String,
        required: true
    },
     admin_other_info:{
        type: String,
        required: true
    },
     admin_date:{
        type: Date,
        default: Date.now
    }
});


const Admin = mongoose.model("admin", AdminSchema);


 

module.exports = Admin;
