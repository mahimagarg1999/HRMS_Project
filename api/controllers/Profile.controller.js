const manageProfileModel = require("../models/Profile.model")
const status = require("../config/status");
const path = require("path")
const fs = require('fs'); // Importing fs with promises
const csv = require('csv-parser');
exports.create = async (req, res) => {
    try {
        // Find the last inserted profile_id and increment it
        const lastProfile = await manageProfileModel.findOne().sort({ profile_id: -1 }).exec();
        
        let newProfileId = "01"; // Default value for the first record

        if (lastProfile) {
            // Extract the numeric part and increment it
            let lastId = parseInt(lastProfile.profile_id, 10);
            newProfileId = (lastId + 1).toString().padStart(2, "0"); // Ensure it is always two digits
        }

        // Create an object to save in the database
        const obj = {
            profile: req.body.profile,
            profile_id: newProfileId,
        };

        // Create a new instance of manageProfileModel and save to database
        const newManageProfileModel = new manageProfileModel(obj);
        const result = await newManageProfileModel.save();

        // Respond with success message
        res.json({ success: true, status: 200, msg: 'Adding Profile is successful.', data: result });
    } catch (err) {
        console.error("Error adding Profile:", err);
        // Respond with error message
        res.status(500).json({ success: false, status: 500, err: err.message, msg: 'Adding Profile failed.' });
    }
};

function capitalizeWords(str) {
    if (typeof str !== 'string') return str; // Return the input if it's not a string
    return str.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}



//update by id
exports.edit = async (req, res) => {
    var id = req.body._id;
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id;
    try {
        let result = await manageProfileModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    profile_id: req.body.profile_id,
                    profile: req.body.profile,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Profile is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Profile Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Profile failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageProfileModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Profile failed.' });

    }
}

//delete user by id
exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageProfileModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Profile is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Profile Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Profile data failed.' });

    }
}

exports.multidelete = async (req, res) => {
    try {
        const ids = req.body.ids;

        // Check if the 'ids' parameter is not available or is not an array
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.json({ success: false, status: status.NOTFOUND, msg: "IDs parameter not available or invalid" });
        }

        // Use $in operator to match multiple IDs and delete them
        let result = await manageProfileModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Profile data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Profile data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}


exports.getProfileById = async (req, res) => {
    try {
        let profileid = req.query.profileid;
        // const ID = req.query.userid;
        if (profileid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageProfileModel.findOne({ _id: profileid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get profile failed.' });
    }

}
exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await manageProfileModel.aggregate([
            {
                $addFields: {
                    // Create a new field with the lowercase version of the column
                    lowercaseColumn: { $toLower: `$${columnName}` }
                }
            },
            { $sort: { lowercaseColumn: sortOrder } }, // Sort based on the lowercase field
            { $project: { lowercaseColumn: 0 } } // Exclude the lowercase field from the result
        ]);

        res.json(result);
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.search = async (req, res) => {
    try {
        const query = req.query.search;

        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const searchQuery = {
            $or: [
                { profile: { $regex: new RegExp(query, "i") } },
                { profile_id: { $regex: new RegExp(query, "i") } },
 
            ]
        };
        const results = await manageProfileModel.find(searchQuery);

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}

exports.export = async (req, res) => {
    const { csvData, filename } = req.body;
    if (!csvData || !filename) {
        console.error('Missing csvData or filename');
        return res.status(400).json({ error: 'Missing csvData or filename' });
    }
    const filePath = path.join(__dirname, 'download', filename);

    console.log(`Saving file to ${filePath}`); // Log the file path

    fs.writeFile(filePath, csvData, (err) => {
        if (err) {
            console.error('Failed to save file:', err); // Log error details
            return res.status(500).json({ error: 'Failed to save file' });
        }
        console.log('File saved successfully'); // Log success
        res.json({ message: 'File saved successfully', path: `/download/${filename}` });
    });
};


exports.import = async (req, res) => {
    console.log('File:', req.file);
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    console.log('File path:', filePath);

    try {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                try {
                    console.log('Parsed results:', results);
                    await manageProfileModel.insertMany(results); // Adjust according to your schema
                    res.status(200).json({ message: 'Data imported successfully' });
                } catch (error) {
                    console.error('Database error:', error);
                    res.status(500).json({ message: 'Error importing data', error });
                } finally {
                    fs.unlinkSync(filePath); // Clean up the uploaded file
                }
            });
    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ message: 'Error processing file', error });
    }
};
