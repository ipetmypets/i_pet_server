const express = require('express');
const chatController = require('../controllers/chatController');
const router = express.Router();

router.post('/createChat', chatController.createChat);
router.post('/sendMessage', chatController.sendMessage);
router.get('/getMessages/:chatId', chatController.getMessages);

module.exports = router;