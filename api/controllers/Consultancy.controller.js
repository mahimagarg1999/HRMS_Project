const manageConsultancyModel = require("../models/Consultancy.model")
const status = require("../config/status");

exports.create = async (req, res) => {
    console.log("expenses test")
    try {
        var obj = {
            // consultancy_id: req.body.consultancy_id,
            consultancy_name: req.body.consultancy_name,
            consultancy_email: req.body.consultancy_email,
            consultancy_website: req.body.consultancy_website,
            consultancy_mobile: req.body.consultancy_mobile,
            consultancy_alternate_mobile: req.body.consultancy_alternate_mobile,
            consultancy_city: req.body.consultancy_city,
            consultancy_state: req.body.consultancy_state,
            consultancy_address: req.body.consultancy_address,
            consultancy_details: req.body.consultancy_details,
        }
        const newmanageConsultancyModel = new manageConsultancyModel(obj);
        let result = await newmanageConsultancyModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Consultancy is successfully.' });

    }
    catch (err) {
        console.log("err-->", err)
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Consultancy failed.' });

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
        let result = await manageConsultancyModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    // consultancy_id: req.body.consultancy_id,
                    consultancy_name: req.body.consultancy_name,
                    consultancy_email: req.body.consultancy_email,
                    consultancy_website: req.body.consultancy_website,
                    consultancy_mobile: req.body.consultancy_mobile,
                    consultancy_alternate_mobile: req.body.consultancy_alternate_mobile,
                    consultancy_city: req.body.consultancy_city,
                    consultancy_state: req.body.consultancy_state,
                    consultancy_address: req.body.consultancy_address,
                    consultancy_details: req.body.consultancy_details,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Consultancy is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Consultancy Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Consultancy failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageConsultancyModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Consultancy failed.' });

    }
}

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
    // try {
    //     const ids = req.query.ids;

    //     // Check if the 'ids' parameter is not available or is not an array
    //     if (!ids || !Array.isArray(ids) || ids.length === 0) {
    //         return res.json({ success: false, status: status.NOTFOUND, msg: "IDs parameter not available or invalid" });
    //     }

    //     // Use $in operator to match multiple IDs and delete them
    //     let result = await manageConsultancyModel.deleteMany({ _id: { $in: ids } }).lean().exec();

    //     // Check if at least one document was deleted
    //     if (result.deletedCount > 0) {
    //         res.json({ success: true, status: status.OK, msg: 'Consultancy data deleted successfully.' });
    //     } else {
    //         return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Consultancy data  failed. No matching students found for the given IDs.' });
    //     }
    // } catch (err) {
    //     return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    // }
    try {
        console.log(req.body)
        const userIds = req.body.ids; // Assuming the request body contains an array of user IDs
        if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
            return res.status(400).json({ message: 'Invalid or missing user IDs' });
        }

        const result = await manageConsultancyModel.deleteMany({ _id: { $in: userIds } });
        res.status(200).json({ message: 'Users deleted successfully', result });
    } catch (error) {
        console.error('Error deleting users:', error);
        res.status(500).json({ message: 'Internal server error' });
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
        console.log("error",err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Candidate failed.' });
    }

}


