const express = require('express');
const router = express.Router();
const { sendFriendRequest, updateFriendRequestStatus, checkRelationshipStatus, getFriendList, removeFriendRequest } = require('../controllers/relationshipController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/send', checkAuth, sendFriendRequest);
router.put('/update', checkAuth, updateFriendRequestStatus);
router.get('/status/:receiverId', checkAuth, checkRelationshipStatus);
router.get('/list/:receiverId', checkAuth, getFriendList);
router.delete('/remove', checkAuth, removeFriendRequest);

module.exports = router;