const express = require("express");
const router = express.Router({ mergeParams: true }); 
const {createBooking,confirmPayment} = require("../controllers/bookingController");
const {isloggedin } = require("../middleware");

// Booking create karne ke liye (Aap yahan isLoggedIn middleware zaroor lagana)
router.post("/", isloggedin, (createBooking)); 

// Payment confirm karne ke liye naya route
router.post("/confirm-payment", (confirmPayment));

module.exports = router;