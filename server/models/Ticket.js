const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ['customer', 'admin', 'system'], required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // We'll keep using UUIDs from frontend or generate here. Let's rely on frontend UUID for consistency with existing logic, or better, use MongoDB _id? 
  // To minimize frontend refactoring, let's keep the 'id' field as the UUID string.
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Open', 'In Progress', 'Resolved'], default: 'Open' },
  createdAt: { type: Date, default: Date.now },
  images: [String], // Array of Base64 strings (Note: MongoDB has a 16MB doc limit. For production, S3 is better, but for this demo, base64 is fine if images aren't huge)
  messages: [ChatMessageSchema]
});

module.exports = mongoose.model('Ticket', TicketSchema);
