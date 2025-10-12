const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  items: [String], // An array of strings to list the clothing items
  lastWorn: {
    type: Date
  }
});

mongoose.model('Outfit', outfitSchema);