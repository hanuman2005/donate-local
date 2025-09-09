// models/Chat.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  content: {
    type: String,
    required: true,
    trim: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
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
});

const chatSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    messages: [messageSchema],
    lastMessage: {
      content: String,
      timestamp: { type: Date, default: Date.now },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
chatSchema.index({ participants: 1 });
chatSchema.index({ listing: 1 });
chatSchema.index({ "lastMessage.timestamp": -1 });

module.exports = mongoose.model("Chat", chatSchema);
