const skillsController = require("../controllers/Skills.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(skillsController.list)
router.route('/create')
    .post(skillsController.create)
router.route('/edit')
    .put(skillsController.edit)
router.route('/delete')
    .delete(skillsController.delete);

router.route('/multi-delete')
    .delete(skillsController.multidelete)
router.route('/get')
    .get(skillsController.getSkillsById)
router.route('/search').get(skillsController.search)
router.route('/sortorder').get(skillsController.sortOrder)
router.route('/get_skills').get(skillsController.getAllSkills)
router.route('/getskillbyprofile').get(skillsController.getSkillsByProfile)


module.exports = router;                                                                                                                     