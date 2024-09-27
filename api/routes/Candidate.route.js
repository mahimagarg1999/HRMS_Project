const candidateController = require("../controllers/Candidate.controller")
const express = require("express");
const router = express.Router();
const path = require('path')
const multer = require('multer');
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
    .get(candidateController.list)
router.route('/create')
    .post(candidateController.create)
router.route('/edit')
    .put(candidateController.edit)
router.route('/delete')
    .delete(candidateController.delete);
router.route('/multi-delete')
    .delete(candidateController.multidelete)
router.route('/get')
    .get(candidateController.getCandidateById)
router.route('/getprofile').get(candidateController.getProfileById)
router.route('/search').get(candidateController.search)
router.route('/sortorder').get(candidateController.sortOrder)
router.route('/export-data').post(candidateController.export)
router.route('/import-data').post(upload.single('file'), candidateController.import)
router.route('/search-advance').get(candidateController.searchAdvance)
router.route('/send-mail').post(candidateController.sendEmail);

module.exports = router;                                                                                             