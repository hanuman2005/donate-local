// ============================================
// models/Listing.js - WITH QR VERIFICATION
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
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    unit: {
      type: String,
      enum: ['items', 'kg', 'lbs', 'bags', 'boxes', 'servings'],
      default: 'items',
    },
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
        type: [Number],
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
      enum: [1, 2, 3],
      default: 1,
    },
    
    // ✅ NEW: QR Verification Fields
    qrCode: {
      data: String,           // Encrypted QR data
      secret: String,         // Secret key for verification
      generatedAt: Date,      // When QR was created
      expiresAt: Date,        // QR expiry time (24 hours)
      isUsed: {
        type: Boolean,
        default: false
      },
      usedAt: Date,          // When QR was scanned
      scannedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    },
    
    // ✅ NEW: Verification Status
    verificationStatus: {
      type: String,
      enum: ["not_generated", "pending", "verified", "expired"],
      default: "not_generated"
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
listingSchema.index({ location: "2dsphere" });
listingSchema.index({ category: 1 });
listingSchema.index({ status: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ urgency: -1 });
listingSchema.index({ donor: 1 });
listingSchema.index({ assignedTo: 1 });
listingSchema.index({ "qrCode.secret": 1 }); // ✅ NEW: For QR lookup

module.exports = mongoose.model("Listing", listingSchema);