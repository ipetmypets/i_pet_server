const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  sender_id: { type: String, required: true },  // UUID of sender
  receiver_id: { type: String, required: true },  // UUID of receiver
  content: { type: String, required: true },  // Message content (text)
  message_type: { type: String, enum: ['text', 'image', 'video'], required: true },  // Enum for message type
  sent_at: { type: Date, required: true },  // Timestamp
  is_read: { type: Boolean, default: false }  // Whether the message is read
}, { timestamps: true });  // Automatically adds createdAt and updatedAt fields

// Create a Message model
const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
