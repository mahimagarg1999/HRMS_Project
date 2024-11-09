const meetingController = require("../controllers/Meeting.controller")
const express = require("express");
 const router = express.Router();
router.route('/list')
    .get(meetingController.list)
router.route('/create')
    .post(meetingController.create)
router.route('/edit')
    .put(meetingController.edit)

router.route('/delete')
    .delete(meetingController.delete);

router.route('/multi-delete')
    .delete(meetingController.multidelete)
router.route('/get')
    .get(meetingController.getMeetingById)

router.route('/search').get(meetingController.search)
router.route('/sortorder').get(meetingController.sortOrder)
router.route('/get-meeting')
    .get(meetingController.getMeeting)

 
module.exports = router;                                                                                                                     