const PetProfile = require('../models/PetProfile'); // Mongoose model for PetProfile

// Create Pet Profile
exports.createPetProfile = async (req, res) => {
  try {
    const { petName, petType,petPictures, petAge, petBreed, petDescription } = req.body;

    // Validate required fields
    if (!petName || !petType || !petAge) {
      return res.status(400).json({ message: 'Pet name, type, and age are required' });
    }

    // Create a new pet profile
    const newPetProfile = new PetProfile({
      ownerId: req.user.id, // Extracted from the JWT middleware
      petName,
      petType,
      petPictures,
      petAge,
      petBreed,
      petDescription,
    });

    // Save to the database
    await newPetProfile.save();

    res.status(201).json({
      message: 'Pet profile created successfully',
      petProfile: newPetProfile,
    });
  } catch (error) {
    console.error('Error creating pet profile:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
