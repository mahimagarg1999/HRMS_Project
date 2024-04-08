const manageEmployeeModel = require("../models/Employee.model")
const status = require("../config/status");

//add Employee
exports.create = async (req, res) => {
    try {
        var obj = {
            // employee_id: req.body.employee_id,
            employee_first_name: req.body.employee_first_name,
            employee_last_name: req.body.employee_last_name,
            employee_mobile: req.body.employee_mobile,
            employee_alternate_mobile: req.body.employee_alternate_mobile,
            employee_email: req.body.employee_email,
            employee_password: req.body.employee_password,
            employee_address: req.body.employee_address,
            employee_city: req.body.employee_city,
            employee_state: req.body.employee_state,
            employee_other_info: req.body.employee_other_info,
            employee_dob: req.body.employee_dob,
            employee_doj: req.body.employee_doj,
            employee_skills: req.body.employee_skills,
            employee_experience: req.body.employee_experience,
            employee_resume: req.body.employee_resume,
            employee_id_proof: req.body.employee_id_proof,
            employee_permanant_address_proof: req.body.employee_permanant_address_proof,
            employee_local_address_proof: req.body.employee_local_address_proof,
            employee_reference_one_name: req.body.employee_reference_one_name,
            employee_reference_one_mobile: req.body.employee_reference_one_mobile,
            employee_reference_two_name: req.body.employee_reference_two_name,
            employee_reference_two_mobile: req.body.employee_reference_two_mobile,
            employee_info1: req.body.employee_info1,
            employee_info2: req.body.employee_info2,
            employee_info3: req.body.employee_info3,
            employee_info4: req.body.employee_info4,
            employee_info5: req.body.employee_info5,
            employee_info6: req.body.employee_info6,
            employee_info7: req.body.employee_info7,
            employee_info8: req.body.employee_info8,
            employee_info9: req.body.employee_info9,
            employee_info10: req.body.employee_info10,

        }
        const newmanageEmployeeModel = new manageEmployeeModel(obj);
        let result = await newmanageEmployeeModel.save();
        res.json({ success: true, status: status.OK, msg: 'Adding Employee is successfully.' });

    }
    catch (err) {
        return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Adding Employee  failed.' });

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
        let result = await manageEmployeeModel.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    // employee_id: req.body.employee_id,
                    employee_first_name: req.body.employee_first_name,
                    employee_last_name: req.body.employee_last_name,
                    employee_mobile: req.body.employee_mobile,
                    employee_alternate_mobile: req.body.employee_alternate_mobile,
                    employee_email: req.body.employee_email,
                    employee_password: req.body.employee_password,
                    employee_address: req.body.employee_address,
                    employee_city: req.body.employee_city,
                    employee_state: req.body.employee_state,
                    employee_other_info: req.body.employee_other_info,
                    employee_dob: req.body.employee_dob,
                    employee_doj: req.body.employee_doj,
                    employee_skills: req.body.employee_skills,
                    employee_experience: req.body.employee_experience,
                    employee_resume: req.body.employee_resume,
                    employee_id_proof: req.body.employee_id_proof,
                    employee_permanant_address_proof: req.body.employee_permanant_address_proof,
                    employee_local_address_proof: req.body.employee_local_address_proof,
                    employee_reference_one_name: req.body.employee_reference_one_name,
                    employee_reference_one_mobile: req.body.employee_reference_one_mobile,
                    employee_reference_two_name: req.body.employee_reference_two_name,
                    employee_reference_two_mobile: req.body.employee_reference_two_mobile,
                    employee_info1: req.body.employee_info1,
                    employee_info2: req.body.employee_info2,
                    employee_info3: req.body.employee_info3,
                    employee_info4: req.body.employee_info4,
                    employee_info5: req.body.employee_info5,
                    employee_info6: req.body.employee_info6,
                    employee_info7: req.body.employee_info7,
                    employee_info8: req.body.employee_info8,
                    employee_info9: req.body.employee_info9,
                    employee_info10: req.body.employee_info10,
                }
            },
        ).lean().exec();

        if (result) {
            res.json({ success: true, status: status.OK, msg: 'Employee is updated successfully.' });
        }
        else {
            return res.json({ success: false, status: status.NOTFOUND, msg: 'Employee Id not found' });
        }
    }
    catch (err) {
         return res.json({ success: false, status: status.INTERNAL_SERVER_ERROR, err: err, msg: 'Update Employee failed.' });

    }
}

//get all users 
exports.list = async (req, res) => {
    try {
        const data = await manageEmployeeModel.find({}).lean().exec();
        return res.json({ data: data, success: true, status: status.OK });
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
         const ids = req.query.ids;

        // Check if the 'ids' parameter is not available or is not an array
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
           return res.json({ success: false, status: status.NOTFOUND, msg: "IDs parameter not available or invalid" });
        }
       
        // Use $in operator to match multiple IDs and delete them
        let result = await manageEmployeeModel.deleteMany({ _id: { $in: ids} }).lean().exec();

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
        console.log("error",err);
        return res.json({ success: false, status: status.INVALIDSYNTAX, err: err, msg: 'Get Employee failed.' });
    }

}




