const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.route('/').get(protect, userController.getAllUsers);
router.route('/categories').get(userController.getUserTypes);
router
  .route('/community/view-all-requests')
  .get(protect, userController.getAllCommunityJoinRequests);

module.exports = router;
