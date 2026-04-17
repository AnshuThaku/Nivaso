const ExpressError = require('../utils/ExpressError'); // Custom error class

exports.identifyUser = (req, res, next) => {
  // If authenticated via JWT/Session
  if (req.user && req.user._id) {
    req.identity = { userId: req.user._id };
    return next();
  }

  // If Guest (Check Headers)
  const guestId = req.headers['guest-id'];
  if (guestId) {
    req.identity = { guestId: guestId };
    return next();
  }

  // Force Identity Requirement
  next(new ExpressError(400, "Identification required. Missing Auth Token or guest-id header."));
};