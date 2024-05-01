const manageConsultancyModel = require("../models/Consultancy.model")
const status = require("../config/status");
const fs = require('fs'); // Importing fs with promises

function capitalizeWords(str) {
    if (typeof str !== 'string') return str; // Return the input if it's not a string
    return str.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}
exports.create = async (req, res) => {
    console.log("expenses test")
    try {
        var uploadDir = process.cwd() + '/public/';
        var agreementUploadDir = uploadDir + "consultancy/agreement/";

        if (!fs.existsSync(agreementUploadDir)) {
            fs.mkdirSync(agreementUploadDir, { recursive: true });
        }
        let agreementPromise = await new Promise(async function (resolve, reject) {
            var agreementPdfFile = req.body.contract_agreement;

            if (agreementPdfFile) {
                var agreementPdfName = req.body.agreementPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = agreementPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = agreementPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(agreementUploadDir + finalname, base64Data, 'base64');
                        resolve({ status: 'true', finalname: finalname, fileExt: extension });
                    } else {
                        resolve({ status: 'true', finalname: '', fileExt: '' });
                    }
                } else {
                    resolve({ status: 'true', finalname: '', fileExt: '' });
                }
            } else {
                resolve({ status: 'true', finalname: '', fileExt: '' });
            }
        });
        if (agreementPromise.status == 'true') {
            let agreementFinalname = agreementPromise.finalname;
            var agreementFullPdfUrl = '';
            if (agreementFinalname != '') {
                agreementFullPdfUrl = "consultancy/agreement/" + agreementFinalname;
            }
            var obj = {
                consultancy_name: capitalizeWords(req.body.consultancy_name),
                consultancy_email: req.body.consultancy_email,
                consultancy_website: req.body.consultancy_website,
                consultancy_mobile: req.body.consultancy_mobile,
                consultancy_alternate_mobile: req.body.consultancy_alternate_mobile,
                consultancy_city: capitalizeWords(req.body.consultancy_city),
                consultancy_state: req.body.consultancy_state,
                consultancy_address: req.body.consultancy_address,
                contract_agreement:agreementFullPdfUrl,
                contract_person_name:req.body.contract_person_name,
                contract_linkedIn_Profile:req.body.contract_linkedIn_Profile
            };
            const newmanageConsultancyModel = new manageConsultancyModel(obj);
            let result = await newmanageConsultancyModel.save();

            res.json({ success: true, status: status.CREATED, msg: 'Consultancy is created successfully.' });
        }


    }
    catch (err) {
        console.log("errr", err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.consultancy_email) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else {
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Consultancy failed.' });
        }
    }
}


// exports.create = async (req, res) => {
//     console.log("expenses test")
//     try {
//         var obj = {
//              consultancy_name: req.body.consultancy_name,
//             consultancy_email: req.body.consultancy_email,
//             consultancy_website: req.body.consultancy_website,
//             consultancy_mobile: req.body.consultancy_mobile,
//             consultancy_alternate_mobile: req.body.consultancy_alternate_mobile,
//             consultancy_city: req.body.consultancy_city,
//             consultancy_state: req.body.consultancy_state,
//             consultancy_address: req.body.consultancy_address,
//             contract_agreement: req.body.contract_agreement,
//         }
//         const newmanageConsultancyModel = new manageConsultancyModel(obj);
//         let result = await newmanageConsultancyModel.save();
//         res.json({ success: true, status: status.OK, msg: 'Adding Consultancy is successfully.' });

//     }
//     catch (err) {
//         if (err.code === 11000 && err.keyPattern && err.keyPattern.consultancy_email) {
//              return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
//         } else {
//              return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Consultancy failed.' });
//         }
//     }
// }


