//server.js
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");
const socketHandler = require("./socket/socketHandler");

// Route imports
const authRoutes = require("./routes/auth");
const listingRoutes = require("./routes/listings");
const chatRoutes = require("./routes/chat");
const userRoutes = require("./routes/users");

const app = express();
const server = http.createServer(app);

// Connect to MongoDB
connectDB();

// Socket.IO setup
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-domain.com"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? "https://your-domain.com"
        : "http://localhost:3000",
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
