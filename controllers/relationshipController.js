const { Op } = require('sequelize');
const Relationship = require('../models/Relationship');
const User = require('../models/User');

// 1. Send Friend Request
exports.sendFriendRequest = async (req, res) => {
  const { receiverId} = req.body;
  const senderId = req.user.userId;

  try {
    const existingRequest = await Relationship.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: senderId, receiverId: receiverId }
        ]
      }
    });

    if (existingRequest) {
      return res.status(400).json({ message: 'Request already exists or relationship already exists' });
    }

    const newRequest = await Relationship.create({
      senderId,
      receiverId,
      status: 'pending'
    });

    res.status(201).json({ message: 'Friend request sent successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Error sending friend request', error: err.message });
  }
};

// 2. Accept or Reject Friend Request
exports.updateFriendRequestStatus = async (req, res) => {
  const { senderId, status } = req.body;
  const receiverId = req.user.userId;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be either "accepted" or "rejected"' });
  }

  try {
    const relationship = await Relationship.findOne({
      where: {
        senderId,
        receiverId,
        status: 'pending'
      }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'No pending friend request found' });
    }

    relationship.status = status;
    relationship.updated_at = Date.now();
    await relationship.save();

    res.status(200).json({ message: 'Friend request updated', relationship });
  } catch (err) {
    res.status(500).json({ message: 'Error updating friend request', error: err.message });
  }
};

// Check Relationship Status
exports.checkRelationshipStatus = async (req, res) => {
  const { receiverId } = req.params;
  const senderId = req.user.userId;

  try {
    const relationship = await Relationship.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
        ]
      }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'No relationship found' });
    }

    res.status(200).json({ relationship });
  } catch (err) {
    res.status(500).json({ message: 'Error checking relationship status', error: err.message });
  }
};

exports.getFriendList = async (req, res) => {
  try {
    const userId = req.user.userId;

    const friends = await Relationship.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, status: 'accepted' },
          { receiverId: userId, status: 'accepted' },
        ],
      },
      include: [
        { model: User, as: 'sender', attributes: ['userId', 'username', 'profile_pic', 'lastActive'] },
        { model: User, as: 'receiver', attributes: ['userId', 'username', 'profile_pic', 'lastActive'] },
      ],
    });

    const activeUsers = new Map(); // This should be populated with the actual active users

    const friendList = friends.map(friend => {
      const isSender = friend.senderId === userId;
      const friendUser = isSender ? friend.receiver : friend.sender;
      const isActive = activeUsers.has(friendUser.userId);
      return {
        userId: friendUser.userId,
        name: friendUser.username,
        avatar: friendUser.profile_pic,
        status: isActive ? 'Online' : 'Offline',
        lastActive: friendUser.lastActive,
      };
    });

    res.status(200).json({
      success: true,
      friends: friendList,
    });
  } catch (error) {
    console.error('Error fetching friend list:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch friend list',
    });
  }
};

// 4. Remove Friend Request
exports.removeFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.userId;

  try {
    const relationship = await Relationship.destroy({
      where: {
        senderId,
        receiverId,
        status: 'pending'
      }
    });

    if (!relationship) {
      return res.status(404).json({ message: 'No pending friend request found to remove' });
    }

    res.status(200).json({ message: 'Friend request removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing friend request', error: err.message });
  }
};