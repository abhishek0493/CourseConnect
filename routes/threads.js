const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const threadsController = require('../controllers/threadsController');

router
  .route('/:community/get-threads')
  .get(protect, threadsController.getCommunityUserThreads);

router
  .route('/:id/up-vote-thread')
  .get(protect, threadsController.upVoteThread);

router
  .route('/:id/down-vote-thread')
  .get(protect, threadsController.downVoteThread);

router.route('/:id/save').get(protect, threadsController.saveThread);

router
  .route('/:id')
  .get(protect, threadsController.getThreadWithNestedComments);

router.route('/').post(protect, threadsController.createThread);

module.exports = router;
