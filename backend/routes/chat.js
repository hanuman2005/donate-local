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
router.post("/create-or-get", auth, createOrGetChat); // ✅ FIXED: Added /create-or-get path
router.get("/", auth, getUserChats);
router.get("/:chatId/messages", auth, getChatMessages); // ✅ FIXED: Added /messages to path
router.post("/:chatId/messages", auth, sendMessage);
router.put("/:chatId/read", auth, markMessagesAsRead);

module.exports = router;
