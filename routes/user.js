const express = require('express');
const router = express.Router();
const { getUserProfile } = require('../controllers/userController');
const { checkAuth } = require('../middleware/authMiddleware');
console.log(checkAuth);

// Protect this route with authentication middleware
router.get('/profile', checkAuth, getUserProfile);

module.exports = router;
