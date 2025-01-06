const express = require('express');
const multer = require('multer');
const { storage } = require('../config/cloudinary'); // Import Cloudinary storage configuration
const { getUserProfile, updateUserProfile } = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ storage }); // Multer middleware for handling uploads

// Get user profile
router.get('/profile', checkAuth, getUserProfile);

// Update user profile, including profile picture
router.put('/profile', checkAuth, upload.single('profile_pic'), updateUserProfile);

module.exports = router;
