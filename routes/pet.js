const express = require('express');
const router = express.Router();
const { createPetProfile, getPetProfiles, uploadPetPicture,
     deletePetProfile ,favoritePet ,getFavoritedPets} = require('../controllers/petController');
const { checkAuth } = require('../middleware/authMiddleware');
const multer = require('multer');

// Set up Multer to handle file uploads
const upload = multer({ dest: 'uploads/' });

router.post('/create', checkAuth, createPetProfile);
router.get('/profiles', checkAuth, getPetProfiles);
router.post('/uploadPetPicture', checkAuth, upload.single('petPicture'), uploadPetPicture); // Add this line
router.delete('/profiles/:profileId', checkAuth, deletePetProfile); // Add this line
router.post('/favorite/:petId', checkAuth, favoritePet);
router.get('/favorites', checkAuth, getFavoritedPets);



module.exports = router;