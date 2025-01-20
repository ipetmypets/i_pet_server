const express = require('express');
const { uploadPetPicture, createPetProfile, getPetProfiles, deletePetProfile } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/upload', checkAuth, uploadPetPicture);
router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);
router.delete('/profiles/:petId', checkAuth, deletePetProfile);

module.exports = router;