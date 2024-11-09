const express = require('express');
const router = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const port = 5000;
const path = require("path")
const { MongoClient } = require('mongodb');
const multer = require('multer');


app.use(bodyParser.json({ limit: '50mb' })); // Limit set here
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true })); // Limit set here
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.use('/api', router);
app.use(express.static('public'));
app.use('/download', express.static(path.join(__dirname, 'download')));


mongoose.connect('mongodb://localhost:27017/HRMS', {
   serverSelectionTimeoutMS: 30000, // Set a higher timeout value (e.g., 30 seconds)

});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});






