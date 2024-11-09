const mongoose = require('mongoose');
const { Schema } = mongoose;

const CodeBankSchema = new Schema({
    skills: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    code: {
         type: String,
    },
    code_file: {
        type: String,
    },
});
const CodeBank = mongoose.model('codebank', CodeBankSchema);
module.exports = CodeBank;
