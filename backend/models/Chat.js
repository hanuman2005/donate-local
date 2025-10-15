
// ============================================
// models/Chat.js - FIXED
// ============================================
const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    participants: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      validate: {
        validator: function(v) {
          return v.length === 2; // ✅ Must have exactly 2 participants
        },
        message: 'Chat must have exactly 2 participants'
      }
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    // ✅ REMOVED: messages array (will use separate Message model)
    lastMessage: {
      content: String,
      timestamp: { type: Date, default: Date.now },
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    unreadCount: {
      type: Map,
      of: Number,
      default: {}
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

// ✅ Ensure no duplicate chats for same participants + listing
chatSchema.index({ participants: 1, listing: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);
