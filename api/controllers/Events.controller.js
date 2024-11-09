const eventModel = require("../models/Events.model")
const status = require("../config/status");
const employeeModel = require("../models/Employee.model")
const meetingModel = require("../models/Meeting.model")

exports.create = async (req, res) => {
    try {
        const obj = {
            eventName: req.body.eventName,
            eventDate: req.body.eventDate,
            eventTime: req.body.eventTime,
            eventDescription: req.body.eventDescription,
            eventLocation: req.body.eventLocation,
            participants: req.body.participants,
            status: req.body.status,

        };
        // Create a new instance of manageSkillsModel and save to database
        const neweventModel = new eventModel(obj);
        const result = await neweventModel.save();

        // Respond with success message
        res.json({ success: true, status: 200, msg: 'Adding Event is successful.', data: result });
    } catch (err) {
        console.error("Error adding Skills:", err);
        // Respond with error message
        res.status(500).json({ success: false, status: 500, err: err.message, msg: 'Adding Skills failed.' });
    }
}

exports.edit = async (req, res) => {
    var id = req.body._id;
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id;
    try {
        let result = await eventModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    eventName: req.body.eventName,
                    eventDate: req.body.eventDate,
                    eventTime: req.body.eventTime,
                    eventDescription: req.body.eventDescription,
                    eventLocation: req.body.eventLocation,
                    participants: req.body.participants,
                    status: req.body.status,

                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Events is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Events Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Events failed.' });

    }
}

exports.list = async (req, res) => {
    try {
        const data = await eventModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Event failed.' });

    }
}

exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await eventModel.aggregate([
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
        let result = await eventModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Events is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Events Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Events data failed.' });

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
        let result = await eventModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Events data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Events data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}

exports.getEventsById = async (req, res) => {
    try {
        let eventid = req.query.eventid;
        if (eventid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await eventModel.findOne({ _id: eventid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Events failed.' });
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
        const isValidDate = !isNaN(parsedDate.getTime());

        // Build the search query
        const searchQuery = {
            $or: [
                { eventName: { $regex: new RegExp(query, "i") } },

                { eventDescription: { $regex: new RegExp(query, "i") } },
                { eventLocation: { $regex: new RegExp(query, "i") } },
                ...(isValidDate ? [{ eventDate: parsedDate }] : []),
            ]
        };

        console.log("Search Query:", JSON.stringify(searchQuery, null, 2)); // Debugging line
        const results = await eventModel.find(searchQuery);
        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
};



// get event by date
exports.getEvent = async (req, res) => {
    try {
        const data = await eventModel.find({}).select("id eventName eventDate eventTime eventLocation eventDescription").lean().exec();
        return res.json({ data: data, success: true, status: status.OK, msg: 'Get Birthday Successfully.' });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Birthday failed.' });

    }
}

// exports.getCalenderAll = async (req, res) => {
//     try {
//         const events = await eventModel.find({}).select("id eventName eventDate eventTime eventLocation eventDescription").lean().exec();
//         const meetings = await meetingModel.find({})
//             .select("id title scheduledDate startTime endTime location meetingTo meetingWith")
//             .populate('meetingTo', 'employee_first_name employee_last_name') // Populate meetingTo
//             .populate('meetingWith', 'employee_first_name employee_last_name') // Populate meetingWith
//             .lean()
//             .exec();
//         const birthdays = await employeeModel.find({}).select('employee_first_name employee_dob');

//         res.json({
//             events,
//             meetings,
//             birthdays: birthdays.map(employee => ({
//                 name: employee.employee_first_name,
//                 date: employee.employee_dob,
//             }))
//         });
//     } catch (error) {
//         res.status(500).json({ error: 'Error fetching calendar data' });
//     }
// }

exports.getCalenderAll = async (req, res) => {
    const { filterType } = req.query;  // Get the filterType from query params
    try {
        let data = {};

        if (filterType === 'event') {
            data.events = await eventModel.find({}).select("id eventName eventDate eventTime eventLocation eventDescription").lean().exec();
        } else if (filterType === 'meeting') {
            data.meetings = await meetingModel.find({})
                .select("id title scheduledDate startTime endTime location meetingTo meetingWith")
                .populate('meetingTo', 'employee_first_name employee_last_name') // Populate meetingTo
                .populate('meetingWith', 'employee_first_name employee_last_name') // Populate meetingWith
                .lean()
                .exec();
        } else if (filterType === 'birthday') {
            data.birthdays = await employeeModel.find({}).select('employee_first_name employee_dob');
            data.birthdays = data.birthdays.map(employee => ({
                name: employee.employee_first_name,
                date: employee.employee_dob,
            }));
        } else {
            // If filterType is not provided, fetch all data
            data.events = await eventModel.find({}).select("id eventName eventDate eventTime eventLocation eventDescription").lean().exec();
            data.meetings = await meetingModel.find({})
                .select("id title scheduledDate startTime endTime location meetingTo meetingWith")
                .populate('meetingTo', 'employee_first_name employee_last_name') // Populate meetingTo
                .populate('meetingWith', 'employee_first_name employee_last_name') // Populate meetingWith
                .lean()
                .exec();
            data.birthdays = await employeeModel.find({}).select('employee_first_name employee_dob');
            data.birthdays = data.birthdays.map(employee => ({
                name: employee.employee_first_name,
                date: employee.employee_dob,
            }));
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching filtered data' });
    }
};

// Express route to handle the filtered data request
exports.getCalenderFilterAll = async (req, res) => {
    const { filterType } = req.query;
    try {
        let data;

        if (filterType === 'event') {
            data = await Event.find(); // Fetch only event data
        } else if (filterType === 'meeting') {
            data = await Meeting.find(); // Fetch only meeting data
        } else if (filterType === 'birthday') {
            data = await Birthday.find(); // Fetch only birthday data
        } else {
            data = await Event.find(); // Fetch all data if no filter is applied
            data = data.concat(await Meeting.find(), await Birthday.find());
        }

        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching data' });
    }
};
