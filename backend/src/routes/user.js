const express = require("express");
const router = express.Router();
const Wrapasync = require('../utils/Wrapasync');
const usercontroller = require("../controllers/authController.js");
const { isloggedin } = require("../middleware.js");
const profileController = require("../controllers/profileController.js");

router.get("/profile", isloggedin, Wrapasync(profileController.getUserProfile));

router.post("/signup", Wrapasync(usercontroller.signup));

router.post("/login", Wrapasync(usercontroller.login));

router.get("/logout", Wrapasync(usercontroller.logout));
router.post("/forgot-password", Wrapasync(usercontroller.forgotPassword));
router.post("/reset-password/:token", Wrapasync(usercontroller.resetPassword));

module.exports = router;

