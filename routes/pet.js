const express = require('express');
const router = express.Router();
const { createPetProfile } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/create', checkAuth, createPetProfile);

module.exports = router;
