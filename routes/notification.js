const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead } = require('../controllers/notificationController');
const { checkAuth } = require('../middleware/authMiddleware');

router.get('/', checkAuth, getNotifications);
router.put('/read/:notificationId', checkAuth, markAsRead);

module.exports = router;