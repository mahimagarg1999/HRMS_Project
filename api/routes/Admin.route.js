const adminController = require("../controllers/Admin.controller")
const express = require("express");
const router = express.Router();

router.route('/list')
    .get(adminController.list)
router.route('/create')
    .post(adminController.create)
router.route('/edit')
    .put(adminController.edit)
router.route('/delete')
    .delete(adminController.delete);

router.route('/multi-delete')
    .delete(adminController.multidelete)

module.exports = router;                                                                                             