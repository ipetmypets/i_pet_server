const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  Location: {
    longitude: { type: Number, required: true },
    latitude: { type: Number, required: true }
  }
});

module.exports = mongoose.model('User', userSchema);
