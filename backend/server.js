// backend/server.js - FIXED & OPTIMIZED

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");

// Load env variables
dotenv.config();

// Import routes
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/users");
const notificationRoutes = require("./routes/notifications");
const analyticsRoutes = require("./routes/analytics");
const qrRoutes = require("./routes/qr");
const impactRoutes = require("./routes/impact");
const ratingRoutes = require("./routes/ratings");
const aiMatchingRoutes = require("./routes/aiMatching");
const scheduleRoutes = require("./routes/schedules");
const reportRoutes = require("./routes/reports");
const wasteAnalysisRoutes = require('./routes/wasteAnalysis');
const chatbotRoutes = require('./routes/chatbot');
const routeOptimizationRoutes = require('./routes/routeOptimization');


// Import socket handler
const socketHandler = require("./socket/socketHandler");

// Import error handler
const errorHandler = require("./middleware/errorHandler");

const { initScheduleCronJobs } = require("./utils/scheduleCron");
// ⏱️ Auto-start queue expiration scheduler
require('./utils/queueCronJob');

const app = express();
const server = http.createServer(app);

// ✅ Configure CORS properly
const corsOptions = {
  origin: process.env.CLIENT_URL || "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 86400,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: "10mb" })); // Increased for image uploads
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ✅ Initialize Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Initialize socket handlers
socketHandler(io);
// After io is initialized
initScheduleCronJobs(io);

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Logging middleware (only in development)
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
  });
}

// Health check route
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Donate Local API is running",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      listings: "/api/listings",
      chat: "/api/chat",
      users: "/api/users",
      notifications: "/api/notifications",
      analytics: "/api/analytics",
      qr: "/api/qr",
      impact: "/api/impact",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/impact", impactRoutes);
app.use("/api/ratings", ratingRoutes);
app.use("/api", aiMatchingRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/waste-analysis', wasteAnalysisRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/routes', routeOptimizationRoutes);
app.use('/api/health', require('./routes/health'));
app.use('/api/ai', require('./routes/ai'));

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      "/api/auth",
      "/api/listings",
      "/api/chat",
      "/api/users",
      "/api/notifications",
      "/api/analytics",
      "/api/qr",
      "/api/impact",
    ],
  });
});

// ============================================
// MongoDB Connection with Retry Logic
// ============================================

const PORT = process.env.PORT || 5000;
const MAX_RETRIES = 5;
let retryCount = 0;

async function connectDB() {
  try {
    console.log("🔄 Connecting to MongoDB...");

    // ✅ FIXED: Remove deprecated options
    const conn = await mongoose.connect(
      process.env.MONGO_URI || process.env.MONGODB_URI,
      {
        serverSelectionTimeoutMS: 5000, // Timeout after 5s
        socketTimeoutMS: 45000, // Close sockets after 45s
        family: 4, // Use IPv4, skip trying IPv6
      }
    );

    console.log("✅ MongoDB connected successfully");
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🏠 Host: ${conn.connection.host}`);

    retryCount = 0; // Reset retry count on success

    // Start server after successful DB connection
    server.listen(PORT, () => {
      console.log("");
      console.log("╔═══════════════════════════════════════════╗");
      console.log("║     🚀 DONATE LOCAL SERVER RUNNING       ║");
      console.log("╚═══════════════════════════════════════════╝");
      console.log("");
      console.log(`✅ Server:        http://localhost:${PORT}`);
      console.log(`✅ Environment:   ${process.env.NODE_ENV || "development"}`);
      console.log(`✅ CORS:          ${corsOptions.origin}`);
      console.log(`✅ Socket.IO:     Enabled`);
      console.log("");
      console.log("📍 API Endpoints:");
      console.log(`   • Auth:         /api/auth`);
      console.log(`   • Listings:     /api/listings`);
      console.log(`   • Chat:         /api/chat`);
      console.log(`   • Users:        /api/users`);
      console.log(`   • Notifications:/api/notifications`);
      console.log(`   • Analytics:    /api/analytics`);
      console.log(`   • QR Codes:     /api/qr`);
      console.log(`   • Impact:       /api/impact`);
      console.log("");
      console.log("Press Ctrl+C to stop");
      console.log("");
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);

    retryCount++;

    if (retryCount <= MAX_RETRIES) {
      console.log(`🔄 Retrying connection... (${retryCount}/${MAX_RETRIES})`);
      console.log(`⏳ Waiting 5 seconds before retry...`);
      setTimeout(connectDB, 5000);
    } else {
      console.error("");
      console.error("╔════════════════════════════════════════════════╗");
      console.error("║  ❌ MONGODB CONNECTION FAILED AFTER 5 RETRIES  ║");
      console.error("╚════════════════════════════════════════════════╝");
      console.error("");
      console.error("💡 Troubleshooting Steps:");
      console.error("");
      console.error("1. Check your .env file:");
      console.error(
        "   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname"
      );
      console.error("");
      console.error("2. Verify MongoDB Atlas settings:");
      console.error("   • IP Address is whitelisted (0.0.0.0/0 for testing)");
      console.error("   • Username and password are correct");
      console.error('   • Database user has "Read and Write" permissions');
      console.error("");
      console.error("3. Test connection:");
      console.error("   node backend/test-connection.js");
      console.error("");
      console.error("4. Check MongoDB Atlas status:");
      console.error("   https://status.mongodb.com/");
      console.error("");

      process.exit(1);
    }
  }
}

// ============================================
// MongoDB Event Listeners
// ============================================

mongoose.connection.on("connected", () => {
  console.log("🔗 Mongoose connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Mongoose connection error:", err.message);
});

mongoose.connection.on("disconnected", () => {
  console.log("⚠️ Mongoose disconnected from MongoDB");
});

// ============================================
// Graceful Shutdown
// ============================================

process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT. Gracefully shutting down...");

  try {
    // Close server
    await new Promise((resolve) => server.close(resolve));
    console.log("✅ HTTP server closed");

    // Close database connection
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed");

    console.log("👋 Goodbye!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM. Gracefully shutting down...");

  try {
    await new Promise((resolve) => server.close(resolve));
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error("❌ Error during shutdown:", err);
    process.exit(1);
  }
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Promise Rejection:", err.message);
  console.error("Stack:", err.stack);

  // In production, you might want to exit
  if (process.env.NODE_ENV === "production") {
    server.close(() => process.exit(1));
  }
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
  console.error("Stack:", err.stack);

  // Always exit on uncaught exception
  process.exit(1);
});

// ============================================
// Start the server
// ============================================

connectDB();

module.exports = { app, io, server };
