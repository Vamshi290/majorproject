const mongoose = require('mongoose');

// Define the schema for a lost or found item
const LostFoundItemSchema = new mongoose.Schema({
  name: { type: String, required: true },            // Name of the item
  category: { type: String, required: true },        // Category of the item (e.g., electronics, clothing)
  description: { type: String, required: true },     // Description of the item
  location: { type: String, required: true }, 
  date: { type: Date, required: true },       // Location where the item was found or lost
  image: { type: String, required: true },           // Image of the item
  status: { type: String, default: 'pending' },      // Status of the item (pending, approved, rejected)
  itemType: { type: String, required: true, enum: ['lost', 'found'] }, // 'lost' or 'found'
});

const LostFoundItem = mongoose.model('LostFoundItem', LostFoundItemSchema);

module.exports = LostFoundItem;
