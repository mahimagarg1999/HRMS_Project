const employeeController = require("../controllers/Employee.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(employeeController.list)
router.route('/create')
    .post(employeeController.create)
router.route('/edit')
    .put(employeeController.edit)
router.route('/delete')
    .delete(employeeController.delete);

router.route('/multi-employee')
    .delete(employeeController.multidelete)
// router.route('/export')
//     .delete(employeeController.export)

module.exports = router;                                                                                                                     