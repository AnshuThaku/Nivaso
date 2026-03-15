const express = require("express");
const router = express.Router({ mergeParams: true });
const Wrapasync = require("../utils/Wrapasync");
const { isloggedin, isreviewAuthor, validateReview } = require("../middleware");
const reviewcontroller = require("../controllers/reviews");

//review route
//post route

router.post(
  "/",
  isloggedin,
  validateReview,
  Wrapasync(reviewcontroller.createReview)
);

//delete review route
router.delete(
  "/:reviewid",
  isloggedin,
  isreviewAuthor,
  Wrapasync(reviewcontroller.deleteReview)
);

router.put(
  "/:reviewid",
  isloggedin,
  isreviewAuthor,
  validateReview,
  Wrapasync(reviewcontroller.updateReview)
);

module.exports = router;
