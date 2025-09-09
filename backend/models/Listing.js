// models/Listing.js
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
    quantity: {
      type: String,
      required: [true, "Quantity is required"],
    },
    images: [
      {
        url: String,
        publicId: String,
      },
    ],
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
      },
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
    pickupInstructions: {
      type: String,
      maxlength: [200, "Pickup instructions cannot exceed 200 characters"],
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

module.exports = mongoose.model("Listing", listingSchema);