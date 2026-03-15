const express = require("express");
const router = express.Router();
const Wrapasync = require("../utils/Wrapasync");
const { isloggedin, isOwner, validateListing } = require("../middleware");
const listingController = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../config/cloudConfig");
const upload = multer({ storage });

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

// New Form Route (For API completeness)
router.get("/new", isloggedin, listingController.new);

// Search Route
router.get("/search", Wrapasync(listingController.searchListings));

// Show (GET), Update (PUT) & Delete (DELETE)
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

// Edit Route
router.get("/:id/edit", isloggedin, isOwner, Wrapasync(listingController.edit));

// Filtering Route
router.get("/filter/:category", Wrapasync(listingController.filterCategory));

// AI Generate Route (Make sure listingController.aiGenerate exists in your controller!)
// router.post("/ai-generate", isloggedin, Wrapasync(listingController.aiGenerate));

module.exports = router;