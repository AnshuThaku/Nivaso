const History = require('../models/HistoryModel');
const Listing = require('../models/listing'); // ✅ Small 'l' karein// Assuming Listing model exists
const ExpressError = require('../utils/ExpressError');

// ── 1. TRACK SEARCH ──
exports.trackSearch = async (req, res) => {
  const { searchQuery } = req.body;
  if (!searchQuery) throw new ExpressError(400, "Search query is required");

  const identity = req.identity; // Comes from middleware (userId or guestId)

  // Mongoose "findOneAndUpdate" with { upsert: true }
  // Agar query exist karti hai, toh uska 'createdAt' update kardo (sabse upar aa jayegi)
  // Agar nahi karti, toh naya create kardo.
  await History.findOneAndUpdate(
    { 
      ...identity, 
      actionType: 'SEARCH', 
      searchQuery: searchQuery.toLowerCase() // case insensitive
    },
    { 
      $set: { createdAt: Date.now() } 
    },
    { upsert: true, new: true }
  );

  res.status(200).json({ success: true, message: "Search tracked" });
};

// ── 2. TRACK VIEW ──
exports.trackView = async (req, res) => {
  const { listingId } = req.body;
  const identity = req.identity;

  // Listing se metadata fetch karo (Recommendation engine ke liye zaroori hai)
  const listing = await Listing.findById(listingId).select('category location price');
  if (!listing) throw new ExpressError(404, "Listing not found");

  const newView = new History({
    ...identity,
    actionType: 'VIEW',
    listingId: listing._id,
    category: listing.category,
    location: listing.location,
    price: listing.price
  });

  await newView.save();

  res.status(200).json({ success: true, message: "View tracked" });
};

// ── 3. GET RECENT SEARCHES ──
exports.getRecentSearches = async (req, res) => {
  const identity = req.identity;

  const recentSearches = await History.find({ ...identity, actionType: 'SEARCH' })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('searchQuery createdAt');

  res.status(200).json({ success: true, recentSearches });
};