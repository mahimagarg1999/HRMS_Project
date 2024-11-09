const codeBankController = require("../controllers/CodeBank.controller")
const express = require("express");
const router = express.Router();
router.route('/list')
    .get(codeBankController.list)
router.route('/create')
    .post(codeBankController.create)
router.route('/edit')
    .put(codeBankController.edit)
     
router.route('/delete')
    .delete(codeBankController.delete);

router.route('/multi-delete')
    .delete(codeBankController.multidelete)
router.route('/get')
    .get(codeBankController.getCodeBankById)

router.route('/search').get(codeBankController.search)
router.route('/sortorder').get(codeBankController.sortOrder)


module.exports = router;                                                                                                                     