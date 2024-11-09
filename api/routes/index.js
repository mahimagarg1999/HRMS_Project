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
const candidatethirdparty = require("../routes/CandidateThirdParty.route")
const profileRoute = require("../routes/Profile.route")
const leaveRoute = require("../routes/Leave.route")
const codeBankRoute = require("../routes/CodeBank.route")
const eventRoute = require("../routes/Events.route")
const meetingRoute = require("../routes/Meeting.route")

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
router.use('/candidatethirdparty', candidatethirdparty);
router.use('/profiles', profileRoute);
router.use('/leave', leaveRoute);
router.use('/codebank', codeBankRoute);
router.use('/events',eventRoute)
router.use('/meeting',meetingRoute)


module.exports = router;