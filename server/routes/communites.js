const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const commController = require('../controllers/communityController');

router
  .route('/')
  .get(protect, commController.getCommunities)
  .post(commController.createCommunity);

module.exports = router;
