// ============================================
// models/User.js - FINAL IMPROVED VERSION
// ============================================
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email",
      ],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    userType: {
      type: String,
      enum: ["donor", "recipient", "both", "admin"],
      default: "both",
    },

    phone: String,
    phoneNumber: String, // for backward compatibility

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "India" },
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    avatar: String,
    bio: {
      type: String,
      maxlength: 500,
    },

    // ⭐ Clean Rating Object
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },

    reviews: [
      {
        reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        rating: { type: Number, required: true, min: 1, max: 5 },
        review: { type: String, maxlength: 500 },
        listing: { type: mongoose.Schema.Types.ObjectId, ref: "Listing" },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    badges: [String],
    listingsCount: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
userSchema.index({ location: "2dsphere" });
userSchema.index({ "rating.average": -1 });
userSchema.index({ "rating.count": -1 });

// Update rating (safe calculation)
userSchema.methods.updateRating = function () {
  if (this.rating.count === 0) {
    this.rating.average = 0;
  } else {
    const total = this.reviews.reduce((sum, r) => sum + r.rating, 0);
    this.rating.average = Math.round((total / this.rating.count) * 10) / 10;
  }
};

// Add review
userSchema.methods.addReview = async function (
  reviewerId,
  rating,
  reviewText,
  listingId
) {
  if (
    this.reviews.some((r) => r.reviewer.toString() === reviewerId.toString())
  ) {
    throw new Error("You already reviewed this user");
  }

  this.reviews.unshift({
    reviewer: reviewerId,
    rating,
    review: reviewText,
    listing: listingId,
  });

  this.rating.count += 1;
  this.updateRating();

  if (this.rating.count >= 1 && !this.badges.includes("verified")) {
    this.badges.push("verified");
  }
  if (this.rating.average >= 4.5 && this.rating.count >= 5) {
    this.badges.push("top-donor");
  }

  await this.save();
  return this.reviews[0];
};

// Password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Password compare
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

// Hide password
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);