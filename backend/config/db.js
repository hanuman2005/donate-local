// backend/config/db.js - UPDATE YOUR CONNECTION STRING

const mongoose = require('mongoose');

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      console.log('🔄 Connecting to MongoDB...');
      
      await mongoose.connect(process.env.MONGO_URI, {
        // ✅ ADD THESE OPTIONS TO FIX DNS ISSUES
        family: 4, // Force IPv4
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      console.log('✅ MongoDB Connected Successfully');
      break;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB connection error: ${error.message}`);
      
      if (retries < maxRetries) {
        console.log(`🔄 Retrying connection... (${retries}/${maxRetries})`);
        console.log('⏳ Waiting 5 seconds before retry...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      } else {
        console.error('❌ Max retries reached. Exiting...');
        process.exit(1);
      }
    }
  }

  mongoose.connection.on('disconnected', () => {
    console.log('⚠️ Mongoose disconnected from MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    console.error('❌ Mongoose connection error:', err.message);
  });
};

module.exports = connectDB;