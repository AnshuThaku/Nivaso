const User = require("../models/user");
const Listing = require("../models/listing");
const expressError = require("../utils/ExpressError");


module.exports.getUserProfile = async (req, res) => {
    // 1. User ki basic info lo
    const user = await User.findById(req.user._id).select("-password"); // Password hide rakho
    if(!user){
        throw new expressError(404, "User not found");
    }


    res.status(200).json({
        success: true,
        user,
        bookings: myBookings
    });
};