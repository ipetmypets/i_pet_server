const express = require('express');
const router = express.Router();
const { createPetProfile, getPetProfiles } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);

module.exports = router;
