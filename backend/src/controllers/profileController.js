const User = require("../models/user");
const Listing = require("../models/listing");
const Booking = require("../models/BookingModel"); // 🚀 Ye import karna zaruri hai
const expressError = require("../utils/ExpressError");

module.exports.getUserProfile = async (req, res) => {
    // 1. User ki basic info lo
    const user = await User.findById(req.user._id).select("-password"); 
    if(!user){
        throw new expressError(404, "User not found");
    }

    // 2. 🚀 User ki bookings find karo (YAHI MISSING THA!)
    // Populate lagaya hai taaki frontend ko listing ki image/title bhi mil jaye
    const myBookings = await Booking.find({ user: req.user._id }).populate('listing');

    // 3. Response send karo
    res.status(200).json({
        success: true,
        user,
        bookings: myBookings // 🔥 Ab ye perfectly chalega!
    });
};