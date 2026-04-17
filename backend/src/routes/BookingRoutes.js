const WrapAsync = require('../utils/Wrapasync');
const BookingController = require('../controllers/BookingController');
const express = require('express');
const router = express.Router();
const { isloggedin } = require('../middleware/authmiddleware');

router.post('/', isloggedin, WrapAsync(BookingController.createBooking));
router.post('/verify', isloggedin, WrapAsync(BookingController.verifyPayment));
router.get('/my-bookings', isloggedin, WrapAsync(BookingController.getMyBookings));
router.delete('/:id', isloggedin, WrapAsync(BookingController.cancelBooking));

module.exports = router;