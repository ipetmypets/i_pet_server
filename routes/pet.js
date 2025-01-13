const express = require('express');
const router = express.Router();
const { createPetProfile, getPetProfiles, uploadPetPicture } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

const upload = multer({ dest: 'uploads/' });
// Multer setup for handling multipart form data

router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPetPicture', checkAuth, upload.single('petPictures'), uploadPetPicture);

module.exports = router;