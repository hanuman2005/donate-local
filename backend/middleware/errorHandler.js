
// ============================================
// middleware/errorHandler.js - FIXED
// ============================================
const multer = require('multer'); // ✅ ADDED: Import multer

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // ✅ Log only in development
  if (process.env.NODE_ENV === 'development') {
    console.log('Error:', err);
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    if (err.keyValue?.email) {
      message = 'Email already exists';
    } else if (err.keyValue?.participants) {
      message = 'Chat already exists for these participants';
    }
    
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      const message = 'File too large. Maximum size is 5MB';
      error = { message, statusCode: 400 };
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      const message = 'Too many files';
      error = { message, statusCode: 400 };
    }
  }

  // File type error
  if (err.message === 'Only image files are allowed') {
    error = { message: err.message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;