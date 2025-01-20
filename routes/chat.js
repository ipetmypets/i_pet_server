const express = require('express');
const { sendMessage, getMessages } = require('../controllers/chatController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/send', checkAuth, sendMessage);
router.get('/:userId', checkAuth, getMessages);

module.exports = router;