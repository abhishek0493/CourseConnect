const express = require('express');
const router = express.Router();
const usersController = require('../controllers/userController');

router.get('/', async (req, res) => {
  try {
    const users = await usersController.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

module.exports = router;