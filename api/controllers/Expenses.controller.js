const manageExpensesModel = require("../models/Expenses.model")
const status = require("../config/status");
const path = require("path")
const fs = require('fs'); // Importing fs with promises
const csv = require('csv-parser');

//add expenses
let transactionCount = 0; // Initialize transaction count
exports.create = async (req, res) => {
    try {
        transactionCount++;

        const currentDate = new Date();
        const day = String(currentDate.getDate()).padStart(2, '0');
        const month = String(currentDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const year = currentDate.getFullYear();
        // const transaction_id = `E${transactionCount}-${day}${month}${year}-${hours}${minutes}${seconds}`;
        const transaction_id = `E${transactionCount}-${day}${month}${year}`
        // Create an object to save in the database
        const obj = {
            transaction_id: transaction_id,
            expenses_purpose: capitalizeWords(req.body.expenses_purpose),
            expenses_bill: req.body.expenses_bill,
            expenses_amount: req.body.expenses_amount,
            expenses_voucher: req.body.expenses_voucher,
            expenses_remark: req.body.expenses_remark,
            expenses_by_cash: req.body.expenses_by_cash,
            expenses_by_cheque: req.body.expenses_by_cheque,
            expenses_cash_received_by: req.body.expenses_cash_received_by,
            date_of_expenses: req.body.date_of_expenses,
        };

        // Create a new instance of manageExpensesModel and save to database
        const newmanageExpensesModel = new manageExpensesModel(obj);
        const result = await newmanageExpensesModel.save();

        // Respond with success message
        res.json({ success: true, status: 200, msg: 'Adding Expenses is successful.', data: result });
    } catch (err) {
        console.error("Error adding expenses:", err);
        // Respond with error message
        res.status(500).json({ success: false, status: 500, err: err.message, msg: 'Adding Expenses failed.' });
    }
}
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
        let result = await manageExpensesModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    // expenses_id:req.body.expenses_id,
                    expenses_purpose: capitalizeWords(req.body.expenses_purpose),
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
        const results = await manageExpensesModel.find(searchQuery);

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
            await manageExpensesModel.insertMany(results); // Adjust according to your schema
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
  