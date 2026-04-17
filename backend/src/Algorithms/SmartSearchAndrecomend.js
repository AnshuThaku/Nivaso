const History = require('../models/HistoryModel');
const Listing = require('../models/Listing');

// ── 1. GET RECOMMENDATIONS ──
exports.getRecommendations = async (req, res) => {
  const identity = req.identity;

  // Step 1: Fetch last 20 viewed listings by this user/guest
  const recentViews = await History.find({ ...identity, actionType: 'VIEW' })
    .sort({ createdAt: -1 })
    .limit(20);

  // Fallback: If no history exists, return top Trending listings
  if (recentViews.length === 0) {
    const fallbackListings = await Listing.find({ category: 'Trending' }).limit(6);
    return res.status(200).json({ success: true, recommendations: fallbackListings });
  }

  // Step 2: Extract patterns (Unique Categories, Unique Locations, Average Price)
  const categories = [...new Set(recentViews.map(v => v.category).filter(Boolean))];
  const locations = [...new Set(recentViews.map(v => v.location).filter(Boolean))];
  
  // Calculate average price of viewed listings
  const validPrices = recentViews.map(v => v.price).filter(p => p > 0);
  const avgPrice = validPrices.length > 0 
    ? validPrices.reduce((a, b) => a + b, 0) / validPrices.length 
    : 10000; // default fallback price

  // Exclude listings they have already viewed to show fresh content
  const viewedListingIds = recentViews.map(v => v.listingId);

  // Step 3: Query the Database
  const recommendations = await Listing.find({
    _id: { $nin: viewedListingIds }, // Exclude already viewed
    $or: [
      { category: { $in: categories } },
      { location: { $in: locations } }
    ],
    // Show listings up to 30% more expensive than their average, to allow slight upselling but keep it relevant
    price: { $lte: avgPrice * 1.3 } 
  }).limit(6);

  // Fallback if the personalized query returns too few results
  if (recommendations.length < 3) {
      const extraListings = await Listing.find({ _id: { $nin: viewedListingIds } }).limit(6);
      return res.status(200).json({ success: true, recommendations: extraListings });
  }

  res.status(200).json({ success: true, recommendations });
};

// ── 2. SEARCH SUGGESTIONS (Autocomplete) ──
exports.getSearchSuggestions = async (req, res) => {
  const { q } = req.query;
  
  if (!q || q.length < 2) {
      return res.status(200).json({ success: true, suggestions: [] });
  }

  // Flexible Regex Search matching title OR location OR category
  const regex = new RegExp(q.trim(), 'i');

  const suggestions = await Listing.find({
    $or: [
      { title: regex },
      { location: regex },
      { category: regex }
    ]
  })
  .limit(5)
  .select('title location category image'); // Return only what's needed for the UI dropdown

  res.status(200).json({ success: true, suggestions });
};