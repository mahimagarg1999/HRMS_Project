const eventsController = require("../controllers/Events.controller")
const express = require("express");
const router = express.Router();
router.route('/list')
    .get(eventsController.list)
router.route('/create')
    .post(eventsController.create)
router.route('/edit')
    .put(eventsController.edit)
     
router.route('/delete')
    .delete(eventsController.delete);

router.route('/multi-delete')
    .delete(eventsController.multidelete)
router.route('/get')
    .get(eventsController.getEventsById)

router.route('/search').get(eventsController.search)
router.route('/sortorder').get(eventsController.sortOrder)
router.route('/get-event')
    .get(eventsController.getEvent)
    router.route('/calendar/get-all')
    .get(eventsController.getCalenderAll)
    
    // router.route('/api/events/filter')
    // .get(eventsController.getCalenderFilterAll)
module.exports = router;                                                                                                                     