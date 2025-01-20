const express = require('express');
const router = express.Router();
const { sendFriendRequest, updateFriendRequestStatus, checkRelationshipStatus, checkRelationshipData, removeFriendRequest } = require('../controllers/relationshipController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/send', checkAuth, sendFriendRequest);
router.put('/update', checkAuth, updateFriendRequestStatus);
router.get('/status/:receiverId', checkAuth, checkRelationshipStatus);
router.get('/data/:receiverId', checkAuth, checkRelationshipData);
router.delete('/remove', checkAuth, removeFriendRequest);

module.exports = router;