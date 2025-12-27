// ============================================
// backend/models/User.js - FINAL IMPROVED VERSION
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
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
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
    phoneNumber: String, // backward compatibility

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
    ecoScore: {
      type: Number,
      default: 0,
    },

    wasteAnalysisCount: {
      type: Number,
      default: 0,
    },

    badges: [String],
    listingsCount: { type: Number, default: 0 },

    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    // 🔒 Trust & Verification Fields
    trustScore: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },

    verificationStatus: {
      phone: { type: Boolean, default: false },
      email: { type: Boolean, default: false },
      identity: { type: Boolean, default: false },
      address: { type: Boolean, default: false },
    },

    trustBadges: [
      {
        badge: {
          type: String,
          enum: [
            "verified_contributor",
            "trusted_recipient",
            "community_champion",
            "early_adopter",
            "power_donor",
            "reliability_star",
          ],
        },
        earnedAt: { type: Date, default: Date.now },
        description: String,
      },
    ],

    completedDonations: { type: Number, default: 0 },
    completedPickups: { type: Number, default: 0 },
    reportedCount: { type: Number, default: 0 },

    isSuspended: { type: Boolean, default: false },
    suspendedUntil: Date,
    suspensionReason: String,

    accountWarnings: [
      {
        type: String,
        reason: String,
        issuedAt: { type: Date, default: Date.now },
      },
    ],

    // Password Reset
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Email Verification
    emailVerifyToken: String,
    emailVerifyExpires: Date,

    // Email Preferences
    emailPreferences: {
      marketing: { type: Boolean, default: true },
      donations: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      reminders: { type: Boolean, default: true },
      weeklyDigest: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// =======================
// Indexes
// =======================
userSchema.index({ location: "2dsphere" });
userSchema.index({ "rating.average": -1 });
userSchema.index({ "rating.count": -1 });
userSchema.index({ trustScore: -1 });
userSchema.index({ "verificationStatus.email": 1 });
userSchema.index({ isSuspended: 1 });

// =======================
// Methods
// =======================

// Update rating
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

// Virtual full name
userSchema.virtual("name").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// =======================
// Trust & Badge Methods
// =======================

userSchema.methods.awardBadge = async function (badgeName, description) {
  const badgeExists = this.trustBadges.some((b) => b.badge === badgeName);

  if (!badgeExists) {
    this.trustBadges.push({
      badge: badgeName,
      description,
      earnedAt: new Date(),
    });

    this.trustScore = Math.min(this.trustScore + 5, 100);
    await this.save();
  }

  return this;
};

userSchema.methods.checkAndAwardBadges = async function () {
  if (this.completedDonations >= 5 && !this.hasBadge("verified_contributor")) {
    await this.awardBadge("verified_contributor", "Completed 5+ donations");
  }

  if (this.completedPickups >= 5 && !this.hasBadge("trusted_recipient")) {
    await this.awardBadge("trusted_recipient", "Completed 5+ pickups");
  }

  if (this.completedDonations >= 20 && !this.hasBadge("power_donor")) {
    await this.awardBadge("power_donor", "Donated 20+ items");
  }

  if (
    this.trustScore >= 80 &&
    this.completedDonations + this.completedPickups >= 15 &&
    !this.hasBadge("community_champion")
  ) {
    await this.awardBadge("community_champion", "Outstanding community member");
  }

  return this;
};

userSchema.methods.hasBadge = function (badgeName) {
  return this.trustBadges.some((b) => b.badge === badgeName);
};

userSchema.methods.incrementCompletedDonations = async function () {
  this.completedDonations += 1;
  this.trustScore = Math.min(this.trustScore + 2, 100);
  await this.checkAndAwardBadges();
  await this.save();
  return this;
};

userSchema.methods.incrementCompletedPickups = async function () {
  this.completedPickups += 1;
  this.trustScore = Math.min(this.trustScore + 2, 100);
  await this.checkAndAwardBadges();
  await this.save();
  return this;
};

userSchema.methods.addWarning = async function (type, reason) {
  this.accountWarnings.push({ type, reason });
  this.trustScore = Math.max(this.trustScore - 10, 0);

  if (this.accountWarnings.length >= 3) {
    await this.suspend("Multiple violations", 30);
  }

  await this.save();
  return this;
};

userSchema.methods.suspend = async function (reason, days = 30) {
  this.isSuspended = true;
  this.suspensionReason = reason;
  this.suspendedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  await this.save();
  return this;
};

userSchema.methods.unsuspend = async function () {
  this.isSuspended = false;
  this.suspensionReason = null;
  this.suspendedUntil = null;
  await this.save();
  return this;
};

module.exports = mongoose.model("User", userSchema);
