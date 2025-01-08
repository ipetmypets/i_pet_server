const PetProfile = require('../models/PetProfile');

exports.createPetProfile = async (req, res) => {
  const { petName, petType, petPictures, petAge, petBreed, petDescription } = req.body;

  let petPictureUrl = petPictures;
  if (!petPictureUrl || petPictureUrl === '') {
    petPictureUrl = 'https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png'; 
  }

  const newPetProfile = new PetProfile({
    user: req.user.id, 
    petName,
    petType,
    petPictures: petPictureUrl,  // Ensure the final petPictures is used
    petAge,
    petBreed,
    petDescription,
    isActive: true,
  });

  try {
    await newPetProfile.save();
    res.status(201).json({
      success: true,
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create pet profile',
      error: error.message,
    });
  }
};
exports.getPetProfiles = async (req, res) => {
  try {
    // Fetch all pet profiles without filtering by user ID
    const petProfiles = await PetProfile.find();
    
    res.status(200).json({
      success: true,
      petProfiles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pet profiles',
      error: error.message,
    });
  }
};
