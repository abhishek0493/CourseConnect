const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.route('/').get(protect, userController.getAllUsers);
router.route('/categories').get(userController.getUserTypes);
router.route('/get-stats').get(protect, userController.getUserStats);

router
  .route('/community/view-all-requests')
  .get(protect, userController.getAllCommunityJoinRequests);

router
  .route('/community/request/:id/approve')
  .get(protect, userController.approveRequest);

router
  .route('/community/request/:id/reject')
  .get(protect, userController.approveRequest);

module.exports = router;
