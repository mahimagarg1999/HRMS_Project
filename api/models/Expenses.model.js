const mongoose = require('mongoose');
const { Schema } = mongoose;


const ExpensesSchema = new Schema({
    expenses_purpose: {
        type: String,
        required: true,
    },
    expenses_bill: {
        type: String,
        required: true
    },
    expenses_amount: {
        type: String,
    },
    expenses_voucher: {
        type: String,
    },
    expenses_remark: {
        type: String,
    },
    expenses_by_cash: {
        type: String,
    },
    expenses_by_cheque: {
        type: String,
    },
    expenses_cash_recieved_by: {
        type: String,
    }
});


const Expenses = mongoose.model('expenses', ExpensesSchema);
module.exports = Expenses;
