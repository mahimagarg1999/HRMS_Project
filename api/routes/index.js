const express = require("express");
const employeeRoute = require("../routes/Employee.route")
const candidateRoute = require("../routes/Candidate.route")
const helpcenterRoute = require("../routes/HelpCenter.route")
const expensesRoute = require("../routes/Expenses.route")
const consultancyRoute = require("../routes/Consultancy.route")
const userRoute = require("../routes/user.route")
const recruitmentRoute = require("../routes/Recruitment.route")
const emphelpcenter = require("../routes/EMPHelpCenter.route")
const skills = require("../routes/Skills.route")


const router = express.Router();
router.use('/employee', employeeRoute);
router.use('/candidate', candidateRoute);
router.use('/helpcenter', helpcenterRoute);
router.use('/expenses', expensesRoute);
router.use('/consultancy', consultancyRoute);
router.use('/user', userRoute);
router.use('/recruitment', recruitmentRoute);

router.use('/emphelpcenter', emphelpcenter);
router.use('/skills', skills);


module.exports = router;