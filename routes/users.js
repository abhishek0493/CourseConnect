const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router
  .route('/')
  .get(usersController.getAllUsers)
  .post(usersController.createUser);

module.exports = router;
