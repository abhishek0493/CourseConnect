const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboardController');

router
  .route('/get-recent-communities')
  .get(protect, dashboardController.getRecentCommunites);

router.route('/').get(protect, dashboardController.getTrendingThreads);

module.exports = router;
