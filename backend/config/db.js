// config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10,
    });

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("🔴 Database connection error:", error.message);
    process.exit(1);
  }
};

// Log errors after initial connection
mongoose.connection.on("error", (err) => {
  console.error(`⚠️ MongoDB Error: ${err.message}`);
});

module.exports = connectDB;
