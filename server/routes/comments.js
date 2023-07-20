const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const commentsController = require('../controllers/commentsController');

router
  .route('/:thread_id')
  .post(protect, commentsController.createTheadComment);

router
  .route('/:thread_id/:comment_id')
  .post(protect, commentsController.createCommentReply);

module.exports = router;
