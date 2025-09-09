// controllers/chatController.js
const Chat = require('../models/Chat');
const Listing = require('../models/Listing');

// Create or get existing chat
const createOrGetChat = async (req, res) => {
  try {
    const { listingId, participantId } = req.body;
    const currentUserId = req.user._id;

    // Verify listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if chat already exists
    let chat = await Chat.findOne({
      listing: listingId,
      participants: { $all: [currentUserId, participantId] }
    }).populate('participants', 'name profileImage')
      .populate('listing', 'title images status');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [currentUserId, participantId],
        listing: listingId,
        messages: [],
        isActive: true
      });

      await chat.save();
      await chat.populate('participants', 'name profileImage');
      await chat.populate('listing', 'title images status');
    }

    res.json({
      success: true,
      chat
    });

  } catch (error) {
    console.error('Create/Get chat error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error handling chat' 
    });
  }
};

// Get user's chats
const getUserChats = async (req, res) => {
  try {
    const userId = req.user._id;

    const chats = await Chat.find({
      participants: userId,
      isActive: true
    }).populate('participants', 'name profileImage')
      .populate('listing', 'title images status')
      .populate('lastMessage.sender', 'name')
      .sort({ 'lastMessage.timestamp': -1 });

    res.json({
      success: true,
      chats
    });

  } catch (error) {
    console.error('Get user chats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching chats' 
    });
  }
};

// Get chat messages
const getChatMessages = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { page = 1, limit = 50 } = req.query;

    const chat = await Chat.findById(chatId)
      .populate('participants', 'name profileImage')
      .populate('listing', 'title images status')
      .populate('messages.sender', 'name profileImage');

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      participant => participant._id.toString() === req.user._id.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied to this chat' });
    }

    // Get paginated messages
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = chat.messages
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(skip, skip + parseInt(limit))
      .reverse();

    res.json({
      success: true,
      chat: {
        ...chat.toObject(),
        messages
      }
    });

  } catch (error) {
    console.error('Get chat messages error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching messages' 
    });
  }
};

// Send message
const sendMessage = async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text' } = req.body;
    const senderId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Check if user is participant
    const isParticipant = chat.participants.some(
      participant => participant.toString() === senderId.toString()
    );

    if (!isParticipant) {
      return res.status(403).json({ message: 'Access denied to this chat' });
    }

    // Create new message
    const newMessage = {
      sender: senderId,
      content,
      messageType,
      timestamp: new Date(),
      read: false
    };

    // Add message to chat
    chat.messages.push(newMessage);
    
    // Update last message
    chat.lastMessage = {
      content,
      timestamp: new Date(),
      sender: senderId
    };

    await chat.save();

    // Populate the new message
    await chat.populate('messages.sender', 'name profileImage');
    const populatedMessage = chat.messages[chat.messages.length - 1];

    res.json({
      success: true,
      message: populatedMessage
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error sending message' 
    });
  }
};

// Mark messages as read
const markMessagesAsRead = async (req, res) => {
  try {
    const { chatId } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findById(chatId);

    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Mark unread messages from other participants as read
    chat.messages.forEach(message => {
      if (message.sender.toString() !== userId.toString() && !message.read) {
        message.read = true;
      }
    });

    await chat.save();

    res.json({
      success: true,
      message: 'Messages marked as read'
    });

  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error marking messages as read' 
    });
  }
};

module.exports = {
  createOrGetChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead
};