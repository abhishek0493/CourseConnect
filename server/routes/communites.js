const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const miscController = require('../controllers/miscController');
const commController = require('../controllers/communityController');

router
  .route('/')
  .get(commController.getCommunities)
  .post(commController.createCommunity);

router.route('/categories').get(miscController.getCategories);

module.exports = router;
