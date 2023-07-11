const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const threadsController = require('../controllers/threadsController');

router.route('/').post(protect, threadsController.createThread);

module.exports = router;
