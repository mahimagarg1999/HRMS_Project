const manageCandidateModel = require("../models/Candidate.model")
const status = require("../config/status");
const fs = require('fs'); // Importing fs with promises


function capitalizeWords(str) {
    if (typeof str !== 'string') return str; // Return the input if it's not a string
    return str.replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
}
//add Candidate
exports.create = async (req, res) => {
    try {
        var uploadDir = process.cwd() + '/public/';
        var resumeUploadDir = uploadDir + "candidate/documnet/";

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
                resumeFullPdfUrl = "candidate/documnet/" + resumeFinalname;
            }
            var obj = {
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
                candidate_machine_round: req.body.candidate_machine_round,
                candidate_technical_interview_round: req.body.candidate_technical_interview_round,
                candidate_hr_interview_round: req.body.candidate_hr_interview_round,
                candidate_selection_status: req.body.candidate_selection_status,
                candidate_feedback: req.body.candidate_feedback,
                source_of_candidate: req.body.source_of_candidate,
                candidate_address: req.body.candidate_address,
                candidate_document_proof: resumeFullPdfUrl,
                tenth_percentage:req.body.tenth_percentage,
                twelfth_percentage:req.body.twelfth_percentage,
                graduationPercentage:req.body.graduationPercentage

            }
            const newmanageCandidateModel = new manageCandidateModel(obj);
            let result = await newmanageCandidateModel.save();
            res.json({ success: true, status: status.OK, msg: 'Adding Candidate is successfully.' });
        }
    }
    catch (err) {
        console.log("er",err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_email) {
            // If the error is due to a duplicate email (code 11000 is for duplicate key error)
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Candidate failed.' });
        }
    }
}



exports.edit = async (req, res) => {

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
        var resumeUploadDir = uploadDir + "candidate/documnet/";

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
                resumeFullPdfUrl = "candidate/documnet/" + resumeFinalname;
            }
            var obj = {
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
                candidate_machine_round: req.body.candidate_machine_round,
                candidate_technical_interview_round: req.body.candidate_technical_interview_round,
                candidate_hr_interview_round: req.body.candidate_hr_interview_round,
                candidate_selection_status: req.body.candidate_selection_status,
                candidate_feedback: req.body.candidate_feedback,
                source_of_candidate: req.body.source_of_candidate,
                candidate_address: req.body.candidate_address,
                candidate_document_proof: resumeFullPdfUrl,
                tenth_percentage:req.body.tenth_percentage,
                twelfth_percentage:req.body.twelfth_percentage,
                graduationPercentage:req.body.graduationPercentage

            }
            const updatedCandidate = await manageCandidateModel.findByIdAndUpdate(
                candidateId,
                { $set: obj },
                { new: true } // Return the updated document
            );
            // Respond with success message and updated Consultancy data
            res.json({ success: true, msg: 'Candidate updated successfully.', candidate: updatedCandidate });
       }
    }
    catch (err) {
        console.log("er",err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_email) {
            // If the error is due to a duplicate email (code 11000 is for duplicate key error)
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Candidate failed.' });
        }
    }
}
 
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
//delete user by id
exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageCandidateModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Candidate is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Candidate Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Candidate data failed.' });

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
        const query = req.query.search;

        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const searchQuery = {
            $or: [
                { candidate_first_name: { $regex: new RegExp(query, "i") } },
                { candidate_last_name: { $regex: new RegExp(query, "i") } },
                { candidate_email: { $regex: new RegExp(query, "i") } },
                { candidate_mobile: { $regex: new RegExp(query, "i") } }

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
