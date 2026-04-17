const express = require("express");
const router = express.Router();
const Wrapasync = require("../utils/Wrapasync");
const { isloggedin, isOwner, validateListing } = require('../middleware/authmiddleware');

// Controllers
const listingController = require("../controllers/listing");
// 👇 (Add this if you created a separate discovery controller, otherwise use listingController)
const discoveryController = require("../Algorithms/SmartSearchAndrecomend"); 
// const { identifyUser } = require('../middleware/identity'); // Use this if you made the identity middleware

const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

// ==========================================
// 🚀 STATIC ROUTES (MUST BE AT THE TOP)
// ==========================================

// Create (POST) & Read All (GET)
router
  .route("/")
  .get(Wrapasync(listingController.index))
  .post(
    isloggedin,
    upload.single("image"),
    validateListing,
    Wrapasync(listingController.create)
  );

// New Form Route
router.get("/new", isloggedin, listingController.new);

// Search Route
router.get("/search", Wrapasync(listingController.searchListings));

// 🔥 NEW: Search Suggestions Route (Typing suggestions)
// Isko hamesha /:id ke upar rakhna hai!
router.get("/suggestions", Wrapasync(discoveryController.getSearchSuggestions));

// 🔥 NEW: Recommendations Route (For Homepage)
// Agar aapne identifyUser middleware banaya hai toh yahan lagayein, nahi toh isloggedin lagayein
router.get("/recommendations", Wrapasync(discoveryController.getRecommendations));

// Filtering Route
router.get("/filter/:category", Wrapasync(listingController.filterCategory));


// ==========================================
// 🚨 DYNAMIC ROUTES (MUST BE AT THE BOTTOM)
// ==========================================

// Edit Route (Needs to be before /:id just to be safe, though Express handles /:id/edit fine)
router.get("/:id/edit", isloggedin, isOwner, Wrapasync(listingController.edit));

// Show (GET), Update (PUT) & Delete (DELETE)
// Ye route sabse zyada "greedy" hota hai, isliye isko end mein rakhte hain
router
  .route("/:id")
  .get(Wrapasync(listingController.show))
  .put(
    isloggedin,
    isOwner,
    upload.single("image"),
    validateListing,
    Wrapasync(listingController.update)
  )
  .delete(isloggedin, isOwner, Wrapasync(listingController.delete));


// AI Generate Route (Make sure listingController.aiGenerate exists in your controller!)
// router.post("/ai-generate", isloggedin, Wrapasync(listingController.aiGenerate));

module.exports = router;