const Listing = require("../models/listing");
const ExpressError = require("../utils/ExpressError");

module.exports.index = async (req, res) => {
  const { search, category } = req.query;
  
  let query = {};
  
  // 1. Agar user ne search box mein kuch likha hai
  if (search && search.trim() !== "") {
    const searchString = search.trim();
    const regex = new RegExp(searchString, 'i'); // 'i' ka matlab hai Bhopal aur bhopal dono match honge
    
    query.$or = [
      { location: regex },    // Bhopal match ho jayega "Bhopal, India" se
      { country: regex },
      { title: regex },
      { category: regex }
    ];
  }

  // 2. Agar user ne category select ki hai
  if (category && category !== "Trending" && category !== "") {
    query.category = category;
  }

  try {
    const allListings = await Listing.find(query);
    res.json(allListings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch listings" });
  }
};
module.exports.new = (req, res) => {
  res.json({ message: "Render form for creating a new listing" });
}



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

  // 🔥 FIX: Status code ab 2nd argument hai
  if (!req.file) {
    throw new ExpressError("Image upload is required", 400); 
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
  
  // 🔥 FIX: Same logic applied here for updating data safely
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

module.exports.filterCategory = async (req, res) => {
  const { category } = req.params;
  const filteredListings = await Listing.find({ category });
  res.json(filteredListings);
};

module.exports.searchListings = async (req, res) => {
  // Frontend se 'q' (search query) aur 'category' dono aa sakte hain
  const { q, category } = req.query;
  
  let searchCriteria = {};

  // 1. Agar user ne search box mein kuch likha hai (Location, Title, etc.)
  if (q && q.trim() !== "") {
    const regex = new RegExp(q.trim(), "i");
    searchCriteria.$or = [
      { title: regex },
      { location: regex },
      { country: regex },
      { description: regex }
    ];
  }

  // 2. Agar user ne specific category select ki hai (Category Filter)
  if (category && category !== "Trending" && category !== "") {
    searchCriteria.category = category;
  }

  try {
    const allListings = await Listing.find(searchCriteria);
    
    // Agar koi result na mile toh empty array bhej do (React handle kar lega)
    res.json(allListings);
  } catch (err) {
    res.status(500).json({ error: "Search failed. Please try again." });
  }
};

