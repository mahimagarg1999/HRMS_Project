const manageHelpCenterModel = require("../models/HelpCenter.model")
const status = require("../config/status");

//add manageHelpCenterModel
exports.create = async (req, res) => {
    try {
        var obj = {
            helpcenter_employee_id: req.body.helpcenter_employee_id,
            helpcenter_ticket_description: req.body.helpcenter_ticket_description,
            helpcenter_ticket_priority: req.body.helpcenter_ticket_priority,
            helpcenter_ticket_department: req.body.helpcenter_ticket_department,
            helpcenter_ticket_created_date: req.body.helpcenter_ticket_created_date,
            helpcenter_ticket_status: req.body.helpcenter_ticket_status,
            helpcenter_ticket_solved_date: req.body.helpcenter_ticket_solved_date,
            helpcenter_ticket_solved_by: req.body.helpcenter_ticket_solved_by,
            helpcenter_ticket_managed_by: req.body.helpcenter_ticket_managed_by,
            helpcenter_ticket_managed_by: req.body.helpcenter_ticket_managed_by,
            helpcenter_ticket_id: 'emp'+req.body.helpcenter_employee_id,
            helpcenter_employee_code:req.body.employee_code

        }
        console.log('obj',obj)
        const newmanageHelpCenterModel = new manageHelpCenterModel(obj);
        let result = await newmanageHelpCenterModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding HelpCenter is successfully.' });

    }
    catch (err) {
        console.log("err", err)
        // if (err.code === 11000 && err.keyPattern && err.keyPattern.helpcenter_ticket_id) {
        //     // If the error is due to a duplicate email (code 11000 is for duplicate key error)
        //     return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This helpcenter employee id  is already registered.' });
        // } else {
        //     // For other errors
        //     return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Helpcenter failed.' });
        // }
    }
}


//update by id
exports.edit = async (req, res) => {
    var id = req.body._id;
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id;
    try {
        let result = await manageHelpCenterModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    helpcenter_ticket_id: req.body.helpcenter_ticket_id,
                    helpcenter_employee_id: req.body.helpcenter_employee_id,
                    helpcenter_ticket_description: req.body.helpcenter_ticket_description,
                    helpcenter_ticket_priority: req.body.helpcenter_ticket_priority,
                    helpcenter_ticket_department: req.body.helpcenter_ticket_department,
                    helpcenter_ticket_created_date: req.body.helpcenter_ticket_created_date,
                    helpcenter_ticket_status: req.body.helpcenter_ticket_status,
                    helpcenter_ticket_solved_date: req.body.helpcenter_ticket_solved_date,
                    helpcenter_ticket_solved_by: req.body.helpcenter_ticket_solved_by,
                    helpcenter_ticket_managed_by: req.body.helpcenter_ticket_managed_by,
                    // helpcenter_ticket1: req.body.helpcenter_ticket1,
                    // helpcenter_ticket2: req.body.helpcenter_ticket2,
                    // helpcenter_ticket3: req.body.helpcenter_ticket3,
                    // helpcenter_ticket4: req.body.helpcenter_ticket4,
                    // helpcenter_ticket5: req.body.helpcenter_ticket5,
                    // helpcenter_ticket6: req.body.helpcenter_ticket6,
                    // helpcenter_ticket7: req.body.helpcenter_ticket7,
                    // helpcenter_ticket8: req.body.helpcenter_ticket8,
                    // helpcenter_ticket9: req.body.helpcenter_ticket9,
                    // helpcenter_ticket10: req.body.helpcenter_ticket10,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'HelpCenter is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'HelpCenter Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update HelpCenter failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageHelpCenterModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get HelpCenter failed.' });

    }
}
exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await manageHelpCenterModel.aggregate([
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


 

//delete user by id
exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageHelpCenterModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'HelpCenter is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'HelpCenter Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete HelpCenter data failed.' });

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
        let result = await manageHelpCenterModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'HelpCenter data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete HelpCenter data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}

exports.getHelpCenterById = async (req, res) => {
    try {
        let helpcenterid = req.query.helpcenterid;
        // const ID = req.query.userid;
        if (helpcenterid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageHelpCenterModel.findOne({ _id: helpcenterid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Help Center failed.' });
    }
}

exports.getDataByEmpId = async (req, res) => {
    try {
        let helpcenterid = req.query.helpcenterempid;
        // const ID = req.query.userid;
        if (helpcenterid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageHelpCenterModel.findOne({ helpcenter_employee_id: helpcenterid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Help Center failed.' });
    }

}


exports.search = async (req, res) => {
    try {
        const query = req.query.search;

        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const searchQuery = {
            $or: [
                { helpcenter_ticket_solved_by: { $regex: new RegExp(query, "i") } },
                { helpcenter_ticket_managed_by: { $regex: new RegExp(query, "i") } },
                { helpcenter_ticket_status: { $regex: new RegExp(query, "i") } }
            ]
        };
        // Check if the query contains both first and last names
        if (query.includes(' ')) {
            const [ticketSolvedBy, ticketManagedBy] = query.split(' ');

            // Update search query to match both first and last names together
            searchQuery.$or.push({
                $and: [
                    { helpcenter_ticket_solved_by: { $regex: new RegExp(ticketSolvedBy, "i") } },
                    { helpcenter_ticket_managed_by: { $regex: new RegExp(ticketManagedBy, "i") } }
                ]
            });
        }
        // Perform search using Mongoose's find method
        const results = await manageHelpCenterModel.find(searchQuery);

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}


