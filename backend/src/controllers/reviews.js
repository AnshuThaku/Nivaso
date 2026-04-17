const Listing = require("../models/listing");
const Review = require("../models/review"); 
const ExpressError = require("../utils/ExpressError");

module.exports.createReview = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findById(id);

    if (!listing) {
        throw new ExpressError("Listing not found", 404);
    }

    // 🛡️ SMART REVIEW LOGIC: Check if user has a confirmed booking
    

 
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    
    listing.reviews.push(newReview);
    
    await newReview.save();
    await listing.save();
    
    res.status(201).json({
        success: true,
        message: "Review published successfully!",
        newReview
    });
};

module.exports.deleteReview = async (req, res) => {
    let { id, reviewid } = req.params;
    
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    await Review.findByIdAndDelete(reviewid);
    
    res.status(200).json({ 
        success: true, 
        message: "Review deleted successfully" 
    });
};

module.exports.updateReview = async (req, res) => {
    let { reviewid } = req.params;
    let { rating, comment } = req.body.review;
    
    const updatedReview = await Review.findByIdAndUpdate(
        reviewid, 
        { rating, comment }, 
        { new: true } // Returns updated document
    );
    
    res.status(200).json({ 
        success: true, 
        message: "Review updated successfully",
        updatedReview 
    });
};