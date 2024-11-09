const meetingModel = require("../models/Meeting.model")
const status = require("../config/status");
const manageEmployeeModel = require("../models/Employee.model")

exports.create = async (req, res) => {
    try {
        const obj = {
            title: req.body.title,
            description: req.body.description,
            scheduledDate: req.body.scheduledDate,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            location: req.body.location,
            participants: req.body.participants,
            status: req.body.status,
            meetingTo: req.body.meetingTo,
            meetingWith: req.body.meetingWith,
        };

        // Create a new meeting instance and save to the database
        const newMeetingModel = new meetingModel(obj);
        let result = await newMeetingModel.save();

        result = await result.populate([
            { path: 'meetingTo', select: 'employee_first_name employee_last_name' },
            { path: 'meetingWith', select: 'employee_first_name employee_last_name' }
        ]);

        res.json({ success: true, status: 200, msg: 'Adding Meeting is successful.', data: result });
    } catch (err) {
        console.error("Error adding Meeting:", err);
        res.status(500).json({ success: false, status: 500, err: err.message, msg: 'Adding Meeting failed.' });
    }
};



exports.edit = async (req, res) => {
    const id = req.body._id; // Use const instead of var for better practice
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id; // This line might not be necessary if you're not using req.query

    try {
        // Use findOneAndUpdate with { new: true } to return the updated document
        let result = await meetingModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    title: req.body.title,
                    description: req.body.description,
                    scheduledDate: req.body.scheduledDate,
                    startTime: req.body.startTime,
                    endTime: req.body.endTime,
                    location: req.body.location,
                    participants: req.body.participants,
                    status: req.body.status,
                    meetingTo: req.body.meetingTo,
                    meetingWith: req.body.meetingWith,
                }
            },
            { new: true } // This option returns the updated document
        ).populate([
            { path: 'meetingTo', select: 'employee_first_name employee_last_name' },
            { path: 'meetingWith', select: 'employee_first_name employee_last_name' }
        ]).lean(); // Use lean to get a plain JavaScript object instead of Mongoose document

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Meeting is updated successfully.', data: result });
        } else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Meeting Id not found' });
        }
    } catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err.message, msg: 'Update Meeting failed.' });
    }
}


exports.list = async (req, res) => {
    try {
        const data = await meetingModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Meeting failed.' });

    }
}

exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await meetingModel.aggregate([
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

exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await meetingModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Meeting is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Meeting Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Meeting data failed.' });

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
        let result = await meetingModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Meeting data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Meeting data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}

exports.getMeetingById = async (req, res) => {
    try {
        let meetingid = req.query.meetingid;
        if (meetingid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await meetingModel.findOne({ _id: meetingid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Meetings failed.' });
    }
}
 
exports.search = async (req, res) => {
    try {
        const query = req.query.search;

        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }

        // Attempt to parse the query as a date
        const parsedDate = new Date(query);
        const isValidDate = !isNaN(parsedDate.getTime()); // Check if it's a valid date

        // Build the search query
        const searchQuery = {
            $or: [
                { title: { $regex: new RegExp(query, "i") } },
                { description: { $regex: new RegExp(query, "i") } },
                { startTime: { $regex: new RegExp(query, "i") } },
                { endTime: { $regex: new RegExp(query, "i") } },
                { location: { $regex: new RegExp(query, "i") } },
                { status: { $regex: new RegExp(query, "i") } },
                // Only include scheduledDate if it's a valid date
                ...(isValidDate ? [{ scheduledDate: parsedDate }] : [])
            ]
        };

        console.log("Search Query:", JSON.stringify(searchQuery, null, 2)); // Debugging line

        const results = await meetingModel.find(searchQuery).populate('meetingTo').populate('meetingWith');

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
};



// get Meeting by date
exports.getMeeting = async (req, res) => {
    try {
        const data = await meetingModel.find({})
            .select("id title scheduledDate startTime endTime location meetingTo meetingWith")
            .populate('meetingTo', 'employee_first_name employee_last_name') // Populate meetingTo
            .populate('meetingWith', 'employee_first_name employee_last_name') // Populate meetingWith
            .lean()
            .exec();

        return res.json({ data: data, success: true, status: status.OK, msg: 'Get Meeting Successfully.' });
    } catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Meeting failed.' });
    }
}

