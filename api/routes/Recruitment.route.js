const recruitmentController = require("../controllers/Recruitment.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(recruitmentController.recruitmentList)
router.route('/create')
    .post(recruitmentController.recruitmentCreate)
router.route('/edit')
    .put(recruitmentController.recruitmentEdit)
router.route('/delete')
    .delete(recruitmentController.recruitmentDelete);
router.route('/multi-delete')
    .delete(recruitmentController.recruitmentMultidelete)
router.route('/get')
    .get(recruitmentController.getRecruitmentById)
router.route('/search').get(recruitmentController.searchRecruitment)
router.route('/sortorder').get(recruitmentController.sortOrder)
router.route('/get_profile').get(recruitmentController.getAllProfiles)
router.route('/get_profile_key').get(recruitmentController.getAllProfilesData)
router.route('/recruitment-candidate').get(recruitmentController.getRecruitmentCandidateData)
module.exports = router;                                                                                                                     