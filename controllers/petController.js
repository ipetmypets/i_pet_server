const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petPictures, petAge, petBreed, petDescription } = req.body;

  let petPictureUrl = petPictures;
  if (!petPictureUrl || petPictureUrl === '') {
    petPictureUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgDFp3dmPTGj1xOEuSlAt-ilTfBOmYfth5hQ&s'; 
  }

  const newPetProfile = new PetProfile({
    user: req.user.id, 
    petName,
    petType,
    petPictures: petPictureUrl,  // Ensure the final petPictures is used
    petAge,
    petBreed,
    petDescription,
  });

  try {
    await newPetProfile.save();
    res.status(201).json({
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to create pet profile',
      error: error.message,
    });
  }
};
