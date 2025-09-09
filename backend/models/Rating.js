// models/Rating.js
const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  rater: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rated: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  listing: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Listing',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: [200, 'Comment cannot exceed 200 characters']
  },
  ratingType: {
    type: String,
    enum: ['donor', 'recipient'],
    required: true
  }
}, {
  timestamps: true
});

// Ensure one rating per user per listing
ratingSchema.index({ rater: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model('Rating', ratingSchema);