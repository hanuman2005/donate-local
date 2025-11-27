// ============================================
// controllers/chatController.js - OPTION 1
// One chat per user pair (like WhatsApp/Messenger)
// ============================================
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Listing = require("../models/Listing");
const User = require("../models/User");

// Create or get existing chat
const createOrGetChat = async (req, res) => {
  try {
    const { listingId, participantId } = req.body;
    const currentUserId = req.user._id;

    // Verify participant exists
    const participant = await User.findById(participantId);
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Optional: Verify listing exists (for context)
    if (listingId) {
      const listing = await Listing.findById(listingId);
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: "Listing not found",
        });
      }
    }

    // ✅ FIXED: Find chat between these two users ONLY (ignore listing)
    let chat = await Chat.findOne({
      participants: { $all: [currentUserId, participantId] },
    })
      .populate("participants", "firstName lastName avatar")
      .populate("listing", "title images status");

    if (!chat) {
      // Create new chat (store initial listing for reference)
      chat = new Chat({
        participants: [currentUserId, participantId],
        listing: listingId, // Just for reference/context
        isActive: true,
      });

      await chat.save();
      await chat.populate("participants", "firstName lastName avatar");
      if (listingId) {
        await chat.populate("listing", "title images status");
      }
    }

    res.json({
      success: true,
      chat,
    });
  } catch (error) {
    console.error("Create/Get chat error:", error);
    res.status(500).json({
      success: false,
      message: "Server error handling chat",
    });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
      isActive: true,
    })
      .populate("participants", "firstName lastName avatar")
      .populate("listing", "title images status")
      .populate("lastMessage.sender", "firstName lastName")
      .sort({ "lastMessage.timestamp": -1 });

    res.json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Get user chats error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching chats",
    });
  }
};

const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
      .populate("participants", "firstName lastName avatar")
      .populate("listing", "title images status");

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      (participant) => participant._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this chat",
      });
    }

    // Get messages from separate collection
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.find({ chat: chatId })
      .populate("sender", "firstName lastName avatar")
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Message.countDocuments({ chat: chatId });

    res.json({
      success: true,
      chat: {
        _id: chat._id,
        participants: chat.participants,
        listing: chat.listing,
        lastMessage: chat.lastMessage,
      },
      messages: messages.reverse(),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get chat messages error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching messages",
    });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = "text" } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      (participant) => participant.toString() === senderId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({
        success: false,
        message: "Access denied to this chat",
      });
    }

    // Create new message in separate collection
    const newMessage = new Message({
      chat: chatId,
      sender: senderId,
      content,
      messageType,
      timestamp: new Date(),
      read: false,
    });

    await newMessage.save();
    await newMessage.populate("sender", "firstName lastName avatar");

    // Update last message in chat
    chat.lastMessage = {
      content,
      timestamp: new Date(),
      sender: senderId,
    };

    await chat.save();

    res.json({
      success: true,
      message: newMessage,
    });
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({
      success: false,
      message: "Server error sending message",
    });
  }
};

const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    // Mark unread messages from other participants as read
    await Message.updateMany(
      {
        chat: chatId,
        sender: { $ne: userId },
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    res.json({
      success: true,
      message: "Messages marked as read",
    });
  } catch (error) {
    console.error("Mark messages as read error:", error);
    res.status(500).json({
      success: false,
      message: "Server error marking messages as read",
    });
  }
};

module.exports = {
  createOrGetChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
};