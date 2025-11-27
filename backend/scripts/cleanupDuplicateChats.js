// ============================================
// scripts/cleanupDuplicateChats.js
// Save this as: backend/scripts/cleanupDuplicateChats.js
// Run ONCE with: node scripts/cleanupDuplicateChats.js
// ============================================
const mongoose = require("mongoose");
require("dotenv").config();

// ✅ Import ALL models so Mongoose registers them
const User = require("../models/User");
const Chat = require("../models/Chat");
const Message = require("../models/Message");
const Listing = require("../models/Listing");

const cleanupDuplicateChats = async () => {
  try {
    console.log("\n🚀 Starting duplicate chat cleanup...\n");
    console.log("🔍 Connecting to database...");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB!\n");

    // Step 1: Get all chats
    console.log("📊 Fetching all chats...");
    const allChats = await Chat.find()
      .populate("participants", "firstName lastName")
      .lean();

    console.log(`   Found ${allChats.length} total chats\n`);

    // Step 2: Group by participant pairs
    console.log("🔍 Analyzing participant pairs...");
    const participantGroups = new Map();

    for (const chat of allChats) {
      // Create unique key from sorted participant IDs
      const key = chat.participants
        .map((p) => p._id.toString())
        .sort()
        .join("-");

      if (!participantGroups.has(key)) {
        participantGroups.set(key, []);
      }
      participantGroups.get(key).push(chat);
    }

    console.log(`   Found ${participantGroups.size} unique participant pairs\n`);

    // Step 3: Find and process duplicates
    let duplicateGroups = 0;
    let chatsRemoved = 0;

    for (const [key, chats] of participantGroups.entries()) {
      if (chats.length > 1) {
        duplicateGroups++;
        
        const names = chats[0].participants
          .map((p) => `${p.firstName} ${p.lastName}`)
          .join(" & ");

        console.log(`\n📌 Processing: ${names}`);
        console.log(`   Found ${chats.length} duplicate chats`);

        // Sort by most recent activity
        chats.sort((a, b) => {
          const aTime = a.lastMessage?.timestamp || a.updatedAt || a.createdAt;
          const bTime = b.lastMessage?.timestamp || b.updatedAt || b.createdAt;
          return new Date(bTime) - new Date(aTime);
        });

        // Keep the most recent one
        const keepChat = chats[0];
        const removeChats = chats.slice(1);

        console.log(`   ✅ Keeping: ${keepChat._id}`);

        // Move messages from duplicates to the kept chat
        for (const oldChat of removeChats) {
          const messageCount = await Message.countDocuments({
            chat: oldChat._id,
          });

          if (messageCount > 0) {
            console.log(`   📝 Moving ${messageCount} messages from ${oldChat._id}`);
            
            await Message.updateMany(
              { chat: oldChat._id },
              { $set: { chat: keepChat._id } }
            );
          }

          // Delete the duplicate chat
          await Chat.findByIdAndDelete(oldChat._id);
          console.log(`   ❌ Deleted: ${oldChat._id}`);
          chatsRemoved++;
        }

        // Update the kept chat's lastMessage
        const lastMessage = await Message.findOne({ chat: keepChat._id })
          .sort({ timestamp: -1 })
          .populate("sender");

        if (lastMessage) {
          await Chat.findByIdAndUpdate(keepChat._id, {
            lastMessage: {
              content: lastMessage.content,
              timestamp: lastMessage.timestamp,
              sender: lastMessage.sender._id,
            },
          });
        }
      }
    }

    // Step 4: Update database indexes
    console.log("\n\n🔧 Updating database indexes...");
    
    // Drop old compound index (participants + listing)
    try {
      await Chat.collection.dropIndex("participants_1_listing_1");
      console.log("   ✅ Dropped old index (participants + listing)");
    } catch (err) {
      if (err.message.includes("index not found")) {
        console.log("   ℹ️  Old compound index doesn't exist (OK)");
      } else {
        console.log(`   ⚠️  Could not drop old index: ${err.message}`);
      }
    }

    // Drop existing non-unique participants index
    try {
      await Chat.collection.dropIndex("participants_1");
      console.log("   ✅ Dropped non-unique participants index");
    } catch (err) {
      if (err.message.includes("index not found")) {
        console.log("   ℹ️  Non-unique index doesn't exist (OK)");
      }
    }

    // Create NEW unique index on participants
    try {
      await Chat.collection.createIndex(
        { participants: 1 },
        { unique: true, name: "participants_1_unique" }
      );
      console.log("   ✅ Created new UNIQUE index (participants only)");
    } catch (err) {
      if (err.message.includes("already exists") || err.message.includes("duplicate")) {
        console.log("   ℹ️  Unique index already exists (OK)");
      } else {
        console.log(`   ⚠️  Could not create unique index: ${err.message}`);
      }
    }

    // Step 5: Summary
    console.log("\n" + "=".repeat(50));
    console.log("✨ CLEANUP COMPLETE!");
    console.log("=".repeat(50));
    console.log(`\n📊 SUMMARY:`);
    console.log(`   • Total chats before:        ${allChats.length}`);
    console.log(`   • Unique participant pairs:  ${participantGroups.size}`);
    console.log(`   • Duplicate groups found:    ${duplicateGroups}`);
    console.log(`   • Duplicate chats removed:   ${chatsRemoved}`);
    console.log(`   • Chats remaining:           ${allChats.length - chatsRemoved}`);
    console.log("\n🎉 Your dashboard should now show only 1 chat per person!");
    console.log("🔄 Restart your server to see the changes.\n");

  } catch (error) {
    console.error("\n❌ ERROR during cleanup:");
    console.error(error.message);
  } finally {
    await mongoose.connection.close();
    console.log("👋 Database connection closed\n");
    process.exit(0);
  }
};

// Run the cleanup
cleanupDuplicateChats();