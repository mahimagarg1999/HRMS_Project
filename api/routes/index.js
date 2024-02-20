const express = require("express");
const employeeRoute = require("../routes/Employee.route")

const router = express.Router();
router.use('/employee',employeeRoute);

module.exports = router;