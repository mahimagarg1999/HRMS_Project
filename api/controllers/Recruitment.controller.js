
const manageRecruitmentModel = require("../models/Recruitment.model")
const status = require("../config/status");

exports.recruitmentCreate = async (req, res) => {
    try {
        const obj = {
            profile_id: req.body.profile_id,
            profile: req.body.profile,
            description: req.body.description,
            interviewer: req.body.interviewer,
            interview_date: req.body.interview_date,
            notes: req.body.notes,
            no_of_candidate: req.body.no_of_candidate,
            experience: req.body.experience,
            salary: req.body.salary,
            location: req.body.location,
            responsibilities: req.body.responsibilities,
            requiredSkills: req.body.requiredSkills,
            applyNowLink: req.body.applyNowLink,
            whatsappNumber: req.body.whatsappNumber,
            emailId: req.body.emailId

        };

        const newmanageRecruitmentModel = new manageRecruitmentModel(obj);
        const result = await newmanageRecruitmentModel.save();
        res.json({ success: true, status: status.OK, msg: 'Recruitment created successfully.', data: result });
    } catch (err) {
        console.log("er", err)
        if (err.code === 11000 && err.keyPattern && err.keyPattern.profile_id) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This Id is already registered.' });
        }
        else if (err.code === 11000 && err.keyPattern && err.keyPattern.profile) {
            return res.json({ success: false, status: status.BAD_REQUEST, msg: 'This Profile is already added.' });
        }
        else {
            // For other errors
            return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Candidate failed.' });
        }
    }
};


exports.recruitmentEdit = async (req, res) => {
    var id = req.body._id;
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id;
    try {
        let result = await manageRecruitmentModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    profile_id: req.body.profile_id,
                    profile: req.body.profile,
                    description: req.body.description,
                    // department: req.body.department,
                    // applicationStatus: req.body.applicationStatus || 'Applied',
                    interviewer: req.body.interviewer,
                    interview_date: req.body.interview_date,
                    notes: req.body.notes,
                    no_of_candidate: req.body.no_of_candidate,
                    experience: req.body.experience,
                    salary: req.body.salary,
                    location: req.body.location,
                    responsibilities: req.body.responsibilities,
                    requiredSkills: req.body.requiredSkills,
                    applyNowLink: req.body.applyNowLink,
                    whatsappNumber: req.body.whatsappNumber,
                    emailId: req.body.emailId

                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Recruitment  is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Recruitment Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Recruitment failed.' });

    }
}

exports.recruitmentList = async (req, res) => {
    try {
        const data = await manageRecruitmentModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Recruitment failed.' });

    }
}

//delete user by id
exports.recruitmentDelete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageRecruitmentModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Recruitment is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Recruitment Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Recruitment data failed.' });

    }
}

exports.recruitmentMultidelete = async (req, res) => {
    try {
        const ids = req.body.ids;

        // Check if the 'ids' parameter is not available or is not an array
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.json({ success: false, status: status.NOTFOUND, msg: "IDs parameter not available or invalid" });
        }

        // Use $in operator to match multiple IDs and delete them
        let result = await manageRecruitmentModel.deleteMany({ _id: { $in: ids } }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Recruitment data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Recruitment data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}


exports.getRecruitmentById = async (req, res) => {
    try {
        let recruitmentid = req.query.recruitmentid;
        if (recruitmentid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageRecruitmentModel.findOne({ _id: recruitmentid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Recruitment failed.' });
    }

}
exports.sortOrder = async (req, res) => {
    const sortOrder = req.query.order === 'desc' ? -1 : 1;
    const columnName = req.query.coloum;

    try {
        let sortObject = {};
        sortObject[columnName] = sortOrder;

        // Custom pipeline stage for case-insensitive sorting
        const result = await manageRecruitmentModel.aggregate([
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
exports.searchRecruitment = async (req, res) => {
    try {
        const query = req.query.search;

        if (!query) {
            return res.status(400).json({ error: 'No search query provided' });
        }
        const searchQuery = {
            $or: [
                { interviewer: { $regex: new RegExp(query, "i") } },
                { notes: { $regex: new RegExp(query, "i") } },
                { profile: { $regex: new RegExp(query, "i") } },
                { requiredSkills: { $elemMatch: { $regex: new RegExp(query, "i") } } }

 
            ]
        };
        const results = await manageRecruitmentModel.find(searchQuery);

        res.json(results);
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, status: 500, msg: 'Internal Server Error' });
    }
}

exports.getAllProfiles = async (req, res) => {
    try {
        const data = await manageRecruitmentModel.find().lean().exec(); // Fetch all data from MongoDB
        const profiles = data.map(item => ({
            profile_id: item.profile_id, // Extract the profile id
            profile: item.profile // Extract the profile value
        }));
        console.log("data", data)
        console.log("profiles", profiles)


        return res.json({ data: profiles, success: true, status: 200 });
    } catch (err) {
        console.error("Error fetching profiles:", err);
        return res.json({ success: false, status: 500, err: err.message, msg: 'Failed to fetch profiles.' });
    }
};



exports.getAllProfilesData = async (req, res) => {
    try {
        let profileid = req.query.profileid;
        if (!profileid) {
            return res.json({ success: false, status: status.NOT_FOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageRecruitmentModel.findOne({ profile_id: profileid }).select('profile -_id').lean().exec();

        if (!data) {
            return res.json({ success: false, status: status.NOT_FOUND, msg: 'Profile not found.' });
        }

        return res.json({ data: data.profile, success: true, status: status.OK });
    } catch (err) {
        console.error("Error fetching profile:", err);
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err.message, msg: 'Failed to fetch profile.' });
    }
};


exports.getRecruitmentCandidateData = async (req, res) => {
    try {
        const profileId = req.query.profileId;

        // Aggregation pipeline to match profiles from both collections
        const pipeline = [
            {
                $lookup: {
                    from: 'candidates', // name of the recruitment collection in MongoDB
                    localField: 'profile_id',
                    foreignField: 'profile',
                    as: 'canData'
                }
            },
            {
                $match: {
                    profile_id: profileId // match based on candidate profile_id
                }
            },
            {
                $unwind: '$canData' // Unwind the canData array if necessary
            },
            {
                $project: {
                    _id: 0,
                    // Define fields you want to return from both collections
                    recruitment_profile_id: '$profile_id',
                    description: '$description',
                    interviewer: '$interviewer',
                    interview_date: '$interview_date',
                    // Candidate fields
                    candidate_id: '$canData.candidate_id',
                    candidate_first_name: '$canData.candidate_first_name',
                    candidate_last_name: '$canData.candidate_last_name',
                    candidate_mobile: '$canData.candidate_mobile',
                    candidate_email: '$canData.candidate_email',
                    candidate_skills: '$canData.candidate_skills',
                    candidate_experience: '$canData.candidate_experience'
                    // Add more fields as needed
                }
            }
        ];

        const result = await manageRecruitmentModel.aggregate(pipeline);

        if (result.length === 0) {
            return res.status(404).json({ message: 'Candidate data not found for profile_id' });
        }

        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
};






