const candidateController = require("../controllers/Candidate.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(candidateController.list)
router.route('/create')
    .post(candidateController.create)
router.route('/edit')
    .put(candidateController.edit)
router.route('/delete')
    .delete(candidateController.delete);

router.route('/multi-delete')
    .delete(candidateController.multidelete)

// router.route('/export')
//     .delete(employeeController.export)
// router.route('/import')
//     .delete(employeeController.import)
module.exports = router;                                                                                             