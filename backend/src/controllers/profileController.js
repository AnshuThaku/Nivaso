const User = require("../models/user");
const Booking = require("../models/BookingModel");
const Listing = require("../models/listing");
const expressError = require("../utils/ExpressError");


module.exports.getUserProfile = async (req, res) => {
    // 1. User ki basic info lo
    const user = await User.findById(req.user._id).select("-password"); // Password hide rakho
    if(!user){
        throw new expressError(404, "User not found");
    }

    // 2. User ki saari bookings dhoondo aur Listing ki details bhi 'populate' karo
    const myBookings = await Booking.find({ user: req.user._id })
        .populate("listing")
        .sort({ createdAt: -1 }); // Latest bookings pehle dikhao

    res.status(200).json({
        success: true,
        user,
        bookings: myBookings
    });
};