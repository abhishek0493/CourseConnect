const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router
  .route('/get-recent-communities')
  .get(protect, dashboardController.getRecentCommunites);

router
  .route('/get-saved-threads')
  .get(protect, dashboardController.getAllSavedThreads);

router
  .route('/search-threads')
  .get(protect, dashboardController.getSearchQueryThreads);

router.route('/').get(protect, dashboardController.getTrendingThreads);

module.exports = router;
