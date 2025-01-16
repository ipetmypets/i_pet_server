const express = require('express');
const router = express.Router();
const { uploadPetPicture, createPetProfile, getPetProfiles, deletePetProfile } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');

router.post('/upload', checkAuth, uploadPetPicture);
router.post('/create', checkAuth, createPetProfile);
router.get('/', checkAuth, getPetProfiles);
router.delete('/:profileId', checkAuth, deletePetProfile);

module.exports = router;