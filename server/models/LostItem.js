// models/LostItem.js
const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String }, 
  status: { type: String, default: 'pending' }// Or use Buffer if you're saving the image data
});

const LostItem = mongoose.model('LostItem', LostItemSchema);

module.exports = LostItem;
