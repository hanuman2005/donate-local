// controllers/listingController.js
const { validationResult } = require("express-validator");
const Listing = require("../models/Listing");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// Create listing
// Create listing
const createListing = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      category,
      quantity,
      coordinates,
      address,
      expiryDate,
      pickupInstructions,
    } = req.body;

    // Guard: coordinates must be valid
    if (!coordinates || coordinates.length !== 2) {
      return res.status(400).json({
        success: false,
        message: "Valid coordinates [longitude, latitude] are required",
      });
    }

    // Handle image uploads
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    const listing = new Listing({
      title,
      description,
      category,
      quantity,
      images,
      donor: req.user._id,
      location: {
        type: "Point",
        coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      },
      address,
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
      pickupInstructions,
    });

    await listing.save();
    await listing.populate("donor", "name profileImage rating");

    return res.status(201).json({
      success: true,
      message: "Listing created successfully",
      listing,
    });
  } catch (error) {
    console.error("Create listing error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error creating listing",
    });
  }
};

// Get all listings with optional filters
const getListings = async (req, res) => {
  try {
    const {
      category,
      latitude,
      longitude,
      radius = 10, // km
      status = "available",
      page = 1,
      limit = 20,
      search,
    } = req.query;

    let query = { status };

    // Category filter
    if (category && category !== "all") {
      query.category = category;
    }

    // Text search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Location-based search
    if (latitude && longitude) {
      query.location = {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)],
          },
          $maxDistance: radius * 1000, // Convert km to meters
        },
      };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const listings = await Listing.find(query)
      .populate("donor", "name profileImage rating")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Listing.countDocuments(query);

    res.json({
      success: true,
      listings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching listings",
    });
  }
};

// Get single listing by ID
const getListingById = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("donor", "name profileImage rating phone")
      .populate("assignedTo", "name profileImage rating")
      .populate("interestedUsers.user", "name profileImage");

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Increment view count
    listing.views += 1;
    await listing.save();

    res.json({
      success: true,
      listing,
    });
  } catch (error) {
    console.error("Get listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching listing",
    });
  }
};

// Update listing
const updateListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the owner
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this listing" });
    }

    const {
      title,
      description,
      category,
      quantity,
      status,
      pickupInstructions,
      expiryDate,
    } = req.body;

    // Handle new image uploads
    let newImages = [];
    if (req.files && req.files.length > 0) {
      newImages = req.files.map((file) => ({
        url: file.path,
        publicId: file.filename,
      }));
    }

    const updateData = {
      title: title || listing.title,
      description: description || listing.description,
      category: category || listing.category,
      quantity: quantity || listing.quantity,
      status: status || listing.status,
      pickupInstructions: pickupInstructions || listing.pickupInstructions,
      expiryDate: expiryDate ? new Date(expiryDate) : listing.expiryDate,
    };

    // Add new images to existing ones
    if (newImages.length > 0) {
      updateData.images = [...listing.images, ...newImages];
    }

    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate("donor", "name profileImage rating");

    res.json({
      success: true,
      message: "Listing updated successfully",
      listing: updatedListing,
    });
  } catch (error) {
    console.error("Update listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error updating listing",
    });
  }
};

// Delete listing
const deleteListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the owner or admin
    if (
      listing.donor.toString() !== req.user._id.toString() &&
      req.user.userType !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this listing" });
    }

    // Delete images from Cloudinary
    if (listing.images && listing.images.length > 0) {
      const deletePromises = listing.images.map((image) =>
        cloudinary.uploader.destroy(image.publicId)
      );
      await Promise.all(deletePromises);
    }

    await Listing.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Listing deleted successfully",
    });
  } catch (error) {
    console.error("Delete listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error deleting listing",
    });
  }
};

// Express interest in listing
const expressInterest = async (req, res) => {
  try {
    const { message } = req.body;
    const listingId = req.params.id;
    const userId = req.user._id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if listing is available
    if (listing.status !== "available") {
      return res.status(400).json({ message: "Listing is not available" });
    }

    // Check if user is not the donor
    if (listing.donor.toString() === userId.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot express interest in your own listing" });
    }

    // Check if user already expressed interest
    const alreadyInterested = listing.interestedUsers.some(
      (interest) => interest.user.toString() === userId.toString()
    );

    if (alreadyInterested) {
      return res
        .status(400)
        .json({ message: "Already expressed interest in this listing" });
    }

    // Add to interested users
    listing.interestedUsers.push({
      user: userId,
      message: message || "Interested in this item",
      timestamp: new Date(),
    });

    await listing.save();
    await listing.populate("interestedUsers.user", "name profileImage");

    res.json({
      success: true,
      message: "Interest expressed successfully",
      listing,
    });
  } catch (error) {
    console.error("Express interest error:", error);
    res.status(500).json({
      success: false,
      message: "Server error expressing interest",
    });
  }
};

// Assign listing to user
const assignListing = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the donor
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to assign this listing" });
    }

    // Update listing
    listing.assignedTo = recipientId;
    listing.status = "pending";
    await listing.save();

    await listing.populate("assignedTo", "name profileImage email phone");

    res.json({
      success: true,
      message: "Listing assigned successfully",
      listing,
    });
  } catch (error) {
    console.error("Assign listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error assigning listing",
    });
  }
};

// Mark listing as completed
const completeListing = async (req, res) => {
  try {
    const listingId = req.params.id;

    const listing = await Listing.findById(listingId);

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    // Check if user is the donor
    if (listing.donor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to complete this listing" });
    }

    listing.status = "completed";
    listing.completedAt = new Date();
    await listing.save();

    res.json({
      success: true,
      message: "Listing marked as completed",
      listing,
    });
  } catch (error) {
    console.error("Complete listing error:", error);
    res.status(500).json({
      success: false,
      message: "Server error completing listing",
    });
  }
};

// Get user's listings
const getUserListings = async (req, res) => {
  try {
    const { status, type = "donated" } = req.query;
    let query = {};

    if (type === "donated") {
      query.donor = req.user._id;
    } else if (type === "received") {
      query.assignedTo = req.user._id;
    }

    if (status) {
      query.status = status;
    }

    const listings = await Listing.find(query)
      .populate("donor", "name profileImage rating")
      .populate("assignedTo", "name profileImage rating")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      listings,
    });
  } catch (error) {
    console.error("Get user listings error:", error);
    res.status(500).json({
      success: false,
      message: "Server error fetching user listings",
    });
  }
};
const getNearbyListings = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ success: false, message: "Missing coordinates" });
    }

    const listings = await Listing.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: parseFloat(radius) * 1000, // meters
        },
      },
    }).populate("donor", "name profileImage rating");

    res.json({ success: true, listings });
  } catch (error) {
    console.error("Nearby listings error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Server error fetching nearby listings",
      });
  }
};

module.exports = {
  createListing,
  getListings,
  getListingById,
  updateListing,
  deleteListing,
  expressInterest,
  assignListing,
  completeListing,
  getUserListings,
  getNearbyListings,
};
