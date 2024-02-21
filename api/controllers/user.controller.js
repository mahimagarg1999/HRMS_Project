
 const manageUserModel = require("../models/user.model");
const status = require("../config/status");

//  LOGIN without token
exports.login = async (req, res) => {
    console.log("testdugkhdfinvk,")

    try {
        var email = req.body && req.body.email ? req.body.email : '';
        var password = req.body && req.body.password ? req.body.password : '';
        var user = await manageUserModel.findOne({ email: email }).select("email username password ").lean().exec();

        if (!user) {
            res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. User not found.' });
        } else {

            let ifPasswordMatch = await manageUserModel.findOne({ password: password }).lean().exec();
            if (ifPasswordMatch) {

                var userResp = user;
                delete userResp.password;

                res.json({ success: true, msg: 'login successful', user: userResp });
            } else {
                res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. Wrong password.' });
            }
        }
    } catch (e) {
        console.log("e", e)
        return res.json({ success: false, status: statusCode.INVALIDSYNTAX, err: e, msg: 'Error in login.' });
    }
}

exports.signup = async (req, res) => {
    try {
        let UserExists = await manageUserModel.findOne({ email: req.body.email }).lean().exec();
        if (UserExists) {
            return res.json({ success: false, status: status.INVALIDSYNTAX, msg: 'User already registered.' });
        }

        var obj = {
            fname: req.body.fname,
            lname: req.body.lname,
            email: req.body.email,
            password: req.body.password,
            dob: req.body.dob,
            gender: req.body.gender,
            standard: req.body.standard,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            role: req.body.role,
            status: req.body.status
        }
        const newmanageUserModel = new manageUserModel(obj);
        let result = await newmanageUserModel.save();
        res.json({ success: true, status: status.OK, msg: 'New user add  successfully.' });

    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Save Users failed.' });

    }
}

exports.updateUser = async (req, res) => {
    var id = req.body.id;
    if (id === undefined) {
        return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
    }
    delete req.query.id;
    try {
        let result = await manageUserModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    fname: req.body.fname,
                    lname: req.body.lname,
                    email: req.body.email,
                    password: req.body.password,
                    dob: req.body.dob,
                    gender: req.body.gender,
                    standard: req.body.standard,
                    address: req.body.address,
                    city: req.body.city,
                    state: req.body.state,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'User is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'User Id not found' });
        }
    }
    catch (err) {
        // return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Update User failed.' });
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update User failed.' });

    }
}