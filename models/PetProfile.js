const mongoose = require('mongoose');

const petProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  petName: { type: String, required: true },
  petType: { type: String, required: true },
  petAge: { type: Number, required: true },
  petPictures: { type: String, required: true },
  petBreed: { type: String, required: true },
  petDescription: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const PetProfile = mongoose.model('PetProfile', petProfileSchema);

module.exports = PetProfile;
