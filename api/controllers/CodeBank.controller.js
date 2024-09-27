const managecodebankModel = require("../models/CodeBank.model")
const status = require("../config/status");
const fs = require("fs")
const path = require("path")
function capitalizeWords(str) {
    if (typeof str !== 'string') return str; // Return the input if it's not a string
    return str.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}
//add managecodebankModel
// exports.create = async (req, res) => {
//     console.log("code bank test")
//     try {
//         var uploadDir = process.cwd() + '/public/';
//         var codebankUploadDir = uploadDir + "codebank/file/";

//         if (!fs.existsSync(codebankUploadDir)) {
//             fs.mkdirSync(codebankUploadDir, { recursive: true });
//         }
//         let codebankPromise = await new Promise(async function (resolve, reject) {
//             var codebankPdfFile = req.body.code_file;

//             if (codebankPdfFile) {
//                 var codebankPdfName = req.body.codebankPdfName;
//                 var current_time = new Date().getTime();
//                 var fileName = current_time;
//                 var extension = codebankPdfName.split('.').pop().toLowerCase();
//                 var finalname = fileName + "." + extension;
//                 if (extension == 'pdf') {
//                     var base64Data = codebankPdfFile.replace(/^data:application\/pdf;base64,/, "");
//                     const buffer = Buffer.from(base64Data, 'base64');
//                     if (buffer.length > 0) {
//                         await fs.writeFileSync(codebankUploadDir + finalname, base64Data, 'base64');
//                         resolve({ status: 'true', finalname: finalname, fileExt: extension });
//                     } else {
//                         resolve({ status: 'true', finalname: '', fileExt: '' });
//                     }
//                 } else {
//                     resolve({ status: 'true', finalname: '', fileExt: '' });
//                 }
//             } else {
//                 resolve({ status: 'true', finalname: '', fileExt: '' });
//             }
//         });
//         if (codebankPromise.status == 'true') {
//             let codebankFinalname = codebankPromise.finalname;
//             var codebankFullPdfUrl = '';
//             if (codebankFinalname != '') {
//                 codebankFullPdfUrl = "codebank/file/" + codebankFinalname;
//             }
//             var obj = {
//                 skills: req.body.skills,
//                 title: req.body.title,
//                 code: req.body.code,
//                 code_file: codebankFullPdfUrl,

//             };
//             const newmanagecodebankModel= new managecodebankModel(obj);
//             let result = await newmanagecodebankModel.save();

//             res.json({ success: true, status: status.CREATED, msg: 'Code Bank is created successfully.' });
//         }
//     }
//     catch (err) {
//         console.log("errr", err)
//              return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
//     }
// }

exports.create = async (req, res) => {
    console.log("code bank test");
    try {
        const uploadDir = path.join(process.cwd(), 'public');
        const codebankUploadDir = path.join(uploadDir, 'codebank', 'file');

        if (!fs.existsSync(codebankUploadDir)) {
            fs.mkdirSync(codebankUploadDir, { recursive: true });
        }

        const codebankPdfFile = req.body.code_file;
        if (codebankPdfFile) {
            const codebankPdfName = req.body.codebankPdfName;
            const currentTime = new Date().getTime();
            const fileName = currentTime;
            const extension = codebankPdfName.split('.').pop().toLowerCase();
            const finalName = `${fileName}.${extension}`;

            if (['pdf', 'txt','zip'].includes(extension)) {
                const base64Data = codebankPdfFile.replace(/^data:.*;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');

                if (buffer.length > 0) {
                    fs.writeFileSync(path.join(codebankUploadDir, finalName), buffer);

                    const codebankFullFileUrl = `codebank/file/${finalName}`;
                    const obj = {
                        skills: req.body.skills,
                        title: req.body.title,
                        code: req.body.code,
                        code_file: codebankFullFileUrl,
                    };

                    const newManageCodebankModel = new managecodebankModel(obj);
                    await newManageCodebankModel.save();

                    return res.json({ success: true, status: status.CREATED, msg: 'Code Bank is created successfully.' });
                }
            } else {
                return res.json({ success: false, status: status.BAD_REQUEST, msg: 'Invalid file type. Only PDF and TXT files are allowed.' });
            }
        } else {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'No file provided.' });
        }
    } catch (err) {
        console.log("Error:", err);
        return res.json({ success: false, status: status.BAD_REQUEST, msg: 'An error occurred while creating the Code Bank.' });
    }
};

//update by id
 
// exports.edit = async (req, res) => {
//     console.log("code bank test");
//     try {
//         const codebankId = req.body.id;
//         if (!codebankId) {
//             return res.status(400).json({ success: false, msg: 'Code bank ID is required for update.' });
//         }
//         const existingCodeBank = await managecodebankModel.findById(codebankId);
//         if (!existingCodeBank) {
//             return res.status(404).json({ success: false, msg: 'Code bank not found.' });
//         }
//         const uploadDir = path.join(process.cwd(), 'public');
//         const codebankUploadDir = path.join(uploadDir, 'codebank', 'file');

//         if (!fs.existsSync(codebankUploadDir)) {
//             fs.mkdirSync(codebankUploadDir, { recursive: true });
//         }

