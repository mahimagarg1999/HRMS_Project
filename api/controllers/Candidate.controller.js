const manageCandidateModel = require("../models/Candidate.model")
const status = require("../config/status");
const fs = require('fs'); // Importing fs with promises
const RecruitmentModel = require('../models/Recruitment.model');
const path = require('path')
const csv = require('csv-parser');
const csvtojson = require('csvtojson');
const nodemailer = require('nodemailer');
const axios = require('axios');

const { parse } = require('json2csv');
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

exports.edit = async (req, res) => {
    console.log("dust---", req.body)
    try {

        const candidateId = req.body.id;
        if (!candidateId) {
            return res.status(400).json({ success: false, msg: 'Candidate ID is required for update.' });
        }
        const existingCandidate = await manageCandidateModel.findById(candidateId);
        if (!existingCandidate) {
            return res.status(404).json({ success: false, msg: 'Candidate not found.' });
        }

        var uploadDir = process.cwd() + '/public/';
        var resumeUploadDir = uploadDir + "candidate/document/";

        if (!fs.existsSync(resumeUploadDir)) {
            fs.mkdirSync(resumeUploadDir, { recursive: true });
        }

        let resumePromise = await new Promise(async function (resolve, reject) {
            var resumePdfFile = req.body.candidate_document_proof;

            if (resumePdfFile) {
                console.log("hiiiiii")
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
                            await fs.writeFileSync(resumeUploadDir + finalname, base64Data, 'base64');
                            resolve({ status: 'true', finalname: finalname, fileExt: extension });
                        } else {
                            resolve({ status: 'true', finalname: '', fileExt: '' });
                        }
                    }
                }

                // else {
                //     resolve({ status: 'true', finalname: '', fileExt: '' });
                // }
            } else {
                resolve({ status: 'true', finalname: '', fileExt: '' });
            }
        });
        if (resumePromise.status == 'true') {
            let resumeFinalname = resumePromise.finalname;
            var resumeFullPdfUrl = '';
            if (resumeFinalname) {
                resumeFullPdfUrl = "candidate/document/" + resumeFinalname;
            }
            else {
                resumeFullPdfUrl = undefined
            }

            console.log("resumeFinalname", resumeFinalname)
            console.log("resumeFullPdfUrl", resumeFullPdfUrl)

            // Prepare object for candidate update
            var obj = {
                candidate_id: req.body.candidate_id,
                candidate_first_name: capitalizeWords(req.body.candidate_first_name),
                candidate_last_name: capitalizeWords(req.body.candidate_last_name),
                candidate_mobile: req.body.candidate_mobile,
                candidate_alternate_mobile: req.body.candidate_alternate_mobile,
                candidate_email: req.body.candidate_email,
                candidate_skype: req.body.candidate_skype,
                candidate_linkedIn_profile: req.body.candidate_linkedIn_profile,
                candidate_skills: req.body.candidate_skills,
                candidate_experience: req.body.candidate_experience,
                candidate_expected_salary: req.body.candidate_expected_salary,
                candidate_expected_joining_date: req.body.candidate_expected_joining_date,
                candidate_marrital_status: req.body.candidate_marrital_status,
                interview_rounds:req.body.interview_rounds,
                candidate_selection_status: req.body.candidate_selection_status,
                candidate_feedback: req.body.candidate_feedback,
                source_of_candidate: req.body.source_of_candidate,
                candidate_address: req.body.candidate_address,
                candidate_document_proof: resumeFullPdfUrl,
                tenth_percentage: req.body.tenth_percentage,
                twelfth_percentage: req.body.twelfth_percentage,
                graduationPercentage: req.body.graduationPercentage,
                postGraduationPercentage:req.body.postGraduationPercentage,
                profile: req.body.profile
            };
            // Find the existing candidate profile
            const oldProfile = existingCandidate.profile;
            // Update the candidate
            const updatedCandidate = await manageCandidateModel.findByIdAndUpdate(
                candidateId,
                { $set: obj },
                { new: true } // Return the updated document
            );
            // Update no_of_candidate in Recruitment Model
            if (oldProfile !== req.body.profile) {
                // Decrement old profile count
                await RecruitmentModel.findOneAndUpdate(
                    { profile_id: oldProfile },
                    { $inc: { no_of_candidate: -1 } },
                    { new: true }
                );
                // Increment new profile count
                await RecruitmentModel.findOneAndUpdate(
                    { profile_id: req.body.profile },
                    { $inc: { no_of_candidate: 1 } },
                    { new: true }
                );
            }

            // Respond with success message and updated Candidate data
            res.json({ success: true, msg: 'Candidate updated successfully.', candidate: updatedCandidate });
        }
    } catch (err) {
        console.error("Error:", err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_email) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_id) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This Id is already registered.' });
        } else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Updating Candidate failed.' });
        }
    }
};
exports.list = async (req, res) => {
    try {
        const data = await manageCandidateModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Candidate failed.' });
    }
}

