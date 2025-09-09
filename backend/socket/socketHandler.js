// socket/socketHandler.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Chat = require("../models/Chat");

const socketHandler = (io) => {
  // Authentication middleware for socket
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User ${socket.user.name} connected`);

    // Join user to their personal room
    socket.join(socket.userId);

    // Join chat rooms
    socket.on("joinChat", (chatId) => {
      socket.join(chatId);
      console.log(`User ${socket.user.name} joined chat ${chatId}`);
    });

    // Leave chat room
    socket.on("leaveChat", (chatId) => {
      socket.leave(chatId);
      console.log(`User ${socket.user.name} left chat ${chatId}`);
    });

    // Handle new message
    socket.on("sendMessage", async (data) => {
      try {
        const { chatId, content, messageType = "text" } = data;

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

        // Create new message
        const newMessage = {
          sender: socket.userId,
          content,
          messageType,
          timestamp: new Date(),
          read: false,
        };

        // Add message to chat
        chat.messages.push(newMessage);

        // Update last message
        chat.lastMessage = {
          content,
          timestamp: new Date(),
          sender: socket.userId,
        };

        await chat.save();

        // Populate the new message
        await chat.populate("messages.sender", "name profileImage");
        const populatedMessage = chat.messages[chat.messages.length - 1];

        // Send to all participants in the chat
        io.to(chatId).emit("newMessage", {
          chatId,
          message: populatedMessage,
        });

        // Send notification to other participants
        const otherParticipants = chat.participants.filter(
          (participant) => participant.toString() !== socket.userId
        );

        otherParticipants.forEach((participantId) => {
          io.to(participantId.toString()).emit("newNotification", {
            type: "message",
            chatId,
            message: `New message from ${socket.user.name}`,
            sender: {
              id: socket.userId,
              name: socket.user.name,
              profileImage: socket.user.profileImage,
            },
          });
        });
      } catch (error) {
        console.error("Socket sendMessage error:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    // Handle typing indicators
    socket.on("typing", (data) => {
      const { chatId, isTyping } = data;
      socket.to(chatId).emit("userTyping", {
        userId: socket.userId,
        userName: socket.user.name,
        isTyping,
      });
    });

    // Handle read receipts
    socket.on("markAsRead", async (data) => {
      try {
        const { chatId } = data;

        const chat = await Chat.findById(chatId);
        if (!chat) {
          return;
        }

        // Mark messages as read
        chat.messages.forEach((message) => {
          if (message.sender.toString() !== socket.userId && !message.read) {
            message.read = true;
          }
        });

        await chat.save();

        // Notify other participants
        socket.to(chatId).emit("messagesRead", {
          chatId,
          readBy: socket.userId,
        });
      } catch (error) {
        console.error("Socket markAsRead error:", error);
      }
    });

    // Handle user going online/offline
    socket.on("disconnect", () => {
      console.log(`User ${socket.user.name} disconnected`);

      // Notify contacts that user is offline
      socket.broadcast.emit("userOffline", {
        userId: socket.userId,
      });
    });

    // Notify contacts that user is online
    socket.broadcast.emit("userOnline", {
      userId: socket.userId,
      userName: socket.user.name,
    });
  });
};

module.exports = socketHandler;
