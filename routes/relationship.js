const express = require('express');
const router = express.Router();
const { sendFriendRequest, updateFriendRequestStatus, checkRelationshipStatus, removeFriendRequest } = require('../controllers/relationshipController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/send', checkAuth, sendFriendRequest);
router.put('/update', checkAuth, updateFriendRequestStatus);
router.get('/status/:receiver_id', checkAuth, checkRelationshipStatus);
router.delete('/remove', checkAuth, removeFriendRequest); // Add this line

module.exports = router;