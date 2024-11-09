const manageEmployeeModel = require("../models/Employee.model.js")
const status = require("../config/status");
const fs = require('fs'); // Importing fs with promises
const path = require('path');
const { resolveTxt } = require("dns/promises");
const nodemailer = require('nodemailer');

function isValidBase64(str) {
    try {
        return btoa(atob(str)) === str;
    } catch (err) {
        return false;
    }
}

function capitalizeWords(str) {
    if (typeof str !== 'string') return str; // Return the input if it's not a string
    return str.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}

exports.create = async (req, res) => {
    try {
        var uploadDir = process.cwd() + '/public/';
        var resumePdfUploadDir = uploadDir + "employee/resume_pdf/";
        var proofPdfUploadDir = uploadDir + "employee/proof_pdf/";
        var panPdfUploadDir = uploadDir + "employee/pan_card_pdf/";
        var expLetterPdfUploadDir = uploadDir + "employee/exe_letter_pdf/";
        var marksheetPdfUploadDir = uploadDir + "employee/marksheet_pdf/";
        var marksheetPdfUploadDir = uploadDir + "employee/marksheet_pdf/";
        var imageUploadDir = uploadDir + "employee/image/";

        if (!fs.existsSync(resumePdfUploadDir)) {
            fs.mkdirSync(resumePdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(proofPdfUploadDir)) {
            fs.mkdirSync(proofPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(panPdfUploadDir)) {
            fs.mkdirSync(panPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(expLetterPdfUploadDir)) {
            fs.mkdirSync(expLetterPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(marksheetPdfUploadDir)) {
            fs.mkdirSync(marksheetPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(imageUploadDir)) {
            fs.mkdirSync(imageUploadDir, { recursive: true });
        }
        let resumePromise = await new Promise(async function (resolve, reject) {
            var resumePdfFile = req.body.employee_resume;
            console.log("resumePdfFile", resumePdfFile)
            if (resumePdfFile) {
                var resumePdfName = req.body.resumePdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = resumePdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = resumePdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(resumePdfUploadDir + finalname, base64Data, 'base64');
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

        let proofPromise = await new Promise(async function (resolve, reject) {
            var proofPdfFile = req.body.employee_id_proof;

            if (proofPdfFile) {
                var proofPdfName = req.body.proofPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = proofPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = proofPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(proofPdfUploadDir + finalname, base64Data, 'base64');
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

        let panPromise = await new Promise(async function (resolve, reject) {
            var panPdfFile = req.body.employee_pan_card;

            if (panPdfFile) {
                var panPdfName = req.body.panPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = panPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = panPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(panPdfUploadDir + finalname, base64Data, 'base64');
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

        let experiencePromise = await new Promise(async function (resolve, reject) {
            var experiencePdfFile = req.body.employee_experience_letter;

            if (experiencePdfFile) {
                var experiencePdfName = req.body.experiencePdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = experiencePdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = experiencePdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(expLetterPdfUploadDir + finalname, base64Data, 'base64');
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

        let marksheetPromise = await new Promise(async function (resolve, reject) {
            var marksheetPdfFile = req.body.employee_marksheet;

            if (marksheetPdfFile) {
                var marksheetPdfName = req.body.marksheetPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = marksheetPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = marksheetPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(marksheetPdfUploadDir + finalname, base64Data, 'base64');
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

        let imagePromise = await new Promise(async function (resolve, reject) {
            var imageFile = req.body.image;

            if (imageFile) {
                var imageName = req.body.imageName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = imageName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'png') {
                    var base64Data = imageFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(imageUploadDir + finalname, base64Data, 'base64');
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

        if (resumePromise.status == 'true' && proofPromise.status == 'true') {
            let resumeFinalname = resumePromise.finalname;
            let proofFinalname = proofPromise.finalname;
            let panFinalname = panPromise.finalname;
            let experienceFinalname = experiencePromise.finalname;
            let marksheetFinalname = marksheetPromise.finalname;
            let imageFinalname = imagePromise.finalname;

            var resumeFullPdfUrl = '';
            var proofFullPdfUrl = '';
            var panFullPdfUrl = '';
            var experienceFullPdfUrl = '';
            var marksheetFullPdfUrl = '';
            var imageFullUrl = '';
            if (resumeFinalname != '') {
                resumeFullPdfUrl = "employee/resume_pdf/" + resumeFinalname;
            }

            if (proofFinalname != '') {
                proofFullPdfUrl = "employee/proof_pdf/" + proofFinalname;
            }
            if (panFinalname != '') {
                panFullPdfUrl = "employee/pan_card_pdf/" + panFinalname;
            }
            if (experienceFinalname != '') {
                experienceFullPdfUrl = "employee/experience_card_pdf/" + experienceFinalname;
            }
            if (marksheetFinalname != '') {
                marksheetFullPdfUrl = "employee/marksheet_pdf/" + marksheetFinalname;
            }
            if (imageFinalname != '') {
                imageFullUrl = "employee/image/" + imageFinalname;
            }

            var obj = {
                employee_code: req.body.employee_code,
                employee_first_name: capitalizeWords(req.body.employee_first_name),
                employee_last_name: capitalizeWords(req.body.employee_last_name),
                employee_mobile: req.body.employee_mobile,
                employee_alternate_mobile: req.body.employee_alternate_mobile,
                employee_email: req.body.employee_email,
                employee_password: req.body.employee_password,
                employee_address: req.body.employee_address,
                employee_city: capitalizeWords(req.body.employee_city),
                employee_state: capitalizeWords(req.body.employee_state),
                employee_other_info: req.body.employee_other_info,
                employee_dob: req.body.employee_dob,
                employee_doj: req.body.employee_doj,
                employee_skills: req.body.employee_skills,
                employee_experience: req.body.employee_experience,
                employee_resume: resumeFullPdfUrl, // Use resumeFullPdfUrl here
                employee_id_proof: proofFullPdfUrl, // Use proofFullPdfUrl here
                employee_pan_card: panFullPdfUrl,
                employee_experience_letter: experienceFinalname,
                employee_marksheet: marksheetFullPdfUrl,
                employee_permanant_address_proof: req.body.employee_permanant_address_proof,
                employee_local_address_proof: req.body.employee_local_address_proof,
                employee_reference_one_name: req.body.employee_reference_one_name,
                employee_reference_one_mobile: req.body.employee_reference_one_mobile,
                employee_reference_two_name: req.body.employee_reference_two_name,
                employee_reference_two_mobile: req.body.employee_reference_two_mobile,
                image: imageFullUrl
            };

            const newmanageEmployeeModel = new manageEmployeeModel(obj);
            let result = await newmanageEmployeeModel.save();

            res.json({ success: true, status: status.CREATED, msg: 'Employee is created successfully.' });
        }

    } catch (err) {
        console.log("error", err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.employee_code) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'Employee Code is already registered.' });
        }
        else if (err.code === 11000 && err.keyPattern && err.keyPattern.employee_email) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This Email is already registered.' });
        }
        else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Employee failed.' });

        }
    }
}






exports.list = async (req, res) => {
    try {
        const data = await manageEmployeeModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK, msg: 'Get Employee Successfully.' });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Employee failed.' });

    }
}

//delete user by id
exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageEmployeeModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Employee is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Employee Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Employee data failed.' });

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
        let result = await manageEmployeeModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Employee data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Employee data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}


exports.getEmployeeById = async (req, res) => {
    try {
        let employeeid = req.query.employeeid;
        // const ID = req.query.userid;
        if (employeeid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageEmployeeModel.findOne({ _id: employeeid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Employee failed.' });
    }

}


exports.changePassword = async (req, res) => {
    console.log("req.body----", req.body)
    try {
        const employee_email = req.body.employee_email;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword; // New field for confirmation password
        // Find the user in the database
        const user = await manageEmployeeModel.findOne({ employee_email });
        if (!user) {
            return res.json({ success: false, msg: 'User not found.' });
        }
        // Verify current password
        console.log("user", currentPassword)

        if (currentPassword !== user.employee_password) {
            return res.json({ success: false, msg: 'Invalid current password.' });
        }
        if (newPassword !== confirmPassword) {
            return res.json({ success: false, msg: 'New password and confirmation password do not match.' });
        }
        await manageEmployeeModel.updateOne({ employee_email }, { employee_password: newPassword });
        return res.json({ success: true, msg: 'Password changed successfully.' });
    } catch (e) {
        console.error("Error in change password:", e);
        return res.json({ success: false, err: e, msg: 'Error in change password.' });
    }
};


const uploadFolder = path.join(__dirname, 'uploads'); // Folder ka path define karein

// Agar folder nahi hai to create karein
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}


exports.edit = async (req, res) => {
    console.log("mahimajjjj", req.body)
    try {
        const employeeId = req.body._id;
        if (!employeeId) {
            return res.status(400).json({ success: false, msg: 'Employee ID is required for update.' });
        }
        const existingEmployee = await manageEmployeeModel.findById(employeeId);
        if (!existingEmployee) {
            return res.status(404).json({ success: false, msg: 'Employee not found.' });
        }
        // Code to handle file uploads...
        var uploadDir = process.cwd() + '/public/';
        var resumePdfUploadDir = uploadDir + "employee/resume_pdf/";
        var proofPdfUploadDir = uploadDir + "employee/proof_pdf/";
        var panPdfUploadDir = uploadDir + "employee/pan_card_pdf/";
        var expLetterPdfUploadDir = uploadDir + "employee/exe_letter_pdf/";
        var marksheetPdfUploadDir = uploadDir + "employee/marksheet_pdf/";
        var imageUploadDir = uploadDir + "employee/image/";

        // Check if upload directories exist, if not, create them
        if (!fs.existsSync(resumePdfUploadDir)) {
            fs.mkdirSync(resumePdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(proofPdfUploadDir)) {
            fs.mkdirSync(proofPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(panPdfUploadDir)) {
            fs.mkdirSync(panPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(expLetterPdfUploadDir)) {
            fs.mkdirSync(expLetterPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(marksheetPdfUploadDir)) {
            fs.mkdirSync(marksheetPdfUploadDir, { recursive: true });
        }
        if (!fs.existsSync(imageUploadDir)) {
            fs.mkdirSync(imageUploadDir, { recursive: true });
        }

        // Processing file uploads for each type of document
        let resumePromise = await new Promise(async function (resolve, reject) {
            var resumePdfFile = req.body.employee_resume;

            if (resumePdfFile) {
                var resumePdfName = req.body.resumePdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = resumePdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = resumePdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const decodedData = base64Data;
                    if (!isValidBase64(decodedData)) {
                        return res.status(400).send({ message: "Invalid base64 string" });
                    } else {
                        const buffer = Buffer.from(base64Data, 'base64');
                        if (buffer.length > 0) {
                            await fs.writeFileSync(resumePdfUploadDir + finalname, base64Data, 'base64');
                            resolve({ status: 'true', finalname: finalname, fileExt: extension });
                        } else {
                            resolve({ status: 'true', finalname: '', fileExt: '' });
                        }
                    }
                }
            }
            else {
                resolve({ status: 'true', finalname: '', fileExt: '' });
            }
        });

        let proofPromise = await new Promise(async function (resolve, reject) {
            var proofPdfFile = req.body.employee_id_proof;

            if (proofPdfFile) {
                var proofPdfName = req.body.proofPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = proofPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = proofPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(proofPdfUploadDir + finalname, base64Data, 'base64');
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

        let panPromise = await new Promise(async function (resolve, reject) {
            var panPdfFile = req.body.employee_pan_card;

            if (panPdfFile) {
                var panPdfName = req.body.panPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = panPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = panPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(panPdfUploadDir + finalname, base64Data, 'base64');
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

        let experiencePromise = await new Promise(async function (resolve, reject) {
            var experiencePdfFile = req.body.employee_experience_letter;

            if (experiencePdfFile) {
                var experiencePdfName = req.body.experiencePdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = experiencePdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = experiencePdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(expLetterPdfUploadDir + finalname, base64Data, 'base64');
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

        let marksheetPromise = await new Promise(async function (resolve, reject) {
            var marksheetPdfFile = req.body.employee_marksheet;

            if (marksheetPdfFile) {
                var marksheetPdfName = req.body.marksheetPdfName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = marksheetPdfName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'pdf') {
                    var base64Data = marksheetPdfFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(marksheetPdfUploadDir + finalname, base64Data, 'base64');
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
        let imagePromise = await new Promise(async function (resolve, reject) {
            var imageFile = req.body.image;

            if (imageFile) {
                var imageName = req.body.imageName;
                var current_time = new Date().getTime();
                var fileName = current_time;
                var extension = imageName.split('.').pop().toLowerCase();
                var finalname = fileName + "." + extension;

                if (extension == 'png') {
                    var base64Data = imageFile.replace(/^data:application\/pdf;base64,/, "");
                    const buffer = Buffer.from(base64Data, 'base64');
                    if (buffer.length > 0) {
                        await fs.writeFileSync(imageUploadDir + finalname, base64Data, 'base64');
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
        // If all file uploads are successful, proceed with updating the database
        if (resumePromise.status == 'true' && proofPromise.status == 'true' && marksheetPromise.status == 'true' && experiencePromise.status == 'true' && panPromise.status == 'true') {
            // Extract filenames and URLs for each document
            let resumeFinalname = resumePromise.finalname;
            let proofFinalname = proofPromise.finalname;
            let panFinalname = panPromise.finalname;
            let experienceFinalname = experiencePromise.finalname;
            let marksheetFinalname = marksheetPromise.finalname;
            let imageFinalname = imagePromise.finalname;

            // Formulate URLs for each document
            if (resumeFinalname) {
                var resumeFullPdfUrl = "employee/resume_pdf/" + resumeFinalname;
            } else if (proofFinalname) {
                var proofFullPdfUrl = "employee/proof_pdf/" + proofFinalname;
            } else if (panFinalname) {
                var panFullPdfUrl = "employee/pan_card_pdf/" + panFinalname;
            } else if (experienceFinalname) {
                var experienceFullPdfUrl = "employee/experience_card_pdf/" + experienceFinalname;
            } else if (marksheetFinalname) {
                var marksheetFullPdfUrl = "employee/marksheet_pdf/" + marksheetFinalname;
            } else if (imageFinalname) {
                var imageFullUrl = "employee/image/" + imageFinalname;
            }
            console.log("resumeFinalname", resumeFinalname)
            console.log("resumeFullPdfUrl", resumeFullPdfUrl)

            // Construct the employee object with all data including file URLs
            var obj = {
                employee_code: req.body.employee_code,
                employee_first_name: capitalizeWords(req.body.employee_first_name),
                employee_last_name: capitalizeWords(req.body.employee_last_name),
                employee_mobile: req.body.employee_mobile,
                employee_alternate_mobile: req.body.employee_alternate_mobile,
                employee_email: req.body.employee_email,
                employee_password: req.body.employee_password,
                employee_address: req.body.employee_address,
                employee_city: capitalizeWords(req.body.employee_city),
                employee_state: capitalizeWords(req.body.employee_state),
                employee_other_info: req.body.employee_other_info,
                employee_dob: req.body.employee_dob,
                employee_doj: req.body.employee_doj,
                employee_skills: req.body.employee_skills,
                employee_experience: req.body.employee_experience,
                employee_resume: resumeFullPdfUrl,
                employee_id_proof: proofFullPdfUrl,
                employee_pan_card: panFullPdfUrl,
                employee_experience_letter: experienceFullPdfUrl,
                employee_marksheet: marksheetFullPdfUrl,
                employee_permanant_address_proof: req.body.employee_permanant_address_proof,
                employee_local_address_proof: req.body.employee_local_address_proof,
                employee_reference_one_name: req.body.employee_reference_one_name,
                employee_reference_one_mobile: req.body.employee_reference_one_mobile,
                employee_reference_two_name: req.body.employee_reference_two_name,
                employee_reference_two_mobile: req.body.employee_reference_two_mobile,
                image: imageFullUrl
            };
            const updatedEmployee = await manageEmployeeModel.findByIdAndUpdate(
                employeeId,
                { $set: obj },
                { new: true } // Return the updated document
            );
            // Respond with success message and updated employee data
            res.json({ success: true, msg: 'Employee updated successfully.', employee: updatedEmployee });
        }

    } catch (err) {
        // If any error occurs during the process, handle it
        console.log("error", err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.employee_code) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'Employee Code is already registered.' });
        }
        else if (err.code === 11000 && err.keyPattern && err.keyPattern.employee_email) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This Email is already registered.' });
        }
        else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Employee failed.' });

        }
    }
}





exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await manageEmployeeModel.aggregate([
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


// exports.search = async (req, res) => {
//     try {
//         const query = req.query.search;
//         if (!query) {
//             return res.status(400).json({ error: 'No search query provided' });
//         }
//         const searchQuery = {
//             $or: [
//                 { employee_last_name: { $regex: new RegExp(query, "i") } },
//                 { employee_first_name: { $regex: new RegExp(query, "i") } },
//                 { employee_email: { $regex: new RegExp(query, "i") } },
//                 { employee_mobile: { $regex: new RegExp(query, "i") } },
//                 { employee_skills: { $regex: new RegExp(query, "i") } }, // Update here
//                 { employee_code: { $regex: new RegExp(query, "i") } },
//                 { employee_address: { $regex: new RegExp(query, "i") } },
//                 { employee_city: { $regex: new RegExp(query, "i") } },
//                 { employee_state: { $regex: new RegExp(query, "i") } },
//                 { employee_experience: { $regex: new RegExp(query, "i") } },

//             ]
//         };
//         // Check if the query contains both first and last names
//         if (query.includes(' ')) {
//             const [firstName, lastName] = query.split(' ');
//             // Update search query to match both first and last names together
//             searchQuery.$or.push({
//                 $and: [
//                     { employee_first_name: { $regex: new RegExp(firstName, "i") } },
//                     { employee_last_name: { $regex: new RegExp(lastName, "i") } }
//                 ]
//             });
//         }
//         const results = await manageEmployeeModel.find(searchQuery);
//         res.json(results);
//     } catch (err) {
//         console.error("Error:", err);
//         return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
//     }
// }
exports.search = async (req, res) => {
    try {
        const query = req.query.search;
        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }

        // Split the query into an array of search terms
        const searchTerms = query.split(',').map(term => term.trim());

        const searchQuery = {
            $or: [
                { employee_last_name: { $regex: new RegExp(query, "i") } },
                { employee_first_name: { $regex: new RegExp(query, "i") } },
                { employee_email: { $regex: new RegExp(query, "i") } },
                { employee_mobile: { $regex: new RegExp(query, "i") } },
                { employee_code: { $regex: new RegExp(query, "i") } },
                { employee_address: { $regex: new RegExp(query, "i") } },
                { employee_city: { $regex: new RegExp(query, "i") } },
                { employee_state: { $regex: new RegExp(query, "i") } },
                { employee_experience: { $regex: new RegExp(query, "i") } }
            ]
        };

        // Add search conditions for each skill term
        searchTerms.forEach(term => {
            searchQuery.$or.push({
                employee_skills: { $regex: new RegExp(term, "i") }
            });
        });

        // Check if the query contains both first and last names
        if (query.includes(' ')) {
            const [firstName, lastName] = query.split(' ');
            // Update search query to match both first and last names together
            searchQuery.$or.push({
                $and: [
                    { employee_first_name: { $regex: new RegExp(firstName, "i") } },
                    { employee_last_name: { $regex: new RegExp(lastName, "i") } }
                ]
            });
        }

        const results = await manageEmployeeModel.find(searchQuery);
        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
};

exports.getdate = async (req, res) => {
    try {
        const currentMonth = new Date().getMonth() + 1; // Month is zero-indexed, so add 1 for the current month

        const employees = await manageEmployeeModel.aggregate([
            {
                $addFields: {
                    month: { $month: '$employee_dob' } // Extract month from employee_dob
                }
            },
            {
                $match: {
                    month: currentMonth // Match current month
                }
            },
            {
                $project: {
                    month: 0 // Hide the added 'month' field from the result
                }
            }
        ]);

        return res.json({ success: true, data: employees });
    } catch (err) {
        console.error('Error fetching birthdays:', err);
        return res.status(500).json({ success: false, error: err.message });
    }
};



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
                    await manageEmployeeModel.insertMany(results); // Adjust according to your schema
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



// exports.searchAdvance = async (req, res) => {
//     try {
//       const { employee_skills, employee_experience } = req.query;

//       // Query banayein filter karne ke liye
//       let query = {};

//       if (employee_skills) {
//         query.employee_skills = { $in: employee_skills.split(',') }; // skills ko comma se separate karke array mein convert karein
//       }

//       if (employee_experience) {
//         // Extract numeric part from employee_experience
//         const experienceInYears = parseInt(employee_experience.split(' ')[0]);

//         // Ensure numeric conversion is valid
//         if (!isNaN(experienceInYears)) {
//           // Filter candidates where employee_experience is equal to the requested experience
//           query.employee_experience = { $eq: experienceInYears }; // Exact match
//         }
//       }

//       const candidates = await manageEmployeeModel.find(query);
//       res.json(candidates);
//     } catch (err) {
//       res.status(500).json({ message: err.message });
//     }
//   };


exports.searchAdvance = async (req, res) => {
    try {
        const { employee_skills, employee_experience } = req.query;

        // Query banayein filter karne ke liye
        let query = {};

        if (employee_skills) {
            query.employee_skills = { $in: employee_skills.split(',') }; // skills ko comma se separate karke array mein convert karein
        }

        if (employee_experience) {
            // Extract numeric part from employee_experience
            const experienceInYears = parseInt(employee_experience.split(' ')[0]);

            // Ensure numeric conversion is valid
            if (!isNaN(experienceInYears)) {
                // Filter candidates where employee_experience is equal to the requested experience
                query.employee_experience = { $eq: experienceInYears }; // Exact match
            }
        }



        const candidates = await manageEmployeeModel.find(query);
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.sendEmail = async (req, res) => {
    try {
        const emails = req.body && req.body.emails ? req.body.emails : [];

        if (!Array.isArray(emails) || emails.length === 0) {
            return res.json({ success: false, status: 'INVALIDSYNTAX', msg: 'Invalid email list.' });
        }

        // Create the transporter object
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'mahimagarg1602@gmail.com',
                pass: 'uixv laul bjpd tqcc'
            }
        });

        const sendMailPromises = emails.map(async (email) => {
            const user = await manageEmployeeModel.findOne({ employee_email: new RegExp(`^${email}$`, 'i') }).lean().exec();

            if (!user) {
                console.log(`User not found in database: ${email}`);
            }

            const mailOptions = {
                from: 'Reinforce Software Solution Pvt. Ltd.:mahimagarg1602@gmail.com',
                to: email,
                subject: '**Happy Independence Day**',
                text: `Celebrate Independence Day with Us & Explore New Opportunities!`,

                html: ` <h2 style="color: black;"><i><b>Celebrate Independence Day with Us & Explore New Opportunities!</b></i></h2>
<h3 style="color: black;"><i><b>Dear Team,</b></i></h3>
<h3 style="color: black;"><i><b>
Wishing you an advanced happy independence day to all our employees and their family members. </b></i></h3>
<h3 style="color: black;"><i><b>
Hope this independence will bring joy and success to your life.</b></i></h3>
<img src="https://img.freepik.com/free-vector/gradient-india-independence-day-background_23-2149491410.jpg" alt="Independence Day Celebration" style="display: block; margin: 20px auto; max-width: 100%; height: auto;">
 `,
            };

            return transporter.sendMail(mailOptions)
                .then(info => {
                    console.log(`Message sent to ${email}: %s`, info.messageId);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    return `Message sent to ${email}`;
                })
                .catch(error => {
                    console.error(`Error sending mail to ${email}:`, error);
                    return `Error sending mail to ${email}: ${error.message}`;
                });
        });

        const results = await Promise.all(sendMailPromises);

        res.json({ success: true, status: 'OK', msg: 'Emails sent to the provided email addresses.', results });

    } catch (e) {
        console.log("Error:", e);
        return res.json({ success: false, status: 'INVALIDSYNTAX', err: e, msg: 'Error in sending emails.' });
    }
};

exports.getBirthday = async (req, res) => {
    try {
        const data = await manageEmployeeModel.find({}).select("id employee_first_name employee_last_name employee_dob").lean().exec();
        return res.json({ data: data, success: true, status: status.OK, msg: 'Get Birthday Successfully.' });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Birthday failed.' });

    }
}

exports.getAllEmployeeIdsForMeeting = async (req, res) => {
    try {
        // Fetch all employee IDs
        const data = await manageEmployeeModel.find({}, { _id: 1  }).lean().exec();
        // Check if any employee IDs were found
        if (data.length === 0) {
            return res.json({
                success: false,
                status: status.NOTFOUND,
                msg: 'No Employees Found'
            });
        }
        return res.json({
            data: data,
            success: true,
            status: status.OK
        });
    } catch (err) {
        console.error("Error fetching employee IDs:", err);
        return res.json({
            success: false,
            status: status.INVALIDSYNTAX,
            err: err.message, // Return a more readable error message
            msg: 'Get Employee IDs failed.'
        });
    }
};
 