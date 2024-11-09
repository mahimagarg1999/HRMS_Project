const profileController = require("../controllers/Profile.controller")
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
    .get(profileController.list)
router.route('/create')
    .post(profileController.create)
router.route('/edit')
    .put(profileController.edit)
router.route('/delete')
    .delete(profileController.delete);
router.route('/multi-delete')
    .delete(profileController.multidelete)
router.route('/get')
    .get(profileController.getProfileById)
router.route('/search').get(profileController.search)
router.route('/sortorder').get(profileController.sortOrder)
router.route('/export-data').post(profileController.export)
router.route('/import-data').post(upload.single('file'), profileController.import)


module.exports = router;                                                                                                                     