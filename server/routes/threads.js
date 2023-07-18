const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const threadsController = require('../controllers/threadsController');

router
  .route('/:community/get-threads')
  .get(protect, threadsController.getCommunityUserThreads);

router
  .route('/:id')
  .get(protect, threadsController.getThreadDetails)
  .post(protect, threadsController.createThreadComment);

router.route('/').post(protect, threadsController.createThread);

module.exports = router;
