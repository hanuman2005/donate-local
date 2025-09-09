// controllers/userController.js
const User = require('../models/User');
const Rating = require('../models/Rating');
const Listing = require('../models/Listing');

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get user's recent listings
    const recentListings = await Listing.find({ donor: user._id })
      .limit(5)
      .sort({ createdAt: -1 })
      .select('title images category status createdAt');

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        recentListings
      }
    });

  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching user profile' 
    });
  }
};

// Rate user
const rateUser = async (req, res) => {
  try {
    const { rating, comment, listingId } = req.body;
    const raterId = req.user._id;
    const ratedId = req.params.id;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if rating already exists
    const existingRating = await Rating.findOne({ 
      rater: raterId, 
      listing: listingId 
    });

    if (existingRating) {
      return res.status(400).json({ message: 'You have already rated this transaction' });
    }

    // Determine rating type
    let ratingType;
    if (listing.donor.toString() === raterId.toString()) {
      ratingType = 'recipient';
    } else if (listing.assignedTo && listing.assignedTo.toString() === raterId.toString()) {
      ratingType = 'donor';
    } else {
      return res.status(403).json({ message: 'You are not part of this transaction' });
    }

    // Create rating
    const newRating = new Rating({
      rater: raterId,
      rated: ratedId,
      listing: listingId,
      rating,
      comment,
      ratingType
    });

    await newRating.save();

    // Update user's average rating
    const userRatings = await Rating.find({ rated: ratedId });
    const averageRating = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;

    await User.findByIdAndUpdate(ratedId, {
      'rating.average': averageRating,
      'rating.count': userRatings.length
    });

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating
    });

  } catch (error) {
    console.error('Rate user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error submitting rating' 
    });
  }
};

// Get user ratings
const getUserRatings = async (req, res) => {
  try {
    const userId = req.params.id;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const ratings = await Rating.find({ rated: userId })
      .populate('rater', 'name profileImage')
      .populate('listing', 'title category')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Rating.countDocuments({ rated: userId });

    res.json({
      success: true,
      ratings,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user ratings error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching ratings' 
    });
  }
};

// Update user profile image
const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profileImage: req.file.path },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Profile image updated successfully',
      user
    });

  } catch (error) {
    console.error('Update profile image error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error updating profile image' 
    });
  }
};

// Search users
const searchUsers = async (req, res) => {
  try {
    const { query, userType, page = 1, limit = 20 } = req.query;

    let searchQuery = { isActive: true };

    if (query) {
      searchQuery.$or = [
        { name: { $regex: query, $options: 'i' } }
      ];
    }

    if (userType && userType !== 'all') {
      searchQuery.$or = [
        { userType: userType },
        { userType: 'both' }
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.find(searchQuery)
      .select('name profileImage rating userType location')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(searchQuery);

    res.json({
      success: true,
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error searching users' 
    });
  }
};

module.exports = {
  getUserProfile,
  rateUser,
  getUserRatings,
  updateProfileImage,
  searchUsers
};
