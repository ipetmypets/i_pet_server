const express = require('express');
const {sendMessage , getMessages} = require('../controllers/chatController');
const { checkAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/sendMessage',checkAuth,sendMessage);
router.get('/getMessages/:chatId',checkAuth,getMessages);

module.exports = router;