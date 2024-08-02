const mongoose = require('mongoose');
const { Schema } = mongoose;

const SkillSchema = new mongoose.Schema({
    skills: { type: String, required: true },
    description: { type: String }
});

const Skills = mongoose.model('skills', SkillSchema);
module.exports = Skills;
