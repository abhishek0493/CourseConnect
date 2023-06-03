const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const userController = require('../controllers/userController');

router.route('/').get(auth, userController.getAllUsers);
router.route('/categories').get(userController.getUserTypes);

module.exports = router;
