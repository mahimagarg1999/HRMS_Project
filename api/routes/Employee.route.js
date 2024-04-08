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

router.route('/multi-delete')
    .delete(employeeController.multidelete)

router.route('/get')
    .get(employeeController.getEmployeeById)
// router.route('/export')
//     .delete(employeeController.export)

module.exports = router;                                                                                                                     