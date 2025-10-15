
// ============================================
// models/Message.js - NEW (Separate model)
// ============================================
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  chat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
    index: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxlength: [1000, "Message cannot exceed 1000 characters"],
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  messageType: {
    type: String,
    enum: ["text", "image", "system"],
    default: "text",
  },
  imageUrl: {
    type: String,
    required: function() {
      return this.messageType === 'image';
    }
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
messageSchema.index({ chat: 1, timestamp: -1 });
messageSchema.index({ sender: 1 });

module.exports = mongoose.model("Message", messageSchema);