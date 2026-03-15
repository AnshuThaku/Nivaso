const Listing = require("../models/listing");
const Review = require("../models/review"); // 🔥 FIX: Capital 'R' for Model
const ExpressError = require("../utils/ExpressError"); // Error throw karne ke liye

module.exports.createReview = async(req, res) => {
    let listing = await Listing.findById(req.params.id);
 
    // 🔥 FIX: Agar listing nahi mili, toh gracefully error feko (Crash se bacho)
    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    res.status(201).json(newReview);
};

module.exports.deleteReview = async(req, res) => {
    let { id, reviewid } = req.params;
    
    // `$pull` is a pro-move! Maza aagaya dekh kar.
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    
    res.status(200).json({ message: "Review deleted" });
};

module.exports.updateReview = async(req, res) => {
    let { reviewid } = req.params;
    let { rating, comment } = req.body.review;
    
    await Review.findByIdAndUpdate(reviewid, { rating, comment });
    
    res.status(200).json({ message: "Review updated" });
};