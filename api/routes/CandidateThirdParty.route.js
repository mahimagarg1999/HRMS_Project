const candidatethirdpartyController = require("../controllers/CandidateThirdParty.controller")
const express = require("express");
const router = express.Router();
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
// third party api
router.route('/listing').get(candidatethirdpartyController.listing)
router.route('/listing_data/:id').get(candidatethirdpartyController.candidatebyapigetDataById)
router.route('/deleting').delete(candidatethirdpartyController.deleteThirdParty)
router.route('/export-data').post(candidatethirdpartyController.export)
router.route('/import-data').post(upload.single('file'), candidatethirdpartyController.import)
router.route('/search').get(candidatethirdpartyController.search)
router.route('/send-mail').post(candidatethirdpartyController.sendEmail);
router.route('/edit').put(candidatethirdpartyController.edit)
module.exports = router;                                                                                             