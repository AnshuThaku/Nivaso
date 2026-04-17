const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  listing: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing', 
    required: true 
  },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  totalPrice: { type: Number, required: true },
  guests: { type: Number, required: true, min: 1 },
  
  // Two-tier status system (Booking Status vs Payment Status)
  status: { 
    type: String, 
    enum: ["pending", "confirmed", "cancelled"], 
    default: "pending" 
  },
  paymentStatus: { 
    type: String, 
    enum: ["pending", "paid", "failed"], 
    default: "pending" 
  },
  
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  
  idempotencyKey: { 
    type: String, 
    unique: true, 
    required: true 
  }
}, { timestamps: true });

// 🚀 CRITICAL INDEX: Optimizes the overlapping availability query
bookingSchema.index({ listing: 1, status: 1, checkIn: 1, checkOut: 1 });

module.exports = mongoose.model('Booking', bookingSchema);