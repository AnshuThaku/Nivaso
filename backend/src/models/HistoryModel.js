const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    default: null 
  },
  guestId: { 
    type: String, 
    default: null 
  },
  actionType: { 
    type: String, 
    enum: ["SEARCH", "VIEW"], 
    required: true 
  },
  
  // ── SEARCH Details ──
  searchQuery: { 
    type: String, 
    trim: true 
  },

  // ── VIEW Details ──
  listingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Listing' 
  },
  category: { type: String },
  location: { type: String },
  price: { type: Number },
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// 🚀 CRITICAL INDEXES: 
// Ye indexes recommendations aur recent searches fetch karne ko lightning fast banayenge
historySchema.index({ userId: 1, actionType: 1, createdAt: -1 });
historySchema.index({ guestId: 1, actionType: 1, createdAt: -1 });

// Custom Validation: Either userId OR guestId MUST exist
historySchema.pre('save', function (next) {
  if (!this.userId && !this.guestId) {
    return next(new Error('Either userId or guestId must be provided for tracking history.'));
  }
  next();
});

module.exports = mongoose.model('History', historySchema);