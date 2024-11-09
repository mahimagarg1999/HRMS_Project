const leaveModel = require("../models/Leave.model")
const status = require("../config/status");
 
exports.create = async (req, res) => {
    try {
        const obj = {
            employee_id: req.body.employee_id,
            leave_type: req.body.leave_type,
            start_date: req.body.start_date,
            end_date: req.body.end_date,
            reason: req.body.reason,
            status: req.body.status,
            applied_on: req.body.applied_on,
            approved_by: req.body.approved_by,
            comments: req.body.comments
        };

        // Create a new instance of manageSkillsModel and save to database
        const newleaveModel = new leaveModel(obj);
        const result = await newleaveModel.save();

        // Respond with success message
        res.json({ success: true, status: 200, msg: 'Adding Skills is successful.', data: result });
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
        let result = await leaveModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    employee_id: req.body.employee_id,
                    leave_type: req.body.leave_type,
                    start_date: req.body.start_date,
                    end_date: req.body.end_date,
                    reason: req.body.reason,
                    status: req.body.status,
                    applied_on: req.body.applied_on,
                    approved_by: req.body.approved_by,
                    comments: req.body.comments
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Leave is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Leave Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Leave failed.' });

    }
}

exports.list = async (req, res) => {
    try {
        const data = await leaveModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Leave failed.' });

    }
}

exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await leaveModel.aggregate([
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
        let result = await leaveModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Leave is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Leave Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Leave data failed.' });

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
        let result = await leaveModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Leave data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Leave data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}

     exports.getLeaveById = async (req, res) => {
        try {
            let leaveid = req.query.leaveid;
             if (leaveid === undefined) {
                return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
            }
            const data = await leaveModel.findOne({ _id: leaveid }).lean().exec();
            return res.json({ data: data, success: true, status: status.OK });
        }
        catch (err) {
            console.log("error", err);
            return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Leave failed.' });
        }
    
    }