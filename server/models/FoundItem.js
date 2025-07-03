// models/LostItem.js
const mongoose = require('mongoose');

const FoundItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: String }, // Or use Buffer if you're saving the image data
  status: { type: String, default: 'pending' }
});

const FoundItem = mongoose.model('FoundItem', FoundItemSchema);

module.exports = FoundItem;
