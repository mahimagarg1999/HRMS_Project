const leaveController = require("../controllers/Leave.controller")
const express = require("express");
const router = express.Router();
router.route('/list')
    .get(leaveController.list)
router.route('/create')
    .post(leaveController.create)   
router.route('/edit')
    .put(leaveController.edit)
router.route('/delete')
    .delete(leaveController.delete);
router.route('/multi-delete')
    .delete(leaveController.multidelete)
router.route('/get')
    .get(leaveController.getLeaveById)
// router.route('/search').get(leaveController.search)
router.route('/sortorder').get(leaveController.sortOrder)

module.exports = router;                                                                                                                     