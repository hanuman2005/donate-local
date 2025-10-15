// ============================================
// socket/socketHandler.js - FIXED
// ============================================
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");

const socketHandler = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      console.log("🔑 Socket auth - verifying token");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token decoded:", decoded);

      // ✅ FIXED: Handle both userId and id from token
      const userId = decoded.userId || decoded.id;
      
      if (!userId) {
        console.error("❌ No userId in decoded token");
        return next(new Error("Invalid token format"));
      }

      const user = await User.findById(userId).select("-password");

      if (!user) {
        console.error("❌ User not found:", userId);
        return next(new Error("User not found"));
      }

      if (!user.isActive) {
        console.error("❌ User account is inactive:", userId);
        return next(new Error("User account is inactive"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      
      console.log("✅ Socket authenticated for:", user.email);
      next();
    } catch (error) {
      console.error("❌ Socket auth error:", error.message);
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(
      `✅ User ${socket.user.firstName} ${socket.user.lastName} connected (Socket ID: ${socket.id})`
    );

    // Join user to their personal room
    socket.join(socket.userId);

    // Emit user online status
    socket.broadcast.emit("userOnline", {
      userId: socket.userId,
      userName: `${socket.user.firstName} ${socket.user.lastName}`,
    });

    // Join chat rooms
    socket.on("joinChat", async (chatId) => {
      try {
        if (!chatId) {
          socket.emit("error", { message: "Chat ID required" });
          return;
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Verify user is participant
        const isParticipant = chat.participants.some(
          (p) => p.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        socket.join(chatId);
        console.log(`✅ User ${socket.user.firstName} joined chat ${chatId}`);
      } catch (error) {
        console.error("❌ joinChat error:", error);
        socket.emit("error", { message: "Failed to join chat" });
      }
    });

    // Leave chat room
    socket.on("leaveChat", (chatId) => {
      if (!chatId) return;
      socket.leave(chatId);
      console.log(`👋 User ${socket.user.firstName} left chat ${chatId}`);
    });

    // Handle new message with separate Message model
    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, content, messageType = "text" } = data;

        if (!chatId || !content) {
          socket.emit("error", { message: "Chat ID and content required" });
          return;
        }

        const chat = await Chat.findById(chatId);
        if (!chat) {
          socket.emit("error", { message: "Chat not found" });
          return;
        }

        // Check if user is participant
        const isParticipant = chat.participants.some(
          (participant) => participant.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Access denied" });
          return;
        }

        // Create new message in separate collection
        const newMessage = new Message({
          chat: chatId,
          sender: socket.userId,
          content: content.trim(),
          messageType,
          timestamp: new Date(),
          read: false,
        });

        await newMessage.save();
        await newMessage.populate("sender", "firstName lastName avatar");

        // Update last message in chat
        chat.lastMessage = {
          content: content.trim(),
          timestamp: new Date(),
          sender: socket.userId,
        };

        await chat.save();

        // Send to all participants in the chat
        io.to(chatId).emit("newMessage", {
          chatId,
          message: newMessage,
        });

        // Also emit as "receiveMessage" for compatibility
        io.to(chatId).emit("receiveMessage", newMessage);

        // Send notification to other participants
        const otherParticipants = chat.participants.filter(
          (participant) => participant.toString() !== socket.userId
        );

        otherParticipants.forEach((participantId) => {
          io.to(participantId.toString()).emit("newNotification", {
            type: "message",
            chatId,
            message: `New message from ${socket.user.firstName} ${socket.user.lastName}`,
            sender: {
              id: socket.userId,
              firstName: socket.user.firstName,
              lastName: socket.user.lastName,
              avatar: socket.user.avatar,
            },
          });
        });

        // Send success acknowledgment
        socket.emit("messageSent", {
          success: true,
          messageId: newMessage._id,
        });

        console.log(`✅ Message sent in chat ${chatId} by ${socket.user.firstName}`);
      } catch (error) {
        console.error("❌ Socket sendMessage error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      try {
        const { chatId, isTyping } = data;
        if (!chatId) return;

        socket.to(chatId).emit("userTyping", {
          userId: socket.userId,
          userName: `${socket.user.firstName} ${socket.user.lastName}`,
          isTyping: !!isTyping,
        });
      } catch (error) {
        console.error("❌ typing error:", error);
      }
    });

    // Handle read receipts with separate Message model
    socket.on("markAsRead", async (data) => {
      try {
        const { chatId } = data;
        if (!chatId) return;

        const chat = await Chat.findById(chatId);
        if (!chat) return;

        // Mark messages as read in separate collection
        await Message.updateMany(
          {
            chat: chatId,
            sender: { $ne: socket.userId },
            read: false,
          },
          {
            $set: { read: true },
          }
        );

        // Notify other participants
        socket.to(chatId).emit("messagesRead", {
          chatId,
          readBy: socket.userId,
        });

        console.log(`✅ Messages marked as read in chat ${chatId}`);
      } catch (error) {
        console.error("❌ Socket markAsRead error:", error);
      }
    });

    // Handle listing updates (notifications)
    socket.on("listingUpdate", (data) => {
      try {
        const { listingId, type, message } = data;

        // Broadcast to all connected users
        socket.broadcast.emit("newNotification", {
          type: "listing",
          listingId,
          updateType: type,
          message,
          sender: {
            id: socket.userId,
            firstName: socket.user.firstName,
            lastName: socket.user.lastName,
          },
        });

        console.log(`✅ Listing update broadcasted: ${type}`);
      } catch (error) {
        console.error("❌ listingUpdate error:", error);
      }
    });

    // Handle user going offline
    socket.on("disconnect", () => {
      try {
        console.log(
          `❌ User ${socket.user.firstName} ${socket.user.lastName} disconnected (Socket ID: ${socket.id})`
        );

        // Notify contacts that user is offline
        socket.broadcast.emit("userOffline", {
          userId: socket.userId,
        });
      } catch (error) {
        console.error("❌ disconnect error:", error);
      }
    });

    // Handle connection errors
    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });
  });

  // Handle io-level errors
  io.on("error", (error) => {
    console.error("❌ Socket.IO error:", error);
  });
};

module.exports = socketHandler;