require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const systemPrompt = `You are an AI assistant for DonateLocal, a circular economy platform.

Platform Overview:
DonateLocal helps people donate unwanted household items instead of throwing them away.

Key Features:
1. AI Analysis - Users upload photos of items, AI suggests: Reuse, Recycle, or Donate
2. Multiple Categories - Electronics, furniture, clothing, food, books, toys, household items, plants, tools, hobby gear
3. Location-Based Discovery - Map view showing nearby donations within 1-100km radius
4. Real-Time Chat - Donors and recipients coordinate via instant messaging
5. QR Code Verification - Safe exchanges verified by scanning QR codes at pickup
6. Pickup Scheduling - Calendar-based scheduling with automated reminders
7. Rating System - 5-star ratings build community trust
8. Privacy-First - No personal info shared until pickup is scheduled
9. Impact Analytics - Track CO2 saved, items rescued, money saved

How It Works:
1. Donor uploads item photo → AI analyzes → Suggests reuse/recycle/donate
2. If donate chosen → Create listing with details, photos, location
3. Recipient gets notification about nearby item
4. Recipient clicks "I Want This"
5. Real-time chat opens for questions
6. Donor proposes pickup time via calendar
7. Both get QR codes for verification
8. Safe exchange at public location
9. Both users rate each other

Answer questions helpfully, concisely, and conversationally. If you don't know specific platform details, suggest contacting support.`;

exports.askChatbot = async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Message is required",
        fallback: "Please ask me a question!",
      });
    }

    // ✅ FIXED: Use current model name
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",  // Updated model name!
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    // Build conversation context
    let fullPrompt = systemPrompt + "\n\nConversation:\n";

    conversationHistory.forEach((msg) => {
      const role = msg.sender === "user" ? "User" : "Assistant";
      fullPrompt += `${role}: ${msg.text}\n`;
    });

    fullPrompt += `User: ${message}\nAssistant:`;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const reply = response.text();

    res.json({
      reply: reply,
      success: true,
    });
  } catch (error) {
    console.error("Chatbot error:", error);

    // Return error but frontend will use fallback
    res.status(500).json({
      error: "AI service temporarily unavailable",
      message: error.message,
      fallback: "I'm having trouble connecting to my AI brain. But I can still help with basic questions!",
    });
  }
};