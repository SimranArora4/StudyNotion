const express = require('express');
const router = express.Router();

// Controllers
const {
    signup,
    login,
    sendOtp,
    changePassword
} = require('../controllers/Auth');

// Resetpassword controllers
const {
    resetPasswordToken,
    resetPassword,
} = require('../controllers/ResetPassword');


// Middleware
const { auth, isAdmin } = require("../middlewares/auth");
const { getAllStudents, getAllInstructors } = require('../controllers/Profile');


// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user signup
router.post('/signup', signup);

// Route for user login
router.post('/login', login);

// Route for sending OTP to the user's email
router.post('/sendotp', sendOtp);

// Route for Changing the password
router.post('/changepassword', auth, changePassword);



// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post('/reset-password-token', resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)


// ********************************************************************************************************
//                                     Only for Admin - getAllStudents & getAllInstructors
// ********************************************************************************************************

router.get("/all-students", auth, isAdmin, getAllStudents)
router.get("/all-instructors", auth, isAdmin, getAllInstructors)



module.exports = router