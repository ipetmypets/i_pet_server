const express = require('express');
const router = express.Router();
const { sendMessage, getMessages, deleteMessage } = require('../controllers/messageController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/send', checkAuth, sendMessage);
router.get('/conversation/:userId', checkAuth, getMessages);
router.delete('/:messageId', checkAuth, deleteMessage);

module.exports = router;