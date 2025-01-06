const express = require('express');
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile, // Import the update function from the controller
} = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');

// Route to get user profile
router.get('/profile', checkAuth, getUserProfile);

// Route to update user profile
router.put('/update', checkAuth, updateUserProfile);

module.exports = router;
