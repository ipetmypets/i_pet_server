const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
  try {
    const { petName, petType, petPictures, petAge, petBreed, petDescription } = req.body;

    const newPetProfile = new PetProfile({
      user: req.user.id, // Extracted from the JWT middleware
      petName,
      petType,
      petPictures,
      petAge,
      petBreed,
      petDescription,
    });

    await newPetProfile.save();

    res.status(201).json({
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
    });
  } catch (error) {
    console.error('Error creating pet profile:', error);
    res.status(500).json({ 
      message: 'An error occurred while creating the pet profile', 
      error: error.message 
    });
  }
};

const isValidURL = (url) => {
  const regex = /^(ftp|http|https):\/\/[^ "]+$/;
  return regex.test(url);
};
