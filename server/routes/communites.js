const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const miscController = require('../controllers/miscController');
const commController = require('../controllers/communityController');

router
  .route('/')
  .get(protect, commController.getCommunities)
  .post(protect, commController.createCommunity);

router.route('/u-list').get(protect, commController.getUserCommunities);
router
  .route('/check-availability')
  .post(protect, commController.checkCommunityNameAvailability);

router.route('/categories').get(miscController.getCategories);

module.exports = router;
