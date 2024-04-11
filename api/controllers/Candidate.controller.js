const manageCandidateModel = require("../models/Candidate.model")
const status = require("../config/status");

//add Candidate
 exports.create = async (req, res) => {
    try {
        var obj = {
            candidate_first_name: req.body.candidate_first_name,
            candidate_last_name: req.body.candidate_last_name,
            candidate_mobile: req.body.candidate_mobile,
            candidate_alternate_mobile: req.body.candidate_alternate_mobile,
            candidate_email: req.body.candidate_email,
            candidate_skype: req.body.candidate_skype,
            candidate_profile: req.body.candidate_profile,
            candidate_skills: req.body.candidate_skills,
            candidate_experience: req.body.candidate_experience,
            candidate_expected_salary: req.body.candidate_expected_salary,
            candidate_expected_joining_date: req.body.candidate_expected_joining_date,
            candidate_joining_immediate: req.body.candidate_joining_immediate,
            candidate_marrital_status: req.body.candidate_marrital_status,
            candidate_written_round: req.body.candidate_written_round,
            candidate_machine_round: req.body.candidate_machine_round,
            candidate_technical_interview_round: req.body.candidate_technical_interview_round,
            candidate_hr_interview_round: req.body.candidate_hr_interview_round,
            candidate_selection_status: req.body.candidate_selection_status,
            candidate_feedback: req.body.candidate_feedback,
            candidate_from_consultancy: req.body.candidate_from_consultancy,
            candidate_info1: req.body.candidate_info1,
            candidate_info2: req.body.candidate_info2,
            candidate_info3: req.body.candidate_info3,
            candidate_info4: req.body.candidate_info4,
            candidate_info5: req.body.candidate_info5,
            candidate_info6: req.body.candidate_info6,
            candidate_info7: req.body.candidate_info7,
            candidate_info8: req.body.candidate_info8,
            candidate_info9: req.body.candidate_info9,
            candidate_info10: req.body.candidate_info10,

        }
        const newmanageCandidateModel = new manageCandidateModel(obj);
        let result = await newmanageCandidateModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Candidate is successfully.' });
    }
    catch (err) {
        if (err.code === 11000 && err.keyPattern && err.keyPattern.candidate_email) {
            // If the error is due to a duplicate email (code 11000 is for duplicate key error)
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This email is already registered.' });
        } else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Candidate failed.' });
        }
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
        let result = await manageCandidateModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    // candidate_id: req.body.candidate_id,
                    candidate_first_name: req.body.candidate_first_name,
                    candidate_last_name: req.body.candidate_last_name,
                    candidate_mobile: req.body.candidate_mobile,
                    candidate_alternate_mobile: req.body.candidate_alternate_mobile,
                    candidate_email: req.body.candidate_email,
                    candidate_skype: req.body.candidate_skype,
                    candidate_profile: req.body.candidate_profile,
                    candidate_skills: req.body.candidate_skills,
                    candidate_experience: req.body.candidate_experience,
                    candidate_expected_salary: req.body.candidate_expected_salary,
                    candidate_expected_joining_date: req.body.candidate_expected_joining_date,
                    candidate_joining_immediate: req.body.candidate_joining_immediate,
                    candidate_marrital_status: req.body.candidate_marrital_status,
                    candidate_written_round: req.body.candidate_written_round,
                    candidate_machine_round: req.body.candidate_machine_round,
                    candidate_technical_interview_round: req.body.candidate_technical_interview_round,
                    candidate_hr_interview_round: req.body.candidate_hr_interview_round,
                    candidate_selection_status: req.body.candidate_selection_status,
                    candidate_feedback: req.body.candidate_feedback,
                    candidate_from_consultancy: req.body.candidate_from_consultancy,
                    candidate_info1: req.body.candidate_info1,
                    candidate_info2: req.body.candidate_info2,
                    candidate_info3: req.body.candidate_info3,
                    candidate_info4: req.body.candidate_info4,
                    candidate_info5: req.body.candidate_info5,
                    candidate_info6: req.body.candidate_info6,
                    candidate_info7: req.body.candidate_info7,
                    candidate_info8: req.body.candidate_info8,
                    candidate_info9: req.body.candidate_info9,
                    candidate_info10: req.body.candidate_info10,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Candidate is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Candidate Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Candidate failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageCandidateModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Candidate failed.' });

    }
}

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
        console.log("error",err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Candidate failed.' });
    }

}

