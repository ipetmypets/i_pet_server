const express = require('express');
const router = express.Router();
const { createPetProfile, getPetProfiles,uploadPetPicture } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPetPicture', checkAuth, uploadPetPicture);

module.exports = router;
