// Quick script to make a user admin
const mongoose = require("mongoose");
require("dotenv").config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    const User = require("../models/User");

    // Find all users and show them
    const users = await User.find({})
      .select("email firstName lastName userType")
      .limit(10);
    console.log("Users in database:");
    users.forEach((u, i) =>
      console.log(
        `${i + 1}. ${u.email} - ${u.firstName} ${u.lastName} (${u.userType})`
      )
    );

    // Make the first user admin
    if (users.length > 0) {
      await User.updateOne(
        { _id: users[0]._id },
        { $set: { userType: "admin" } }
      );
      console.log(`\n✅ Made admin: ${users[0].email}`);
    } else {
      console.log("No users found in database");
    }

    process.exit(0);
  })
  .catch((err) => {
    console.error("Error:", err.message);
    process.exit(1);
  });
