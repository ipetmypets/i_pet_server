const Relationship = require('../models/Relationship');

// 1. Send Friend Request
exports.sendFriendRequest = async (req, res) => {
  const { sender_id, receiver_id } = req.body;

  // Check if the relationship already exists
  const existingRequest = await Relationship.findOne({
    $or: [
      { sender_id, receiver_id },
      { sender_id: receiver_id, receiver_id: sender_id }
    ]
  });

  if (existingRequest) {
    return res.status(400).json({ message: 'Request already exists or relationship already exists' });
  }

  try {
    const newRequest = new Relationship({
      sender_id,
      receiver_id,
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
  const { sender_id, receiver_id, status } = req.body;

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

    if (status === 'accepted') {
      // You can add logic here to create a friendship in another collection if necessary.
    }

    res.status(200).json({ message: 'Friend request updated', relationship });
  } catch (err) {
    res.status(500).json({ message: 'Error updating friend request', error: err.message });
  }
};

// 3. Check Relationship Status
exports.checkRelationshipStatus = async (req, res) => {
  const { sender_id, receiver_id } = req.params;

  try {
    const relationship = await Relationship.findOne({
      $or: [
        { sender_id, receiver_id },
        { sender_id: receiver_id, receiver_id: sender_id }
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