const helpCenterController = require("../controllers/HelpCenter.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(helpCenterController.list)
router.route('/create')
    .post(helpCenterController.create)
router.route('/edit')
    .put(helpCenterController.edit)
router.route('/delete')
    .delete(helpCenterController.delete);

router.route('/multi-delete')
    .delete(helpCenterController.multidelete)
router.route('/get')
    .get(helpCenterController.getHelpCenterById)
module.exports = router;                                                                                                                     