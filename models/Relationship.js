const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  receiver_id: { type: String, required: true }, 
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const Relationship = mongoose.model('Relationship', relationshipSchema);

module.exports = Relationship;