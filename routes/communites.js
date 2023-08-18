const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const miscController = require('../controllers/miscController');
const commController = require('../controllers/communityController');

router
  .route('/')
  .get(protect, commController.getUserCommunities)
  .post(protect, commController.createCommunity);

router
  .route('/check-availability')
  .post(protect, commController.checkCommunityNameAvailability);

router
  .route('/:name/check-access')
  .get(protect, commController.checkCommunityAccess);

router.route('/categories').get(miscController.getCategories);
router.route('/:name').get(protect, commController.getCommunityByName);
router.route('/:id/join').get(protect, commController.joinCommunity);
router.route('/:id/leave').get(protect, commController.leaveCommunity);

module.exports = router;
