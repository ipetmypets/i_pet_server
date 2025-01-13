const upload = multer({ dest: 'uploads/' });

const express = require('express');
const router = express.Router();
const { uploadPetPictureAndCreateProfile, getPetProfiles } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');

// Multer setup for handling multipart form data
router.post('/uploadPet', checkAuth, upload.single('petPicture'), uploadPetPictureAndCreateProfile);
router.get('/profiles', checkAuth, getPetProfiles);

module.exports = router;