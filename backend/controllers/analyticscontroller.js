
// ============================================
// controllers/analyticsController.js - NEW FEATURE
// ============================================
const Listing = require('../models/Listing');
const User = require('../models/User');
const Rating = require('../models/Rating');
const Chat = require('../models/Chat');

// Get user analytics/statistics
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get listings stats
    const totalListings = await Listing.countDocuments({ donor: userId });
    const activeListings = await Listing.countDocuments({ 
      donor: userId, 
      status: 'available' 
    });
    const completedListings = await Listing.countDocuments({ 
      donor: userId, 
      status: 'completed' 
    });

    // Get received items
    const receivedItems = await Listing.countDocuments({ 
      assignedTo: userId,
      status: { $in: ['pending', 'completed'] }
    });

    // Get total views
    const viewsAgg = await Listing.aggregate([
      { $match: { donor: userId } },
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);
    const totalViews = viewsAgg.length > 0 ? viewsAgg[0].totalViews : 0;

    // Get total interested users
    const interestAgg = await Listing.aggregate([
      { $match: { donor: userId } },
      { $project: { interestCount: { $size: '$interestedUsers' } } },
      { $group: { _id: null, totalInterest: { $sum: '$interestCount' } } }
    ]);
    const totalInterest = interestAgg.length > 0 ? interestAgg[0].totalInterest : 0;

    // Get active chats
    const activeChats = await Chat.countDocuments({
      participants: userId,
      isActive: true
    });

    // Get ratings received
    const ratingsReceived = await Rating.countDocuments({ rated: userId });
    
    // Get category breakdown
    const categoryBreakdown = await Listing.aggregate([
      { $match: { donor: userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const recentListings = await Listing.countDocuments({
      donor: userId,
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      analytics: {
        listings: {
          total: totalListings,
          active: activeListings,
          completed: completedListings,
          recentWeek: recentListings
        },
        received: {
          total: receivedItems
        },
        engagement: {
          totalViews,
          totalInterest,
          activeChats
        },
        ratings: {
          received: ratingsReceived,
          average: req.user.rating?.average || 0
        },
        categoryBreakdown
      }
    });
  } catch (error) {
    console.error('Get user analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
};

// Get platform analytics (admin only)
const getPlatformAnalytics = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.userType !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const totalUsers = await User.countDocuments({ isActive: true });
    const totalListings = await Listing.countDocuments();
    const activeListings = await Listing.countDocuments({ status: 'available' });
    const completedListings = await Listing.countDocuments({ status: 'completed' });

    // Get users by type
    const usersByType = await User.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$userType', count: { $sum: 1 } } }
    ]);

    // Get listings by category
    const listingsByCategory = await Listing.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Get growth data (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyGrowth = await Listing.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalUsers,
          totalListings,
          activeListings,
          completedListings
        },
        usersByType,
        listingsByCategory,
        dailyGrowth
      }
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
};

module.exports = {
  getUserAnalytics,
  getPlatformAnalytics
};
