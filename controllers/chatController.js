const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  const { chatId, content, chatName } = req.body; // Include chatName if needed
  const userId = req.user.userId;

  try {
    // Check if the user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    let chat;

    // Check if the chat exists
    if (chatId) {
      chat = await Chat.findByPk(chatId);
    }

    // If chat doesn't exist, create a new chat
    if (!chat) {
      chat = await Chat.create({ chatName });
    }

    // Create a new message
    const newMessage = await Message.create({
      chatId: chat.chatId,
      userId,
      content,
    });

    // Emit the new message to all participants in the chat
    req.io.to(`chat_${chat.chatId}`).emit('newMessage', newMessage);

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      message: newMessage,
      chatId: chat.chatId, // Return the chatId
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

// Get messages in a chat
exports.getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.findAll({
      where: { chatId },
      include: [
        { model: User, as: 'sender', attributes: ['userId', 'username', 'profile_pic'] },
      ],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages',
      error: error.message,
    });
  }
};