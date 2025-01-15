const express = require('express');
const router = express.Router();
const { sendMessage, getMessages } = require('../controllers/messageController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/send', checkAuth, sendMessage);
router.get('/messages/:userId', checkAuth, getMessages);

module.exports = router;