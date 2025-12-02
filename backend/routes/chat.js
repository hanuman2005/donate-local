// routes/chat.js
const express = require("express");
const { auth } = require("../middleware/auth");
const {
  createOrGetChat,
  getUserChats,
  getChatMessages,
  sendMessage,
  markMessagesAsRead,
} = require("../controllers/chatController");

const router = express.Router();

// Routes
router.post("/create-or-get", auth, createOrGetChat); 
router.get("/", auth, getUserChats);
router.get("/:chatId/messages", auth, getChatMessages); 
router.post("/:chatId/messages", auth, sendMessage);
router.put("/:chatId/read", auth, markMessagesAsRead);

module.exports = router;
