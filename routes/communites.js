const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const commController = require('../controllers/communityController');

router
  .route('/')
  .get(commController.getCommunities)
  .post(commController.createCommunity);

module.exports = router;
