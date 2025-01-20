const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user.userId;

  try {
    // Check if the chat exists
    const chat = await Chat.findByPk(chatId);
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found',
      });
    }

    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newMessage = await Message.create({
      chatId,
      userId,
      content,
    });

    // Emit the new message to all participants in the chat
    req.io.to(`chat_${chatId}`).emit('newMessage', newMessage);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      message: newMessage,
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message',
      error: error.message,
    });
  }
};