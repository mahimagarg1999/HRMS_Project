const manageExpensesModel = require("../models/Expenses.model")
const status = require("../config/status");

//add expenses
exports.create = async (req, res) => {
    console.log("expenses test")
    try {
        var obj = {
            // expenses_id:req.body.expenses_id,
            expenses_purpose: req.body.expenses_purpose,
            expenses_bill: req.body.expenses_bill,
            expenses_amount: req.body.expenses_amount,
            expenses_voucher: req.body.expenses_voucher,
            expenses_remark: req.body.expenses_remark,
            expenses_by_cash: req.body.expenses_by_cash,
            expenses_by_cheque: req.body.expenses_by_cheque,
            expenses_cash_recieved_by: req.body.expenses_cash_recieved_by,
            date_of_expenses: req.body.date_of_expenses
        }
        const newmanageExpensesModel = new manageExpensesModel(obj);
        let result = await newmanageExpensesModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Expenses is successfully.' });

    }
    catch (err) {
        console.log("err", err)
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Expenses  failed.' });

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
        let result = await manageExpensesModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    // expenses_id:req.body.expenses_id,
                    expenses_purpose: req.body.expenses_purpose,
                    expenses_bill: req.body.expenses_bill,
                    expenses_amount: req.body.expenses_amount,
                    expenses_voucher: req.body.expenses_voucher,
                    expenses_remark: req.body.expenses_remark,
                    expenses_by_cash: req.body.expenses_by_cash,
                    expenses_by_cheque: req.body.expenses_by_cheque,
                    expenses_cash_recieved_by: req.body.expenses_cash_recieved_by,
                    date_of_expenses: req.body.date_of_expenses

                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Expenses is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Expenses Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Expenses failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageExpensesModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Expenses failed.' });

    }
}

//delete user by id
exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageExpensesModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Expenses is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Expenses Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Expenses data failed.' });

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
        let result = await manageExpensesModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Expenses data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Expenses data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}


exports.getExpensesById = async (req, res) => {
    try {
        let expensesid = req.query.expensesid;
        // const ID = req.query.userid;
        if (expensesid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageExpensesModel.findOne({ _id: expensesid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Expenses failed.' });
    }

}
exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await manageExpensesModel.aggregate([
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
                { expenses_purpose: { $regex: new RegExp(query, "i") } },
                { expenses_amount: { $regex: new RegExp(query, "i") } },
                { expenses_voucher: { $regex: new RegExp(query, "i") } }

            ]
        };
        // Check if the query contains both first and last names
        // if (query.includes(' ')) {
        //     const [expensesPurpose, expensesAmount] = query.split(' ');

            // Update search query to match both first and last names together
            // searchQuery.$or.push({
            //     $and: [
            //         { expenses_purpose: { $regex: new RegExp(expensesPurpose, "i") } },
            //         { expenses_amount: { $regex: new RegExp(expensesAmount, "i") } }
            //     ]
            // });
        // }
        // Perform search using Mongoose's find method
        const results = await manageExpensesModel.find(searchQuery);

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}

