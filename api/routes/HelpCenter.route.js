const helpCenterController = require("../controllers/HelpCenter.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(helpCenterController.list)
router.route('/create')
    .post(helpCenterController.create)
router.route('/edit')
    .put(helpCenterController.edit)
    router.route('/edit-patch')
    .patch(helpCenterController.editPatch)
router.route('/delete')
    .delete(helpCenterController.delete);

router.route('/multi-delete')
    .delete(helpCenterController.multidelete)
router.route('/get')
    .get(helpCenterController.getHelpCenterById)

router.route('/get_emp_id')
    .get(helpCenterController.getDataByEmpId)
router.route('/search').get(helpCenterController.search)
router.route('/sortorder').get(helpCenterController.sortOrder)


module.exports = router;                                                                                                                     