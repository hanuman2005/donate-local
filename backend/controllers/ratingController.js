// ============================================
// backend/controllers/ratingController.js - NEW FILE
// ============================================
const User = require('../models/User');
const Listing = require('../models/Listing');
const notificationHelper = require('../utils/notificationHelper');

// Rate a user after transaction
const rateUser = async (req, res) => {
  try {
    const { rating, review, listingId } = req.body;
    const userToRate = req.params.userId;
    const reviewer = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Can't rate yourself
    if (userToRate === reviewer.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot rate yourself',
      });
    }

    // Verify transaction happened
    if (listingId) {
      const listing = await Listing.findById(listingId);
      
      if (!listing) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found',
        });
      }

      // Check if user was involved in this listing
      const isDonor = listing.donor.toString() === reviewer.toString();
      const isRecipient = listing.assignedTo?.toString() === reviewer.toString();
      
      if (!isDonor && !isRecipient) {
        return res.status(403).json({
          success: false,
          message: 'You can only rate users you have transacted with',
        });
      }

      // Check if listing is completed
      if (listing.status !== 'completed') {
        return res.status(400).json({
          success: false,
          message: 'You can only rate after the transaction is completed',
        });
      }
    }

    // Add review to user
    const user = await User.findById(userToRate);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const newReview = await user.addReview(reviewer, rating, review, listingId);

    // Populate reviewer info
    await user.populate({
      path: 'reviews.reviewer',
      select: 'firstName lastName avatar',
    });

    // 🔔 Notify the rated user
    try {
      await notificationHelper.onUserRated(user, req.user, rating, req.io);
    } catch (notifError) {
      console.error('⚠️ Rating notification error:', notifError);
    }

    res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      review: newReview,
      user: {
        _id: user._id,
        rating: user.rating,
        ratingsCount: user.ratingsCount,
        badges: user.badges,
      },
    });

  } catch (error) {
    console.error('Rate user error:', error);
    
    if (error.message === 'You have already reviewed this user') {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error submitting rating',
      error: error.message,
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const userId = req.params.userId;

    const user = await User.findById(userId)
      .populate({
        path: 'reviews.reviewer',
        select: 'firstName lastName avatar rating',
      })
      .populate({
        path: 'reviews.listing',
        select: 'title category',
      });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedReviews = user.reviews
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(skip, skip + parseInt(limit));

    res.json({
      success: true,
      reviews: paginatedReviews,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        rating: user.rating,
        ratingsCount: user.ratingsCount,
        badges: user.badges,
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.reviews.length,
        pages: Math.ceil(user.reviews.length / limit),
      },
    });

  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching reviews',
    });
  }
};

// Report a review
const reportReview = async (req, res) => {
  try {
    const { reason } = req.body;
    const { userId, reviewId } = req.params;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Report reason is required',
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const review = user.reviews.id(reviewId);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Add report flag (you can expand this with a separate Report model)
    if (!review.reported) {
      review.reported = true;
      review.reportReason = reason;
      review.reportedBy = req.user._id;
      review.reportedAt = new Date();
      await user.save();
    }

    // Notify admins (implement admin notification system)
    console.log(`⚠️ Review ${reviewId} reported by ${req.user._id}: ${reason}`);

    res.json({
      success: true,
      message: 'Review reported successfully. Admins will review it.',
    });

  } catch (error) {
    console.error('Report review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error reporting review',
    });
  }
};

module.exports = {
  rateUser,
  getUserReviews,
  reportReview,
};