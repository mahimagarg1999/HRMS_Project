const emphelpCenterController = require("../controllers/EMPHelpCenter.controller")
const express = require("express");
const router = express.Router();

router.route('/emp_helpcenter_list')
    .get(emphelpCenterController.emphelpcenterlist)
router.route('/emp_helpcenter_create')
    .post(emphelpCenterController.emphelpcentercreate)
router.route('/emp_helpcenter_edit')
    .put(emphelpCenterController.emphelpcenteredit)
router.route('/emp_helpcenter_edit-patch')
    .patch(emphelpCenterController.emphelpcentereditPatch)
router.route('/emp_helpcenter_delete')
    .delete(emphelpCenterController.emphelpcenterdelete);

router.route('/emp_helpcenter_multi-delete')
    .delete(emphelpCenterController.emphelpcentermultidelete)
router.route('/emp_helpcenter_get')
    .get(emphelpCenterController.emphelpcentergetHelpCenterById)

router.route('/emp_helpcenter_get_emp_id')
    .get(emphelpCenterController.emphelpcentergetDataByEmpId)
router.route('/emp_helpcenter_search').get(emphelpCenterController.emphelpcentersearch)
router.route('/emp_helpcenter_sortorder').get(emphelpCenterController.emphelpcentersortOrder)


module.exports = router;                                                                                                                     