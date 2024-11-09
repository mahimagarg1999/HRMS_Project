const employeeController = require("../controllers/Employee.controller")
const express = require("express");
const router = express.Router();
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
    .get(employeeController.list)
router.route('/create')
    .post(employeeController.create)
router.route('/edit')
    .put(employeeController.edit)
router.route('/delete')
    .delete(employeeController.delete);
router.route('/multi-delete')
    .delete(employeeController.multidelete)
router.route('/get')
    .get(employeeController.getEmployeeById)
router.route('/changepassword')
    .put(employeeController.changePassword)
router.route('/search').get(employeeController.search)
router.route('/sortorder').get(employeeController.sortOrder)
router.route('/date')
    .get(employeeController.getdate)
router.route('/export-data').post(employeeController.export)
router.route('/import-data').post(upload.single('file'), employeeController.import)
router.route('/search-advance').get(employeeController.searchAdvance)
router.route('/send-mail').post(employeeController.sendEmail);
router.route('/get-dob')
    .get(employeeController.getBirthday)
    router.route('/get-emp-id-for-meeting')
    .get(employeeController.getAllEmployeeIdsForMeeting)
module.exports = router;                                                                                                                     