
const manageUserModel = require("../models/user.model");
const status = require("../config/status");
const Employee = require('../models/Employee.model');

exports.login = async (req, res) => {
    console.log("testdugkhdfinvk,")
    console.log("userResp",req.body)    

    try {
        var email = req.body && req.body.email ? req.body.email : '';
        var password = req.body && req.body.password ? req.body.password : '';
        if (req.body && req.body.role && req.body.role === 'HR') {
            var user = await manageUserModel.findOne({ email: email }).select(" email fname lname role password").lean().exec();
        } else {
            userModel = Employee;
            var user = await Employee.findOne({ employee_email: email }).select("employee_first_name employee_last_name employee_email employee_password ").lean().exec();
        }  
        if (!user) {
            res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. User not found.' });
        } else {
            if(req.body.role=='HR')
            {
                var ifPasswordMatch = await manageUserModel.findOne({password: password }).lean().exec();
            }
            else
            {
                var ifPasswordMatch = await Employee.findOne({ employee_password: password}).lean().exec();
            }
          
            if (ifPasswordMatch) {

                var userResp = user;

                res.json({ success: true, msg: 'login successful', user: userResp });
            } else {
                res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. Wrong password.' });
            }
        }
    } catch (e) {
        console.log("e", e)
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: e, msg: 'Error in login.' });
    }
}


// exports.login = async (req, res) => {
//     console.log("testdugkhdfinvk,")
//     try {
//         var email = req.body && req.body.email ? req.body.email : '';
//         var password = req.body && req.body.password ? req.body.password : '';
//         if (req.body && req.body.role && req.body.role === 'user') {
//             var user = await manageUserModel.findOne({ email: email }).select("email fname lname password").lean().exec();
//         } else {
//             var user = await Employee.findOne({ employee_email: email }).select("employee_first_name employee_last_name employee_email employee_password ").lean().exec();
//             console.log(req.body)
//         }
//         if (!user) {
//             res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. User not found.' });
//         } else {
//             if (req.body.role == 'user') {
//                 var ifPasswordMatch = await manageUserModel.findOne({ password: password }).lean().exec();
//             }
//             else {
//                 var ifPasswordMatch = await Employee.findOne({ employee_password: password }).lean().exec();
//             }
//             if (ifPasswordMatch) {
//                 var userResp = user;
//                 // delete userResp.password;

//                 res.json({ success: true, msg: 'login successful', user: userResp });
//             } else {
//                 res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. Wrong password.' });
//             }
//         }
//     } catch (e) {
//         console.log("e", e)
//         return res.json({ success: false, status: status.INVALIDSYNTAX, err: e, msg: 'Error in login.' });
//     }
// }
// =============================== done by me 

// exports.login = async (req, res) => {
//     console.log("Login attempt received");
//     try {
//         const email = req.body.email || '';
//         const password = req.body.password || '';
//         const role = req.body.role || '';

//         let model;
//         if (role === 'user') {
//             model = manageUserModel; // For users
//         } else if (role === 'employee') {
//             model = Employee; // For employees
//         } else {
//             return res.json({ success: false, status: "INVALID_ROLE", msg: 'Invalid role specified.' });
//         }
//         // Find the account by email
//         var account = await model.findOne({ email: email }).select("email username password").lean().exec();
//         if (!account) {
//             return res.json({ success: false, status: "NOT_FOUND", msg: 'Authentication failed. Account not found.' });
//         } else {
//             // Direct password comparison, consider using bcrypt in real applications
//             if (account.password === password) {
//                 // Remove password before sending response
//                 var accountResp = { ...account, password: undefined };
//                 return res.json({ success: true, msg: 'Login successful', user: accountResp });
//             } else {
//                 return res.json({ success: false, status: "WRONG_PASSWORD", msg: 'Authentication failed. Wrong password.' });
//             }
//         }
//     } catch (e) {
//         console.log("Error:", e);
//         return res.json({ success: false, status: "SERVER_ERROR", err: e, msg: 'Error in login process.' });
//     }
// };
// ====================
//  LOGIN without token
// exports.login = async (req, res) => {
//     console.log("testdugkhdfinvk,")

//     try {
//         var email = req.body && req.body.email ? req.body.email : '';
//         var password = req.body && req.body.password ? req.body.password : '';
//         var user = await manageUserModel.findOne({ email: email }).select("email username password ").lean().exec();

//         if (!user) {
//             res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. User not found.' });
//         } else {

//             let ifPasswordMatch = await manageUserModel.findOne({ password: password }).lean().exec();
//             if (ifPasswordMatch) {

//                 var userResp = user;
//                 delete userResp.password;

//                 res.json({ success: true, msg: 'login successful', user: userResp });
//             } else {
//                 res.json({ success: false, status: status.NOTFOUND, msg: 'Authentication failed. Wrong password.' });
//             }
//         }
//     } catch (e) {
//         console.log("e", e)
//         return res.json({ success: false, status: statusCode.INVALIDSYNTAX, err: e, msg: 'Error in login.' });
//     }
// }

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
//get all users 
exports.getUsers = async (req, res) => {
    try {
        const data = await manageUserModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Get Users failed.' });

    }
}
exports.updateUser = async (req, res) => {
    var id = req.body._id;
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
                    role: req.body.role
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

exports.getUserById = async (req, res) => {
    try {
        let userid = req.query.userid;
        // const ID = req.query.userid;
        if (userid === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        const data = await manageUserModel.findOne({ _id: userid }).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
    }
    catch (err) {
        console.log("error", err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get user failed.' });
    }

}

exports.changePassword = async (req, res) => {
    console.log("req.body----", req.body)
    try {
        const email = req.body.email;
        const currentPassword = req.body.currentPassword;
        const newPassword = req.body.newPassword;
        const confirmPassword = req.body.confirmPassword; // New field for confirmation password
        // Find the user in the database
        const user = await manageUserModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, msg: 'User not found.' });
        }
        // Verify current password
        if (currentPassword !== user.password) {
            return res.json({ success: false, msg: 'Invalid current password.' });
        }
        if (newPassword !== confirmPassword) {
            return res.json({ success: false, msg: 'New password and confirmation password do not match.' });
        }
        await manageUserModel.updateOne({ email }, { password: newPassword });
        return res.json({ success: true, msg: 'Password changed successfully.' });
    } catch (e) {
        console.error("Error in change password:", e);
        return res.json({ success: false, err: e, msg: 'Error in change password.' });
    }
};

exports.delete = async (req, res) => {
    try {
        const ID = req.query.id;
        if (ID === undefined) {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Id Parameter Not Available' });
        }
        let result = await manageUserModel.findOneAndDelete({ _id: ID }).lean().exec();
        if (result) {
            res.json({ success: true, status: status.OK, msg: 'User is Deleted successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'User Id not found' });
        }
    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Delete User data failed.' });

    }
}



