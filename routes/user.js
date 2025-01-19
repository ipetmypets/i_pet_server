const express = require('express');
const { getUserProfile, getOwnerProfile, uploadUserImage } = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = express.Router();

// Get logged-in user's profile
router.get('/profile', checkAuth, getUserProfile);

// Get another user's profile by ID
router.get('/owner/:userId', checkAuth, getOwnerProfile);

// Update user profile, including profile picture
router.put('/upload-image', checkAuth, uploadUserImage);

module.exports = router;