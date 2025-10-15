// ============================================
// models/Listing.js - FIXED
// ============================================
const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "produce",
        "canned-goods",
        "dairy",
        "bakery",
        "household-items",
        "clothing",
        "other",
      ],
    },
    // ✅ FIXED: Changed from String to Number
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    // ✅ ADDED: Unit field
    unit: {
      type: String,
      enum: ['items', 'kg', 'lbs', 'bags', 'boxes', 'servings'],
      default: 'items',
    },
    // ✅ FIXED: Changed to array of strings to match frontend
    images: [String],
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
        validate: {
          validator: function(v) {
            return v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && 
                   v[1] >= -90 && v[1] <= 90;
          },
          message: 'Invalid coordinates [longitude, latitude]'
        }
      },
    },
    // ✅ ADDED: pickupLocation as string (what frontend sends)
    pickupLocation: {
      type: String,
      required: [true, "Pickup location is required"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
    },
    status: {
      type: String,
      enum: ["available", "pending", "completed", "cancelled"],
      default: "available",
    },
    expiryDate: {
      type: Date,
      required: false,
    },
    // ✅ RENAMED: From pickupInstructions to additionalNotes (matches frontend)
    additionalNotes: {
      type: String,
      maxlength: [500, "Additional notes cannot exceed 500 characters"],
    },
    interestedUsers: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        message: String,
        timestamp: { type: Date, default: Date.now },
      },
    ],
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    completedAt: Date,
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    urgency: {
      type: Number,
      enum: [1, 2, 3], // 1 = low, 2 = medium, 3 = high
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
listingSchema.index({ location: "2dsphere" });
listingSchema.index({ category: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ urgency: -1 });
listingSchema.index({ donor: 1 });

module.exports = mongoose.model("Listing", listingSchema);
