const express = require('express');
const chatController = require('../controllers/chatController');
const { checkAuth } = require('../middleware/authMiddleware');
const socketMiddleware = require('../middleware/socketMiddleware');
const router = express.Router();

module.exports = (io) => {
  router.use(socketMiddleware(io)); // Attach io to req

  router.post('/sendMessage', checkAuth, chatController.sendMessage);
  router.get('/getMessages/:chatId', checkAuth, chatController.getMessages);

  return router;
};