// soting
exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        const result = await manageCandidateModel.aggregate([
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
        if (!ID) {
            return res.status(404).json({ success: false, msg: 'Id Parameter Not Available' });
        }

        const candidate = await manageCandidateModel.findById(ID).lean();
        if (!candidate) {
            return res.status(404).json({ success: false, msg: 'Candidate Id not found' });
        }

        const result = await manageCandidateModel.findByIdAndDelete(ID).lean();
        if (result) {
            const updatedRecruitment = await RecruitmentModel.findOneAndUpdate(
                { profile_id: candidate.profile },
                { $inc: { no_of_candidate: -1 } },
                { new: true }
            );

            if (!updatedRecruitment) {
                return res.status(404).json({ success: false, msg: 'Recruitment data not updated.' });
            }

            return res.json({ success: true, msg: 'Candidate and associated Recruitment data updated successfully.' });
        } else {
            return res.status(404).json({ success: false, msg: 'Candidate Id not found' });
        }
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, msg: 'Delete Candidate data failed.', err });
    }
};

exports.multidelete = async (req, res) => {
    try {
        const ids = req.body.ids;

        // Check if the 'ids' parameter is not available or is not an array
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.json({ success: false, status: status.NOTFOUND, msg: "IDs parameter not available or invalid" });
        }

        // Use $in operator to match multiple IDs and delete them
        let result = await manageCandidateModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Candidate data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Candidate data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}

