const express = require('express');
const multer = require('multer');
const { getUserProfile, getOwnerProfile, uploadUserImage } = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' }); // Multer middleware for handling uploads

// Get user profile
router.get('/profile', checkAuth, getUserProfile);
router.get('/owner', checkAuth, getOwnerProfile);

// Update user profile, including profile picture
router.put('/upload-image', checkAuth, upload.single('profileImage'), uploadUserImage);

module.exports = router;
