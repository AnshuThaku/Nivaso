const express = require('express');
const router = express.Router();
const WrapAsync = require('../utils/WrapAsync');
const { identifyUser } = require('../middleware/identity');
const activityController = require('../controllers/activityController');

// ==========================================
// 🚀 HISTORY & TRACKING ROUTES
// Base URL from app.js is already "/history" 
// So we don't need to write "/history" again here!
// ==========================================

// 1. Track Search Query (Frontend calls: POST /history/search)
router.post('/search', identifyUser, WrapAsync(activityController.trackSearch));

// 2. Track Property View (Frontend calls: POST /history/view)
router.post('/view', identifyUser, WrapAsync(activityController.trackView));

// 3. Get Recent Searches (Frontend calls: GET /history/recent-searches)
router.get('/recent-searches', identifyUser, WrapAsync(activityController.getRecentSearches));

module.exports = router;