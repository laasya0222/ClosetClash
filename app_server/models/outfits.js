const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  authorEmail: { type: String, required: true }, // Store email for display
  createdAt: { type: Date, default: Date.now }
});

const outfitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wins: { type: Number, default: 0 },
  battlesPlayed: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  voters: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  createdAt: { type: Date, default: Date.now }
});

mongoose.model('Outfit', outfitSchema);