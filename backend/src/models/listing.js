const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  images: [
    {
      filename: String,
      url: String,
    }
  ],
  price: Number,
  location: String,
  country: String,
  
  // GeoJSON coordinates for nearby search
  coordinates: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      default: undefined
    }
  },
  
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    enum: [
      "Trending",
      "Rooms",
      "Mountains",
      "Castles",
      "Farms",
      "Domes",
      "Boats",
      "Iconic cities",
      "Camping",
      "Amazing pools",
      "Arctic",
    ],
  },
});


// 🔥 FIX 1: Delete Middleware Bug Fix
// Jab listing delete hogi, toh uske saare reviews bhi delete ho jayenge.
// Yahan hum 'mongoose.model("Review")' use kar rahe hain taaki "Review is not defined" error na aaye.
listingSchema.post("findOneAndDelete", async (listingDoc) => {
  if (listingDoc && listingDoc.reviews.length > 0) {
    // Bina require() kiye Mongoose se direct Review model utha liya
    await mongoose.model('Review').deleteMany({ _id: { $in: listingDoc.reviews } });
  }
});

// 🔥 FIX 2: OverwriteModelError Fix
// Agar model pehle se register ho chuka hai toh wahi use karo, warna naya banao.
module.exports = mongoose.models.Listing || mongoose.model("Listing", listingSchema);