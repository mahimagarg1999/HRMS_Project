const expensesController = require("../controllers/Expenses.controller")
const express = require("express");
const router = express.Router();
// import the data
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.route('/list')
    .get(expensesController.list)
router.route('/create')
    .post(expensesController.create)
router.route('/edit')
    .put(expensesController.edit)
router.route('/delete')
    .delete(expensesController.delete);
router.route('/multi-delete')
    .delete(expensesController.multidelete)
router.route('/get')
    .get(expensesController.getExpensesById)
router.route('/search').get(expensesController.search)
router.route('/sortorder').get(expensesController.sortOrder)
router.route('/export-data').post(expensesController.export)
router.route('/import-data').post(upload.single('file'), expensesController.import)


module.exports = router;                                                                                                                     