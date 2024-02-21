const mongoose = require('mongoose');
const { Schema } = mongoose;


const ExpensesSchema = new Schema({
   expenses_id:{
        type: String,
        required: true
   },
   expenses_purpose:{
        type: String,
        required: true,
        unique: true
    },
    expenses_bill:{
        type: String,
        required: true
    },
    expenses_amount:{
        type: String,
        required: true
    },
    expenses_voucher:{
        type: String,
        required: true
    },
    expenses_remark:{
        type: String,
        required: true
    },
    expenses_by_cash:{
        type: String,
        required: true
    },
    expenses_by_cheque:{
        type: String,
        required: true
    },
    expenses_cash_recieved_by:{
        type: String,
        required: true
    }
});


const Expenses = mongoose.model('expenses', ExpensesSchema);
module.exports = Expenses;
