const express = require('express');
const router = express.Router();

// Importing the controller
const relationshipController = require('../controllers/relationshipController');

// 1. Route to send a friend request
router.post('/send-request', relationshipController.sendFriendRequest);

// 2. Route to accept or reject a friend request
router.post('/update-status', relationshipController.updateFriendRequestStatus);

// 3. Route to check the relationship status between two users
router.get('/status/:sender_id/:receiver_id', relationshipController.checkRelationshipStatus);

module.exports = router;