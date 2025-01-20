const Chat = require('../models/Chat');
const Relationship = require('../models/Relationship');
const User = require('../models/User');

// Send a message
exports.sendMessage = async (req, res) => {
  const { receiverId, message } = req.body;

  try {
    // Check if the relationship is accepted
    const relationship = await Relationship.findOne({
      where: {
        senderId: req.user.userId,
        receiverId,
        status: 'accepted',
      },
    });

    if (!relationship) {
      return res.status(403).json({
        success: false,
        message: 'You can only chat with users you have an accepted relationship with.',
      });
    }

    const chat = await Chat.create({
      senderId: req.user.userId,
      receiverId,
      message,
    });

    res.status(201).json({
      success: true,
      message: 'Message sent successfully',
      chat,
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

// Fetch messages between two users
exports.getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    // Check if the relationship is accepted
    const relationship = await Relationship.findOne({
      where: {
        senderId: req.user.userId,
        receiverId: userId,
        status: 'accepted',
      },
    });

    if (!relationship) {
      return res.status(403).json({
        success: false,
        message: 'You can only chat with users you have an accepted relationship with.',
      });
    }

    const messages = await Chat.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.userId, receiverId: userId },
          { senderId: userId, receiverId: req.user.userId },
        ],
      },
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