//         const codebankPdfFile = req.body.code_file;
//         if (codebankPdfFile) {
//             const codebankPdfName = req.body.codebankPdfName;
//             const currentTime = new Date().getTime();
//             const fileName = currentTime;
//             const extension = codebankPdfName.split('.').pop().toLowerCase();
//             const finalName = `${fileName}.${extension}`;

//             if (['pdf', 'txt'].includes(extension)) {
//                 const base64Data = codebankPdfFile.replace(/^data:.*;base64,/, "");
//                 const buffer = Buffer.from(base64Data, 'base64');

//                 if (buffer.length > 0) {
//                     fs.writeFileSync(path.join(codebankUploadDir, finalName), buffer);
                    
//                     const codebankFullFileUrl = `codebank/file/${finalName}`;
//                     const obj = {
//                         skills: req.body.skills,
//                         title: req.body.title,
//                         code: req.body.code,
//                         code_file: codebankFullFileUrl,
//                     };
//                     const updatedCodeBank = await managecodebankModel.findByIdAndUpdate(
//                         codebankId,
//                         { $set: obj },
//                         { new: true } // Return the updated document
//                     );
                    

//                     res.json({ success: true, msg: 'Code Bank updated successfully.', codebank: updatedCodeBank });
//                 }
//             } else {
//                 return res.json({ success: false, status: status.BAD_REQUEST, msg: 'Invalid file type. Only PDF and TXT files are allowed.' });
//             }
//         } else {
//             return res.json({ success: false, status: status.BAD_REQUEST, msg: 'No file provided.' });
//         }
//     } catch (err) {
//         console.log("Error:", err);
//         return res.json({ success: false, status: status.BAD_REQUEST, msg: 'An error occurred while creating the Code Bank.' });
//     }
// };
exports.edit = async (req, res) => {
    console.log("code bank test");
    try {
        const codebankId = req.body.id;
        if (!codebankId) {
            return res.status(400).json({ success: false, msg: 'Code bank ID is required for update.' });
        }

        const existingCodeBank = await managecodebankModel.findById(codebankId);
        if (!existingCodeBank) {
            return res.status(404).json({ success: false, msg: 'Code bank not found.' });
        }

        const uploadDir = path.join(process.cwd(), 'public');
        const codebankUploadDir = path.join(uploadDir, 'codebank', 'file');

        if (!fs.existsSync(codebankUploadDir)) {
            fs.mkdirSync(codebankUploadDir, { recursive: true });
        }

        let codeFileUrl = existingCodeBank.code_file; // Default to existing file URL

        const codebankPdfFile = req.body.code_file;
        const codebankPdfName = req.body.codebankPdfName;

        if (codebankPdfFile && codebankPdfName) {
            const currentTime = new Date().getTime();
            const fileName = currentTime;
            const extension = codebankPdfName.split('.').pop().toLowerCase();
            const finalName = `${fileName}.${extension}`;

            if (['pdf', 'txt'].includes(extension)) {
                const base64Data = codebankPdfFile.replace(/^data:.*;base64,/, "");
                const buffer = Buffer.from(base64Data, 'base64');

                if (buffer.length > 0) {
                    fs.writeFileSync(path.join(codebankUploadDir, finalName), buffer);
                    codeFileUrl = `codebank/file/${finalName}`; // Update URL with new file
                } else {
                    return res.status(400).json({ success: false, msg: 'File buffer is empty.' });
                }
            } else {
                return res.status(400).json({ success: false, msg: 'Invalid file type. Only PDF and TXT files are allowed.' });
            }
        }

        // Update the code bank entry
        const obj = {
            skills: req.body.skills || existingCodeBank.skills,
            title: req.body.title || existingCodeBank.title,
            code: req.body.code || existingCodeBank.code,
            code_file: codeFileUrl, // Use updated file URL if new file provided
        };

        const updatedCodeBank = await managecodebankModel.findByIdAndUpdate(
            codebankId,
            { $set: obj },
            { new: true } // Return the updated document
        );

        res.json({ success: true, msg: 'Code Bank updated successfully.', codebank: updatedCodeBank });
    } catch (err) {
        console.log("Error:", err);
        return res.status(500).json({ success: false, msg: 'An error occurred while updating the Code Bank.' });
    }
};



//get all users 
exports.list = async (req, res) => {
    try {
        const data = await managecodebankModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get CodeBank failed.' });

    }
}
exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await managecodebankModel.aggregate([
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
        let result = await managecodebankModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'CodeBank is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'CodeBank Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete CodeBank data failed.' });

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
        let result = await managecodebankModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'CodeBank data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete CodeBank data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}

exports.getCodeBankById = async (req, res) => {
    try {
        let codebankid = req.query.codebankid;
        // const ID = req.query.userid;
        if (codebankid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await managecodebankModel.findOne({ _id: codebankid }).lean().exec();
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
                { skills: { $regex: new RegExp(query, "i") } },
                { title: { $regex: new RegExp(query, "i") } },
                { code: { $regex: new RegExp(query, "i") } }
            ]
        };
        // Check if the query contains both first and last names

        // Perform search using Mongoose's find method
        const results = await managecodebankModel.find(searchQuery);

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}


