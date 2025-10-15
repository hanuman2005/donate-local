// backend/server.js - FIXED CORS ISSUE

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIO = require('socket.io');

// Load env variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const listingRoutes = require('./routes/listings');
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
const notificationRoutes = require('./routes/notifications');
const analyticsRoutes = require('./routes/analytics');

// Import socket handler
const socketHandler = require('./socket/socketHandler');

// Import error handler
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// ✅ CRITICAL FIX: Configure CORS properly BEFORE any routes
const corsOptions = {
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400 // 24 hours
};

app.use(cors(corsOptions));

// ✅ Handle preflight requests
app.options('*', cors(corsOptions));

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ IMPORTANT: Initialize Socket.IO with CORS
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Initialize socket handlers
socketHandler(io);

// Make io accessible to routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Logging middleware (optional, for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'FoodShare API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Start server
    server.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  server.close(() => process.exit(1));
});

module.exports = { app, io };