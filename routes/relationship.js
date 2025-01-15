const express = require('express');
const router = express.Router();
const { sendFriendRequest, updateFriendRequestStatus, checkRelationshipStatus } = require('../controllers/relationshipController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/send', checkAuth, sendFriendRequest);
router.put('/update', checkAuth, updateFriendRequestStatus);
router.get('/status/:receiver_id', checkAuth, checkRelationshipStatus);

module.exports = router;