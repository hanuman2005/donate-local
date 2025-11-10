// backend/controllers/impactController.js
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const {
  aggregateUserImpact,
  aggregateCommunityImpact,
  getImpactMilestones
} = require('../utils/impactCalculations');

/**
 * Get personal impact statistics
 * GET /api/impact/personal
 */
const getPersonalImpact = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all completed transactions where user is donor
    const donorTransactions = await Transaction.find({
      donor: userId,
      status: 'completed'
    }).populate('listing', 'title category quantity');

    // Get all completed transactions where user is recipient
    const recipientTransactions = await Transaction.find({
      recipient: userId,
      status: 'completed'
    }).populate('listing', 'title category quantity');

    // Calculate donor impact
    const donorImpact = aggregateUserImpact(donorTransactions);
    
    // Calculate recipient impact (they're helping distribute)
    const recipientImpact = aggregateUserImpact(recipientTransactions);

    // Combined impact
    const combinedImpact = {
      totalWastePreventedKg: donorImpact.totalWastePreventedKg + recipientImpact.totalWastePreventedKg,
      totalCO2SavedKg: donorImpact.totalCO2SavedKg + recipientImpact.totalCO2SavedKg,
      totalMealsProvided: donorImpact.totalMealsProvided + recipientImpact.totalMealsProvided,
      totalWaterSavedLiters: donorImpact.totalWaterSavedLiters + recipientImpact.totalWaterSavedLiters,
      totalDonations: donorTransactions.length,
      totalReceived: recipientTransactions.length,
      totalTransactions: donorTransactions.length + recipientTransactions.length,
      treesEquivalent: donorImpact.treesEquivalent + recipientImpact.treesEquivalent,
      carsOffRoadDays: donorImpact.carsOffRoadDays + recipientImpact.carsOffRoadDays
    };

    // Get milestones
    const milestones = getImpactMilestones(combinedImpact.totalCO2SavedKg);

    // Calculate rank (position among all users)
    const allUsers = await Transaction.aggregate([
      { $match: { status: 'completed' } },
      {
        $group: {
          _id: '$donor',
          totalCO2: { $sum: '$impact.co2SavedKg' }
        }
      },
      { $sort: { totalCO2: -1 } }
    ]);

    const userRank = allUsers.findIndex(u => u._id.toString() === userId) + 1;

    // Recent activities (last 5)
    const recentActivities = await Transaction.find({
      $or: [{ donor: userId }, { recipient: userId }],
      status: 'completed'
    })
      .populate('listing', 'title category imageUrl')
      .populate('donor', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .sort({ completedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      impact: combinedImpact,
      milestones,
      rank: {
        position: userRank,
        total: allUsers.length
      },
      recentActivities: recentActivities.map(t => ({
        id: t._id,
        listing: t.listing,
        type: t.donor._id.toString() === userId ? 'donated' : 'received',
        completedAt: t.completedAt,
        impact: t.impact,
        partner: t.donor._id.toString() === userId ? t.recipient : t.donor
      }))
    });

  } catch (error) {
    console.error('Get Personal Impact Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch personal impact',
      error: error.message
    });
  }
};

/**
 * Get community-wide statistics
 * GET /api/impact/community
 */
