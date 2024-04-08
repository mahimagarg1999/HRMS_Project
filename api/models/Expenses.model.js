const mongoose = require('mongoose');
const { Schema } = mongoose;


const ExpensesSchema = new Schema({
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
     },
    expenses_voucher:{
        type: String,
     },
    expenses_remark:{
        type: String,
     },
    expenses_by_cash:{
        type: Boolean,
     },
    expenses_by_cheque:{
        type: Boolean,
     },
    expenses_cash_recieved_by:{
        type: String,
     }
});


const Expenses = mongoose.model('expenses', ExpensesSchema);
module.exports = Expenses;
