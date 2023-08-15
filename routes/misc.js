const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const miscController = require('../controllers/miscController');

router.route('/').get(miscController.getCategories);
router.route('/access-types').get(miscController.getAccessTypes);

module.exports = router;
