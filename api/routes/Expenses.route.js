const expensesController = require("../controllers/Expenses.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(expensesController.list)
router.route('/create')
    .post(expensesController.create)
router.route('/edit')
    .put(expensesController.edit)
router.route('/delete')
    .delete(expensesController.delete);

router.route('/multi-delete')
    .delete(expensesController.multidelete)
router.route('/get')
    .get(expensesController.getExpensesById)
// router.route('/export')
//     .delete(employeeController.export)
module.exports = router;                                                                                                                     