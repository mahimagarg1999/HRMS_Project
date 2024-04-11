const userController = require("../controllers/user.controller");
const express = require("express");
const router = express.Router();
router.route('/login').post(userController.login);
router.route('/signup').post(userController.signup);
router.route('/edit').put(userController.updateUser);
router.route('/list')
    .get(userController.getUsers)
router.route('/get')
    .get(userController.getUserById)
router.route('/changepassword')
    .put(userController.changePassword)
    router.route('/delete')
    .delete(userController.delete)
module.exports = router;


