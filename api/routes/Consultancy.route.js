const consultancyController = require("../controllers/Consultancy.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(consultancyController.list)
router.route('/create')
    .post(consultancyController.create)
router.route('/edit')
    .put(consultancyController.edit)
router.route('/delete')
    .delete(consultancyController.delete);
router.route('/multi-delete')
    .delete(consultancyController.multidelete)
router.route('/get')
    .get(consultancyController.getConsultancyById)
router.route('/search').get(consultancyController.search)
router.route('/sortorder').get(consultancyController.sortOrder)
router.route('/send-mail').post(consultancyController.sendEmail);

module.exports = router;                                                                                             