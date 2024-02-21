const manageAdminModel = require("../models/Admin.model")
const status = require("../config/status");

//add expenses
exports.create = async (req, res) => {
     console.log("expenses test")
    try {
        var obj = {
            admin_name:req.body.admin_name,
            admin_email:req.body.admin_email,
            admin_password:req.body.admin_password,
            admin_city:req.body.admin_city,
            admin_state:req.body.admin_state,
            admin_address:req.body.admin_address,
            admin_phone:req.body.admin_phone,
            admin_other_info:req.body.admin_other_info,
            admin_date:req.body.admin_date,
           
        }
        const newmanageAdminModel = new manageAdminModel(obj);
        let result = await newmanageAdminModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Admin is successfully.' });

    }
    catch (err) {
        console.log("err",err)
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Admin  failed.' });

    }
}


//update by id
exports.edit = async (req, res) => {
    var id = req.body.id;
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id;
    try {
        let result = await manageAdminModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    admin_name:req.body.admin_name,
                    admin_email:req.body.admin_email,
                    admin_password:req.body.admin_password,
                    admin_city:req.body.admin_city,
                    admin_state:req.body.admin_state,
                    admin_address:req.body.admin_address,
                    admin_phone:req.body.admin_phone,
                    admin_other_info:req.body.admin_other_info,
                    admin_date:req.body.admin_date,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Admin is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Admin Id not found' });
        }
    }
    catch (err) {
         return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Admin failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageAdminModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Admin failed.' });

    }
}

//delete user by id
exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageAdminModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Admin is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Admin Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete Admin data failed.' });

    }
}

exports.multidelete = async (req, res) => {
    try {
         const ids = req.query.ids;

        // Check if the 'ids' parameter is not available or is not an array
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
           return res.json({ success: false, status: status.NOTFOUND, msg: "IDs parameter not available or invalid" });
        }
       
        // Use $in operator to match multiple IDs and delete them
        let result = await manageAdminModel.deleteMany({ _id: { $in: ids} }).lean().exec();

        // Check if at least one document was deleted
        if (result.deletedCount > 0) {
            res.json({ success: true, status: status.OK, msg: 'Admin data deleted successfully.' });
        } else {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'Delete Admin data  failed. No matching students found for the given IDs.' });
        }
    } catch (err) {
        return res.status(403).send({ success: false, status: status.UNAUTHORIZED, msg: 'Unauthorized.' });
    }
}




