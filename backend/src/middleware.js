const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError");
const User = require("./models/user");
const jwt = require("jsonwebtoken");

module.exports.isloggedin = async (req, res, next) => {
  const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "You must be logged in!" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret');
    const userId = decoded.id || decoded._id;
    
    const foundUser = await User.findById(userId).select("-password"); // Password mat nikalo
    if (!foundUser) return res.status(401).json({ message: "User not found" });
    
    req.user = foundUser;
    res.locals.currentUser = foundUser;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

module.exports.isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  
  if (!listing) return res.status(404).json({ message: "Listing not found" });

  if (!req.user || !listing.owner.equals(req.user._id)) {
    return res.status(403).json({ message: "You are not the owner of this listing" });
  }
  next();
};

module.exports.validateListing = (req, res, next) => {
    // Agar data direct body mein hai (Multipart/form-data fix)
    if (!req.body.Listing && req.body.title) {
        req.body.Listing = {
            title: req.body.title,
            description: req.body.description,
            location: req.body.location,
            country: req.body.country,
            price: Number(req.body.price), // Direct conversion
            category: req.body.category
        };
        // Clean up root level
        ['title', 'description', 'location', 'country', 'price', 'category'].forEach(k => delete req.body[k]);
    }

    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errmsg = error.details.map(el => el.message).join(", ");
        return res.status(400).json({ error: errmsg });
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    return res.status(400).json({ error: errmsg }); // Consistent JSON response
  }
  next();
};

module.exports.isreviewAuthor = async (req, res, next) => {
  let { id, reviewid } = req.params;
  
  try {
      const [review, listing] = await Promise.all([
          Review.findById(reviewid),
          Listing.findById(id)
      ]);

      if (!review || !listing) {
          return res.status(404).json({ message: "Review or Listing not found" });
      }

      const isAuthor = review.author?.equals(req.user._id);
      const isOwner = listing.owner?.equals(req.user._id);

      if (!isAuthor && !isOwner) {
        return res.status(403).json({ message: "Permission denied" });
      }

      next();
  } catch (err) {
      return res.status(500).json({ message: "Authorization check failed" });
  }
};