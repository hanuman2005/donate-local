// ============================================
// models/User.js - FIXED
// ============================================
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    // ✅ FIXED: Split name into firstName and lastName to match frontend
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    userType: {
      type: String,
      enum: ["donor", "recipient", "both", "admin"],
      default: "both",
    },
    phone: {
      type: String,
      required: false,
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: "USA" },
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        validate: {
          validator: function(v) {
            return v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && // longitude
                   v[1] >= -90 && v[1] <= 90;     // latitude
          },
          message: 'Invalid coordinates'
        }
      },
    },
    // ✅ FIXED: Renamed to 'avatar' to match frontend
    avatar: {
      type: String,
      default: "",
    },
    // ✅ ADDED: Bio field
    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },
    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },
    // ✅ ADDED: Count of listings for frontend
    listingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for geospatial queries
userSchema.index({ location: "2dsphere" });
userSchema.index({ email: 1 });
userSchema.set('toObject', {
  transform: function (doc, ret) {
    delete ret.password;
    return ret;
  }
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // ✅ Reduced from 12 to 10 for better performance
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

// ✅ ADDED: Virtual for full name
userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", userSchema);


