const express = require('express');
const router = express.Router();
const { createPetProfile, getPetProfiles, uploadPetPicture, deletePetProfile } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

// Set up Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPetPicture', checkAuth, upload.single('petPicture'), uploadPetPicture); // Add this line
router.delete('/profile/:profileId', checkAuth, deletePetProfile); // Add this line

module.exports = router;