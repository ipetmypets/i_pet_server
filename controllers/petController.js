const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petPictures, petAge, petBreed, petDescription } = req.body;

  const newPetProfile = new PetProfile({
    user: req.user.id, 
    petName,
    petType,
    petPictures,
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
