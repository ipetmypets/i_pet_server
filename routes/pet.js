const express = require('express');
const router = express.Router();
const { createPetProfile, getPetProfiles, uploadPetPicture } = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

// Multer setup for handling multipart form data
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPetPicture', checkAuth, upload.single('petPicturePath'), uploadPetPicture);

module.exports = router;