const express = require("express");
const router = express.Router();
const Wrapasync = require('../utils/Wrapasync');
const usercontroller = require("../controllers/authController.js");

router.post("/signup", Wrapasync(usercontroller.signup));

router.post("/login", Wrapasync(usercontroller.login)
);

router.get("/logout", Wrapasync(usercontroller.logout));

module.exports = router;