const getCommunityImpact = async (req, res) => {
  try {
    // Get all completed transactions
    const allTransactions = await Transaction.find({
      status: 'completed'
    }).populate('donor', 'firstName lastName profilePicture');

    // Calculate community impact
    const communityData = aggregateCommunityImpact(allTransactions);

    // Get trending categories (most donated this week)
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const trendingCategories = await Transaction.aggregate([
      {
        $match: {
          status: 'completed',
          completedAt: { $gte: oneWeekAgo }
        }
      },
      {
        $lookup: {
          from: 'listings',
          localField: 'listing',
          foreignField: '_id',
          as: 'listingData'
        }
      },
      { $unwind: '$listingData' },
      {
        $group: {
          _id: '$listingData.category',
          count: { $sum: 1 },
          totalWaste: { $sum: '$impact.wastePreventedKg' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get top donors with user details
    const topDonorsWithDetails = await User.find({
      _id: { $in: communityData.topDonors.map(d => d.userId) }
    }).select('firstName lastName profilePicture');

    const enrichedTopDonors = communityData.topDonors.map(donor => {
      const userDetails = topDonorsWithDetails.find(
        u => u._id.toString() === donor.userId.toString()
      );
      return {
        ...donor,
        user: userDetails
      };
    });

    // Active users this week
    const activeThisWeek = await Transaction.distinct('donor', {
      status: 'completed',
      completedAt: { $gte: oneWeekAgo }
    });

    res.status(200).json({
      success: true,
      community: communityData.totalImpact,
      topDonors: enrichedTopDonors,
      trendingCategories,
      stats: {
        activeUsersThisWeek: activeThisWeek.length,
        transactionsThisWeek: allTransactions.filter(
          t => t.completedAt >= oneWeekAgo
        ).length
      }
    });

  } catch (error) {
    console.error('Get Community Impact Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch community impact',
      error: error.message
    });
  }
};

/**
 * Get impact heatmap data (for geographic visualization)
 * GET /api/impact/heatmap
 */
const getImpactHeatmap = async (req, res) => {
  try {
    const { bounds } = req.query; // Geographic bounds if needed

    // Get transactions with location data
    const transactions = await Transaction.find({
      status: 'completed',
      'pickupLocation.coordinates': { $exists: true }
    }).select('pickupLocation impact completedAt');

    // Format for heatmap
    const heatmapData = transactions.map(t => ({
      lat: t.pickupLocation.coordinates[1],
      lng: t.pickupLocation.coordinates[0],
      weight: t.impact?.wastePreventedKg || 1,
      timestamp: t.completedAt
    }));

    res.status(200).json({
      success: true,
      heatmap: heatmapData,
      count: heatmapData.length
    });

  } catch (error) {
    console.error('Get Heatmap Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch heatmap data',
      error: error.message
    });
  }
};

/**
 * Get impact timeline (historical data)
 * GET /api/impact/timeline
 */
const getImpactTimeline = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = '30' } = req.query; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get transactions grouped by day
    const timeline = await Transaction.aggregate([
      {
        $match: {
          donor: require('mongoose').Types.ObjectId(userId),
          status: 'completed',
          completedAt: { $gte: daysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
          },
          count: { $sum: 1 },
          totalWaste: { $sum: '$impact.wastePreventedKg' },
          totalCO2: { $sum: '$impact.co2SavedKg' },
          totalMeals: { $sum: '$impact.mealsProvided' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.status(200).json({
      success: true,
      timeline,
      period: parseInt(period)
    });

  } catch (error) {
    console.error('Get Timeline Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch timeline',
      error: error.message
    });
  }
};

/**
 * Generate shareable impact card
 * GET /api/impact/share-card
 */
const generateShareCard = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get user info
    const user = await User.findById(userId).select('firstName lastName profilePicture');

    // Get transactions
    const transactions = await Transaction.find({
      donor: userId,
      status: 'completed'
    });

    const impact = aggregateUserImpact(transactions);

    // Generate shareable data
    const shareData = {
      user: {
        name: `${user.firstName} ${user.lastName}`,
        profilePicture: user.profilePicture
      },
      impact: {
        wasteKg: impact.totalWastePreventedKg,
        co2Kg: impact.totalCO2SavedKg,
        meals: impact.totalMealsProvided,
        trees: impact.treesEquivalent
      },
      message: `I've saved ${impact.totalCO2SavedKg}kg of CO2 and provided ${impact.totalMealsProvided} meals through community food sharing! 🌍💚`,
      timestamp: new Date()
    };

    res.status(200).json({
      success: true,
      shareData
    });

  } catch (error) {
    console.error('Generate Share Card Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate share card',
      error: error.message
    });
  }
};

module.exports = {
  getPersonalImpact,
  getCommunityImpact,
  getImpactHeatmap,
  getImpactTimeline,
  generateShareCard
};