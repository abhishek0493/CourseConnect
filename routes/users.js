const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const usersController = require('../controllers/userController');

router
  .route('/')
  .get(auth, usersController.getAllUsers)
  .post(usersController.createUser);

module.exports = router;
