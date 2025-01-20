const { Op } = require('sequelize');
const Relationship = require('../models/Relationship');

// 1. Send Friend Request
exports.sendFriendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user.userId;

  try {
    const existingRequest = await Relationship.findOne({
      where: {
        [Op.or]: [
          { senderId, receiverId },
          { senderId: receiverId, receiverId: senderId }
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

// Check Relationship Data
exports.checkRelationshipData = async (req, res) => {
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

    let statusMessage;
    if (relationship.status === 'pending') {
      if (relationship.senderId.toString() === senderId) {
        statusMessage = 'Your friend request is pending.';
      } else {
        statusMessage = 'You have a pending friend request. Please accept or reject it.';
      }
    } else if (relationship.status === 'accepted') {
      statusMessage = 'You are friends.';
    } else if (relationship.status === 'rejected') {
      statusMessage = 'The friend request was rejected.';
    }

    res.status(200).json({ relationship, statusMessage });
  } catch (err) {
    res.status(500).json({ message: 'Error checking relationship data', error: err.message });
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