const express = require('express');
const multer = require('multer');
const path = require('path');
const expensesOneModel = require("../models/Expenses_one.model")

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads'); // Destination folder for uploads
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // File naming
    }
});

const upload = multer({ storage: storage });
 exports.uploadImage = async (req, res) => {
    upload.single('image')(req, res, async (err) => {
        const { title, image_description } = req.body;
        const imagePath = req.file.path;

        // Create a new image document
        const newImage = new expensesOneModel({
            title,
            image: imagePath,
            image_description
        });

        // Save the image document to the database
        try {
            // Save the image document to the database
            await newImage.save();
            res.send('Image uploaded successfully');
          } catch (err) {
            res.status(500).send(err);
          }
    });
}
