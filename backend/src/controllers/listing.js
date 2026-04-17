const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  // 1. Query params se data lo (Frontend se aayega)
  const { search, category, page = 1 } = req.query; 
  
  let query = {};
  
  // 2. SEARCH FILTERS
  if (search && search.trim() !== "") {
    const regex = new RegExp(search.trim(), 'i'); 
    query.$or = [
      { location: regex },
      { country: regex },
      { title: regex },
      { description: regex }
    ];
  }

  // 3. CATEGORY FILTERS
  if (category && category !== "Trending" && category !== "") {
    query.category = category;
  }

  // 4. PAGINATION LOGIC
  const limit = 6; // Ek page par 6 listings
  const skip = (parseInt(page) - 1) * limit;

  // Database se sirf utni listings fetch karo jitni ek page par dikhani hain
  const listings = await Listing.find(query).skip(skip).limit(limit);
  
  // Total listings count karo (Frontend ko total pages batane ke liye)
  const totalListings = await Listing.countDocuments(query);

  // 5. Naya Response Format
  res.json({
    success: true,
    listings: listings,
    totalPages: Math.ceil(totalListings / limit),
    currentPage: parseInt(page)
  });
};

module.exports.new = (req, res) => {
  res.json({ message: "Render form for creating a new listing" });
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
    
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
};

module.exports.create = async (req, res) => {
  const listingData = req.body.Listing || req.body;
  
  const newlisting = new Listing(listingData);
  newlisting.owner = req.user._id;

  if (!req.file) {
    throw new ExpressError(400, "Image upload is required"); 
  }

  newlisting.image = {
    url: req.file.path,        // Cloudinary URL
    filename: req.file.filename,
  };

  await newlisting.save();

  res.status(201).json(newlisting);
};

module.exports.edit = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json(listing);
};

module.exports.update = async (req, res) => {
  let { id } = req.params;
  
  const listingData = req.body.Listing || req.body;
  
  let listing = await Listing.findByIdAndUpdate(id, { ...listingData }, { new: true });
  
  // Update image only if a new file was uploaded
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }

  res.json(listing);
};

module.exports.delete = async (req, res) => {
  let { id } = req.params;
  let deletedlisting = await Listing.findByIdAndDelete(id);
  res.json({ message: "Listing deleted", deletedlisting });
};

// ==========================================
// 🔥 NEWLY ADDED FUNCTIONS (To Fix 500 Errors)
// ==========================================

// 1. Frontend Categories ke liye Filter Logic
module.exports.filterCategory = async (req, res) => {
  const { category } = req.params;
  const { limit = 6 } = req.query; 

  let query = {};
  
  if (category && category !== "Trending" && category !== "All") {
    query.category = category;
  }

  // Find karne ke baad limit laga di
  const listings = await Listing.find(query).limit(parseInt(limit));

  res.json({
    success: true,
    listings: listings
  });
};

// 2. Search ke liye Logic (Aapke routes me '/search' defined tha)
module.exports.searchListings = async (req, res) => {
  const { q } = req.query; // Search keyword (e.g., /search?q=mumbai)
  
  let query = {};
  
  if (q && q.trim() !== "") {
    // Fuzzy search - create pattern that allows typos
    const searchTerm = q.trim();
    
    // Create fuzzy regex pattern (allows 1-2 character variations)
    const fuzzyPattern = createFuzzyPattern(searchTerm);
    const regex = new RegExp(fuzzyPattern, 'i'); 
    
    query.$or = [
      { location: regex },
      { country: regex },
      { title: regex },
      { description: regex }
    ];
  }

  const listings = await Listing.find(query).limit(20);
  
  res.json({
    success: true,
    listings: listings
  });
};

// Helper function to create fuzzy search pattern
function createFuzzyPattern(term) {
  // For short terms, use simple pattern
  if (term.length <= 3) {
    return term;
  }
  
  // Create pattern that matches similar words
  // E.g., "mumbai" -> "m.?u.?m.?b.?a.?i" (allows extra chars between)
  // Also handles common typos
  
  const chars = term.split('');
  let pattern = chars.map(char => {
    // Common character substitutions for typos
    const substitutions = {
      'a': '[ae]',
      'e': '[ei]',
      'i': '[iy]',
      'o': '[ou]',
      'u': '[uo]',
      'c': '[ck]',
      'k': '[ck]',
      's': '[sz]',
      'z': '[zs]',
    };
    
    const sub = substitutions[char.toLowerCase()];
    return sub || char;
  }).join('.?'); // Allow optional characters between
  
  return pattern;
}


