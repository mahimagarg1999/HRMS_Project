const express = require("express");
const employeeRoute = require("../routes/Employee.route")
const candidateRoute = require("../routes/Candidate.route")
const helpcenterRoute = require("../routes/HelpCenter.route")
const expensesRoute = require("../routes/Expenses.route")
const consultancyRoute = require("../routes/Consultancy.route")
const adminRoute = require("../routes/Admin.route")
const userRoute = require("../routes/user.route")

const router = express.Router();
router.use('/employee',employeeRoute);
router.use('/candidate',candidateRoute);
router.use('/helpcenter',helpcenterRoute);
router.use('/expenses',expensesRoute);
router.use('/consultancy',consultancyRoute);
router.use('/admin',adminRoute);
router.use('/user',userRoute);


module.exports = router;