exports.getCandidateById = async (req, res) => {
    try {
        let candidateid = req.query.candidateid;
        // const ID = req.query.userid;
        if (candidateid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageCandidateModel.findOne({ _id: candidateid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Candidate failed.' });
    }
}


exports.search = async (req, res) => {
    try {
        const query = req.query.profile;

        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const searchQuery = {
            $or: [
                { candidate_first_name: { $regex: new RegExp(query, "i") } },
                { candidate_last_name: { $regex: new RegExp(query, "i") } },
                { candidate_email: { $regex: new RegExp(query, "i") } },
                { candidate_mobile: { $regex: new RegExp(query, "i") } },
                { profile: { $regex: new RegExp(query, "i") } },
                { candidate_skills: { $elemMatch: { $regex: new RegExp(query, "i") } } },
                { candidate_skype: { $regex: new RegExp(query, "i") } },
                { candidate_linkedIn_profile: { $regex: new RegExp(query, "i") } },
                { candidate_experience: { $regex: new RegExp(query, "i") } },
                { candidate_address: { $regex: new RegExp(query, "i") } },

            ]
        };
        // Check if the query contains both first and last names
        if (query.includes(' ')) {
            const [firstName, lastName] = query.split(' ');
            // Update search query to match both first and last names together
            searchQuery.$or.push({
                $and: [
                    { candidate_first_name: { $regex: new RegExp(firstName, "i") } },
                    { candidate_last_name: { $regex: new RegExp(lastName, "i") } }
                ]
            });
        }
        // Perform search using Mongoose's find method
        const results = await manageCandidateModel.find(searchQuery);
        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}

exports.create = async (req, res) => {
    try {
        var uploadDir = process.cwd() + '/public/';
        var resumeUploadDir = uploadDir + "candidate/document/";

        if (!fs.existsSync(resumeUploadDir)) {
            fs.mkdirSync(resumeUploadDir, { recursive: true });
        }

        let resumePromise = await new Promise(async function (resolve, reject) {
            var resumePdfFile = req.body.candidate_document_proof;

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
                        await fs.writeFileSync(resumeUploadDir + finalname, base64Data, 'base64');
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

        if (resumePromise.status == 'true') {
            let resumeFinalname = resumePromise.finalname;
            var resumeFullPdfUrl = '';
            if (resumeFinalname != '') {
                resumeFullPdfUrl = "candidate/document/" + resumeFinalname;
            }

            var obj = {
                candidate_id: req.body.candidate_id,
                candidate_first_name: capitalizeWords(req.body.candidate_first_name),
                candidate_last_name: capitalizeWords(req.body.candidate_last_name),
                candidate_mobile: req.body.candidate_mobile,
                candidate_alternate_mobile: req.body.candidate_alternate_mobile,
                candidate_email: req.body.candidate_email,
                candidate_skype: req.body.candidate_skype,
                candidate_linkedIn_profile: req.body.candidate_linkedIn_profile,
                candidate_skills: req.body.candidate_skills,
                candidate_experience: req.body.candidate_experience,
                candidate_expected_salary: req.body.candidate_expected_salary,
                candidate_expected_joining_date: req.body.candidate_expected_joining_date,
                candidate_marrital_status: req.body.candidate_marrital_status,
                interview_rounds:req.body.interview_rounds,
                candidate_selection_status: req.body.candidate_selection_status,
                candidate_feedback: req.body.candidate_feedback,
                source_of_candidate: req.body.source_of_candidate,
                candidate_address: req.body.candidate_address,
                candidate_document_proof: resumeFullPdfUrl,
                tenth_percentage: req.body.tenth_percentage,
                twelfth_percentage: req.body.twelfth_percentage,
                graduationPercentage: req.body.graduationPercentage,
                postGraduationPercentage:req.body.postGraduationPercentage,
                profile: req.body.profile
            };

            const newmanageCandidateModel = new manageCandidateModel(obj);
            let result = await newmanageCandidateModel.save();

            // Update no_of_candidate in Recruitment Model based on profile
            await RecruitmentModel.findOneAndUpdate(
                { profile_id: req.body.profile }, // Find by profile field from candidate
                { $inc: { no_of_candidate: 1 } }, // Increment no_of_candidate by 1
                { new: true } // To return the updated document
            );
            res.json({ success: true, status: status.OK, msg: 'Adding Candidate is successfully.' });
        }
    } catch (err) {
        console.error("Error:", err);
        if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_email) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_id) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This Id is already registered.' });
        } else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Candidate failed.' });
        }
    }
};


// exports.export = async (req, res) => {
//     const { csvData, filename } = req.body;

//     if (!csvData || !filename) {
//         console.error('Missing csvData or filename');
//         return res.status(400).json({ error: 'Missing csvData or filename' });
//     }

//     const filePath = path.join(__dirname, 'download', filename);

//     console.log(`Saving file to ${filePath}`); // Log the file path

//     fs.writeFile(filePath, csvData, (err) => {
//         if (err) {
//             console.error('Failed to save file:', err); // Log error details
//             return res.status(500).json({ error: 'Failed to save file' });
//         }
//         console.log('File saved successfully'); // Log success
//         res.json({ message: 'File saved successfully', path: `/download/${filename}` });
//     });
// };


exports.export = async (req, res) => {
    const { csvData, filename } = req.body;

    if (!csvData || !filename) {
        console.error('Missing csvData or filename');
        return res.status(400).json({ error: 'Missing csvData or filename' });
    }

    const filePath = path.join(__dirname, 'download', filename);

    try {
        // Convert CSV to JSON
        const jsonData = await csvtojson().fromString(csvData);

        // Remove the _id field from each document
        const modifiedData = jsonData.map(({ _id, ...rest }) => rest);

        // Convert JSON back to CSV
        const csv = parse(modifiedData);

        console.log(`Saving file to ${filePath}`); // Log the file path

        fs.writeFile(filePath, csv, (err) => {
            if (err) {
                console.error('Failed to save file:', err); // Log error details
                return res.status(500).json({ error: 'Failed to save file' });
            }
            console.log('File saved successfully'); // Log success
            res.json({ message: 'File saved successfully', path: `/download/${filename}` });
        });
    } catch (error) {
        console.error('Error processing CSV data:', error);
        res.status(500).json({ error: 'Error processing CSV data' });
    }
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
                    await manageCandidateModel.insertMany(results); // Adjust according to your schema
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
//         const { candidate_skills, candidate_experience } = req.query;
//         // Query banayein filter karne ke liye
//         let query = {};
//         if (candidate_skills) {
//             query.candidate_skills = { $in: candidate_skills.split(',') }; // skills ko comma se separate karke array mein convert karein
//         }
//         if (candidate_experience) {
//             // Extract numeric part from employee_experience
//             const experienceInYears = parseInt(candidate_experience.split(' ')[0]);

//             // Ensure numeric conversion is valid
//             if (!isNaN(experienceInYears)) {
//                 // Filter candidates where employee_experience is equal to the requested experience
//                 query.candidate_experience = { $eq: experienceInYears }; // Exact match
//             }
//         }
//         const candidates = await manageCandidateModel.find(query);
//         res.json(candidates);
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// };

 

exports.searchAdvance = async (req, res) => {
    try {
        const { candidate_skills, candidate_experience, all_skills } = req.query;
        // Query banayein filter karne ke liye
        let query = {};
        if (candidate_skills) {
            const skillsArray = candidate_skills.split(',');
            if (all_skills === 'yes') {
                query.candidate_skills = { $all: skillsArray }; // All skills required
            } else {
                query.candidate_skills = { $in: skillsArray }; // Any skill match
            }
        }
        if (candidate_experience) {
            // Extract numeric part from candidate_experience
            const experienceInYears = parseInt(candidate_experience.split(' ')[0]);

            // Ensure numeric conversion is valid
            if (!isNaN(experienceInYears)) {
                // Filter candidates where candidate_experience is equal to the requested experience
                query.candidate_experience = { $eq: experienceInYears }; // Exact match
            }
        }
        const candidates = await manageCandidateModel.find(query);
        res.json(candidates);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
// exports.sendEmail = async (req, res) => {
//     try {
//         const emails = req.body && req.body.emails ? req.body.emails : [];

//         if (!Array.isArray(emails) || emails.length === 0) {
//             return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Invalid email list.' });
//         }

//         // Create the transporter object
//         const transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//                 user: 'mahimagarg1602@gmail.com',
//                 pass: 'uixv laul bjpd tqcc'
//             }
//         });

//         const sendMailPromises = emails.map(async (email) => {
//             const user = await manageCandidateModel.findOne({ candidate_email: new RegExp(`^${email}$`, 'i') }).lean().exec();

//             if (!user) {
//                 console.log(`Authentication failed. User not found: ${email}`);
//                 return Promise.resolve(`User not found: ${email}`);
//             } else {
//                 const mailOptions = {
//                     from: 'mailto:mahimagarg1602@gmail.com',
//                     to: email,
//                     subject: 'Requirement..Hiring',
//                     text: 'Hello world?',
//                     html: `
//               <h2>About the Role:</h2>
//               <p>We are seeking a skilled and passionate Laravel Developer to join our dynamic team. The ideal candidate will have 2-3 years of experience in developing robust and scalable web applications using the Laravel framework.</p>
//               <h2>Key Responsibilities:</h2>
//               <ol>
//                   <li>Develop, test, and maintain web applications using Laravel.</li>
//                   <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
//                   <li>Troubleshoot, test, and maintain the core product software and databases to ensure strong optimization and functionality.</li>
//               </ol>
//               <h2>Required Skills:</h2>
//               <ul>
//                   <li>2-3 years of experience in Laravel development.</li>
//                   <li>Strong knowledge of PHP Framework.</li>
//                   <li>Experience with front-end technologies such as JavaScript, HTML, and CSS.</li>
//                   <li>Familiarity with version control tools (e.g., Git).</li>
//                   <li>Knowledge of database design and querying using MySQL.</li>
//               </ul>
//               <h2>Why Join Us:</h2>
//               <ul>
//                   <li>Opportunity to work on exciting projects with a talented team.</li>
//                   <li>Competitive salary and benefits package.</li>
//                   <li>Continuous learning and professional development opportunities.</li>
//                   <li>Positive and inclusive work environment.</li>
//               </ul>
//               <p>Thank you</p>
//             `,
//                 };

//                 return transporter.sendMail(mailOptions)
//                     .then(info => {
//                         console.log(`Message sent to ${email}: %s`, info.messageId);
//                         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
//                         return `Message sent to ${email}`;
//                     })
//                     .catch(error => {
//                         console.error(`Error sending mail to ${email}:`, error);
//                         return `Error sending mail to ${email}: ${error.message}`;
//                     });
//             }
//         });

//         const results = await Promise.all(sendMailPromises);

//         res.json({ success: true, status: status.OK, msg: 'Emails sent to the provided email addresses.', results });

//     } catch (e) {
//         console.log("e", e);
//         return res.json({ success: false, status: status.INVALIDSYNTAX, err: e, msg: 'Error in sending emails.' });
//     }
// }
  
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
            const user = await manageCandidateModel.findOne({ candidate_email: new RegExp(`^${email}$`, 'i') }).lean().exec();

            if (!user) {
                console.log(`User not found in database: ${email}`);
            }

            const mailOptions = {
                from: 'mailto:mahimagarg1602@gmail.com',
                to: email,
                subject: 'Requirement..Hiring',
                text: 'Hello world?',
                html: `
                    <h2>About the Role:</h2>
                    <p>We are seeking a skilled and passionate Laravel Developer to join our dynamic team. The ideal candidate will have 2-3 years of experience in developing robust and scalable web applications using the Laravel framework.</p>
                    <h2>Key Responsibilities:</h2>
                    <ol>
                        <li>Develop, test, and maintain web applications using Laravel.</li>
                        <li>Collaborate with cross-functional teams to define, design, and ship new features.</li>
                        <li>Troubleshoot, test, and maintain the core product software and databases to ensure strong optimization and functionality.</li>
                    </ol>
                    <h2>Required Skills:</h2>
                    <ul>
                        <li>2-3 years of experience in Laravel development.</li>
                        <li>Strong knowledge of PHP Framework.</li>
                        <li>Experience with front-end technologies such as JavaScript, HTML, and CSS.</li>
                        <li>Familiarity with version control tools (e.g., Git).</li>
                        <li>Knowledge of database design and querying using MySQL.</li>
                    </ul>
                    <h2>Why Join Us:</h2>
                    <ul>
                        <li>Opportunity to work on exciting projects with a talented team.</li>
                        <li>Competitive salary and benefits package.</li>
                        <li>Continuous learning and professional development opportunities.</li>
                        <li>Positive and inclusive work environment.</li>
                    </ul>
                    <p>Thank you</p>
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


// =========
exports.getProfileById = async (req, res) => {
    try {
        let profileid = req.query.profile_id;
        // const ID = req.query.userid;
        if (profileid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageCandidateModel.find({ profile: profileid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Candidate failed.' });
    }
}