//update by id
exports.edit = async (req, res) => {
    console.log("expenses test")
    try {
        const consultancyId = req.body.id;
        if (!consultancyId) {
            return res.status(400).json({ success: false, msg: 'Consultancy ID is required for update.' });
        }
        const existingConsultancy = await manageConsultancyModel.findById(consultancyId);
        if (!existingConsultancy) {
            return res.status(404).json({ success: false, msg: 'Consultancy not found.' });
        }
        var uploadDir = process.cwd() + '/public/';
        var agreementUploadDir = uploadDir + "consultancy/agreement/";

        if (!fs.existsSync(agreementUploadDir)) {
            fs.mkdirSync(agreementUploadDir, { recursive: true });
        }
        let agreementPromise = await new Promise(async function (resolve, reject) {
            var agreementPdfFile = req.body.contract_agreement;

            if (agreementPdfFile) {
                var agreementPdfName = req.body.agreementPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = agreementPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = agreementPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(agreementUploadDir + finalname, base64Data, 'base64');
                        resolve({ status: 'true', finalname: finalname, fileExt: extension });
                    } else {
                        resolve({ status: 'true', finalname: '', fileExt: '' });
                    }
                } else {
                    resolve({ status: 'true', finalname: '', fileExt: '' });
                }
            } else {
                resolve({ status: 'true', finalname: '', fileExt: '' });
            }
        });
        if (agreementPromise.status == 'true') {
            let agreementFinalname = agreementPromise.finalname;
            var agreementFullPdfUrl = '';
            if (agreementFinalname != '') {
                agreementFullPdfUrl = "consultancy/agreement/" + agreementFinalname;
            }
            var obj = {
                consultancy_name: capitalizeWords(req.body.consultancy_name),
                consultancy_email: req.body.consultancy_email,
                consultancy_website: req.body.consultancy_website,
                consultancy_mobile: req.body.consultancy_mobile,
                consultancy_alternate_mobile: req.body.consultancy_alternate_mobile,
                consultancy_city: capitalizeWords(req.body.consultancy_city),
                consultancy_state: req.body.consultancy_state,
                consultancy_address: req.body.consultancy_address,
                contract_agreement:agreementFullPdfUrl,
                contract_person_name:req.body.contract_person_name,
                contract_linkedIn_Profile:req.body.contract_linkedIn_Profile
            };
            const updatedConsultancy = await manageConsultancyModel.findByIdAndUpdate(
                consultancyId,
                { $set: obj },
                { new: true } // Return the updated document
            );
            // Respond with success message and updated Consultancy data
            res.json({ success: true, msg: 'Consultancy updated successfully.', consultancy: updatedConsultancy });
        }

    }
    catch (err) {
        console.log("errr", err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.consultancy_email) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else {
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Consultancy failed.' });
        }
    }
}

exports.list = async (req, res) => {
    try {
        const data = await manageConsultancyModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK, msg: 'Get Consultancy data successfully.' });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Consultancy failed.' });

    }
}

exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await manageConsultancyModel.aggregate([
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
        let result = await manageConsultancyModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Consultancy is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Consultancy Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Consultancy data failed.' });

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
        let result = await manageConsultancyModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Consultancy data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Consultancy data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        console.log("error", err)
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}



exports.getConsultancyById = async (req, res) => {
    try {
        let consultancyid = req.query.consultancyid;
        // const ID = req.query.userid;
        if (consultancyid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageConsultancyModel.findOne({ _id: consultancyid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Consultancy failed.' });
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
                { consultancy_name: { $regex: new RegExp(query, "i") } },
                { consultancy_email: { $regex: new RegExp(query, "i") } },
                { consultancy_mobile: { $regex: new RegExp(query, "i") } }

            ]
        };
        // Check if the query contains both first and last names
        // if (query.includes(' ')) {
        //     const [name, email] = query.split(' ');

        //     // Update search query to match both first and last names together
        //     searchQuery.$or.push({
        //         $and: [
        //             { consultancy_name: { $regex: new RegExp(name, "i") } },
        //          ]
        //     });
        // }
        // Perform search using Mongoose's find method
        const results = await manageConsultancyModel.find(searchQuery);

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}
