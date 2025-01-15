const mongoose = require('mongoose');
const Relationship = require('../models/Relationship');

// 1. Send Friend Request
exports.sendFriendRequest = async (req, res) => {
  const { receiver_id } = req.body;
  const sender_id = req.user.id;

  // Convert receiver_id to ObjectId
  const receiverObjectId = new mongoose.Types.ObjectId(receiver_id);

  // Check if the relationship already exists
  const existingRequest = await Relationship.findOne({
    $or: [
      { sender_id, receiver_id: receiverObjectId },
      { sender_id: receiverObjectId, receiver_id: sender_id }
    ]
  });

  if (existingRequest) {
    return res.status(400).json({ message: 'Request already exists or relationship already exists' });
  }

  try {
    const newRequest = new Relationship({
      sender_id,
      receiver_id: receiverObjectId,
      status: 'pending',
    });
    await newRequest.save();
    res.status(201).json({ message: 'Friend request sent successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Error sending friend request', error: err.message });
  }
};

// 2. Accept or Reject Friend Request
exports.updateFriendRequestStatus = async (req, res) => {
  const { sender_id, status } = req.body;
  const receiver_id = req.user.id;

  if (!['accepted', 'rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be either "accepted" or "rejected"' });
  }

  try {
    const relationship = await Relationship.findOneAndUpdate(
      { sender_id, receiver_id, status: 'pending' },
      { status, updated_at: Date.now() },
      { new: true }
    );

    if (!relationship) {
      return res.status(404).json({ message: 'No pending friend request found' });
    }

    res.status(200).json({ message: 'Friend request updated', relationship });
  } catch (err) {
    res.status(500).json({ message: 'Error updating friend request', error: err.message });
  }
};

// 3. Check Relationship Status
exports.checkRelationshipStatus = async (req, res) => {
  const { receiver_id } = req.params;
  const sender_id = req.user.id;

  // Convert receiver_id to ObjectId
  const receiverObjectId = new mongoose.Types.ObjectId(receiver_id);

  try {
    const relationship = await Relationship.findOne({
      $or: [
        { sender_id, receiver_id: receiverObjectId },
        { sender_id: receiverObjectId, receiver_id: sender_id }
      ]
    });

    if (!relationship) {
      return res.status(404).json({ message: 'No relationship found' });
    }

    res.status(200).json({ message: 'Relationship status found', relationship });
  } catch (err) {
    res.status(500).json({ message: 'Error checking relationship status', error: err.message });
  }
};

// 4. Remove Friend Request
exports.removeFriendRequest = async (req, res) => {
  const { receiver_id } = req.body;
  const sender_id = req.user.id;

  // Convert receiver_id to ObjectId
  const receiverObjectId = new mongoose.Types.ObjectId(receiver_id);

  try {
    const relationship = await Relationship.findOneAndDelete({
      sender_id,
      receiver_id: receiverObjectId,
      status: 'pending'
    });

    if (!relationship) {
      return res.status(404).json({ message: 'No pending friend request found to remove' });
    }

    res.status(200).json({ message: 'Friend request removed successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing friend request', error: err.message });
  }
};