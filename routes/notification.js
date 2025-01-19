// filepath: /Users/urvi/CreateApp/i_pet_server/routes/notification.js
const express = require('express');
const router = express.Router();
const { createNotification, getNotifications, markAsRead, deleteNotification } = require('../controllers/notificationController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/create', checkAuth, createNotification);
router.get('/', checkAuth, getNotifications);
router.put('/read/:notificationId', checkAuth, markAsRead);
router.delete('/:notificationId', checkAuth, deleteNotification);

module.exports = router;