const Chat = require('../models/Chat');
const Message = require('../models/Message');
const User = require('../models/User');

// Create a new chat
exports.createChat = async (req, res) => {
  const { chatName, participantIds } = req.body;

  try {
    const newChat = await Chat.create({ chatName });

    if (participantIds && participantIds.length > 0) {
      const participants = await User.findAll({ where: { userId: participantIds } });
      await newChat.addParticipants(participants);
    }

    res.status(201).json({
      success: true,
      message: 'Chat created successfully',
      chat: newChat,
    });
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create chat',
      error: error.message,
    });
  }
};

// Send a message in a chat
exports.sendMessage = async (req, res) => {
  const { chatId, content } = req.body;
  const userId = req.user.userId;

  try {
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