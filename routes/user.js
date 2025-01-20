const express = require('express');
const { getUserProfile, getOwnerProfile, uploadUserImage } = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/profile', checkAuth, getUserProfile);

router.get('/owner/:userId', checkAuth, getOwnerProfile);

router.put('/upload-image', checkAuth, uploadUserImage);

module.exports = router;