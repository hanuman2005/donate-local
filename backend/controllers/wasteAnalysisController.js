// backend/controllers/wasteAnalysisController.js
const WasteAnalysis = require('../models/WasteAnalysis');
const User = require('../models/User');
const Listing = require('../models/Listing');

// @desc    Save waste analysis (from TensorFlow.js frontend)
// @route   POST /api/waste-analysis
// @access  Private
exports.saveAnalysis = async (req, res) => {
  try {
    const {
      tfLabel,
      confidence,
      material,
      reuseIdeas,
      upcycleIdeas,
      recyclingGuidance,
      donationPossible,
      donationCategory,
      impact,
      userDescription,
      location,
      deviceType,
      imageUrl, // Optional - if you upload to Cloudinary
    } = req.body;

    // Validate required fields
    if (!tfLabel || !confidence || !material) {
      return res.status(400).json({ 
        message: 'Missing required fields: tfLabel, confidence, material' 
      });
    }

    // Create analysis record
    const analysis = await WasteAnalysis.create({
      user: req.user._id,
      tfLabel,
      confidence,
      material,
      reuseIdeas: reuseIdeas || [],
      upcycleIdeas: upcycleIdeas || [],
      recyclingGuidance,
      donationPossible,
      donationCategory,
      impact: {
        carbonSaved: impact?.carbonSaved || 0,
        wasteDiverted: impact?.wasteDiverted || 0,
        ecoScore: impact?.ecoScore || 0,
      },
      userDescription,
      location: location ? {
        type: 'Point',
        coordinates: [location.longitude, location.latitude]
      } : undefined,
      deviceType,
      imageUrl,
    });

    // Update user's eco score
    await User.findByIdAndUpdate(
      req.user._id,
      { 
        $inc: { 
          ecoScore: impact?.ecoScore || 0,
          wasteAnalysisCount: 1 
        } 
      }
    );

    // Populate user data
    await analysis.populate('user', 'firstName lastName avatar');

    res.status(201).json({
      success: true,
      message: 'Analysis saved successfully',
      analysis,
    });
  } catch (error) {
    console.error('Save analysis error:', error);
    res.status(500).json({ 
      message: 'Failed to save analysis', 
      error: error.message 
    });
  }
};

// @desc    Get user's analysis history
// @route   GET /api/waste-analysis/my-history
// @access  Private
exports.getMyHistory = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      material,
      saved,
      convertedToListing 
    } = req.query;

    const query = { user: req.user._id };
    
    if (material) query.material = material;
    if (saved !== undefined) query.saved = saved === 'true';
    if (convertedToListing !== undefined) {
      query.convertedToListing = convertedToListing === 'true';
    }

    const analyses = await WasteAnalysis.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('listingId', 'title status images');

    const count = await WasteAnalysis.countDocuments(query);

    res.status(200).json({
      analyses,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error('Get history error:', error);
    res.status(500).json({ message: 'Failed to fetch history' });
  }
};

// @desc    Get single analysis by ID
// @route   GET /api/waste-analysis/:id
// @access  Private
exports.getAnalysisById = async (req, res) => {
  try {
    const analysis = await WasteAnalysis.findById(req.params.id)
      .populate('user', 'firstName lastName avatar')
      .populate('listingId', 'title status images');

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check ownership
    if (analysis.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Failed to fetch analysis' });
  }
};

// @desc    Save/bookmark an analysis
// @route   PUT /api/waste-analysis/:id/save
// @access  Private
exports.toggleSaveAnalysis = async (req, res) => {
  try {
    const analysis = await WasteAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    analysis.saved = !analysis.saved;
    await analysis.save();

    res.status(200).json({
      message: analysis.saved ? 'Analysis saved' : 'Analysis unsaved',
      saved: analysis.saved,
    });
  } catch (error) {
    console.error('Toggle save error:', error);
    res.status(500).json({ message: 'Failed to update analysis' });
  }
};

// @desc    Delete an analysis
// @route   DELETE /api/waste-analysis/:id
// @access  Private
exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await WasteAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await analysis.deleteOne();

    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ message: 'Failed to delete analysis' });
  }
};

// @desc    Create listing from analysis
// @route   POST /api/waste-analysis/:id/create-listing
// @access  Private
exports.createListingFromAnalysis = async (req, res) => {
  try {
    const analysis = await WasteAnalysis.findById(req.params.id);

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    // Check ownership
    if (analysis.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (!analysis.donationPossible) {
      return res.status(400).json({ 
        message: 'This item is not recommended for donation' 
      });
    }

    const { 
      title,
      description, 
      quantity, 
      unit, 
      pickupLocation,
      images 
    } = req.body;

    // Create listing
    const listing = await Listing.create({
      title: title || analysis.tfLabel,
      description: description || `${analysis.tfLabel} - ${analysis.material}`,
      category: analysis.donationCategory || 'other',
      donor: req.user._id,
      quantity: quantity || 1,
      unit: unit || 'item',
      pickupLocation: pickupLocation || req.user.address,
      images: images || [],
      fromAIAnalysis: true,
      aiAnalysisId: analysis._id,
      status: 'available',
    });

    // Mark analysis as converted
    await analysis.markAsConverted(listing._id);

    res.status(201).json({
      success: true,
      message: 'Listing created successfully',
      listing,
    });
  } catch (error) {
    console.error('Create listing error:', error);
    res.status(500).json({ message: 'Failed to create listing' });
  }
};

// @desc    Get user's eco score & stats
// @route   GET /api/waste-analysis/stats/my-impact
// @access  Private
exports.getMyImpact = async (req, res) => {
  try {
    const stats = await WasteAnalysis.getUserTotalEcoScore(req.user._id);
    const materialBreakdown = await WasteAnalysis.getMaterialStats(req.user._id);

    res.status(200).json({
      totalEcoScore: stats.totalScore,
      totalCarbonSaved: parseFloat(stats.totalCarbon.toFixed(2)),
      totalWasteDiverted: parseFloat(stats.totalWaste.toFixed(2)),
      totalAnalyses: stats.count,
      materialBreakdown,
    });
  } catch (error) {
    console.error('Get impact error:', error);
    res.status(500).json({ message: 'Failed to fetch impact stats' });
  }
};

// @desc    Get community stats
// @route   GET /api/waste-analysis/stats/community
// @access  Public
exports.getCommunityStats = async (req, res) => {
  try {
    const stats = await WasteAnalysis.getCommunityStats();
    const materialBreakdown = await WasteAnalysis.getMaterialStats();

    res.status(200).json({
      ...stats,
      totalCarbonSaved: parseFloat(stats.totalCarbonSaved.toFixed(2)),
      totalWasteDiverted: parseFloat(stats.totalWasteDiverted.toFixed(2)),
      avgConfidence: parseFloat(stats.avgConfidence.toFixed(1)),
      materialBreakdown,
    });
  } catch (error) {
    console.error('Get community stats error:', error);
    res.status(500).json({ message: 'Failed to fetch community stats' });
  }
};

// @desc    Get leaderboard (top eco score users)
// @route   GET /api/waste-analysis/leaderboard
// @access  Public
exports.getLeaderboard = async (req, res) => {
  try {
    const { limit = 10, period = 'all' } = req.query;

    let dateFilter = {};
    if (period === 'week') {
      dateFilter = { 
        createdAt: { 
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) 
        } 
      };
    } else if (period === 'month') {
      dateFilter = { 
        createdAt: { 
          $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) 
        } 
      };
    }

    const leaderboard = await WasteAnalysis.aggregate([
      { $match: dateFilter },
      { $group: {
          _id: '$user',
          totalEcoScore: { $sum: '$impact.ecoScore' },
          totalCarbonSaved: { $sum: '$impact.carbonSaved' },
          totalWasteDiverted: { $sum: '$impact.wasteDiverted' },
          analysisCount: { $sum: 1 },
        }
      },
      { $sort: { totalEcoScore: -1 } },
      { $limit: parseInt(limit) },
      { $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $project: {
          _id: 0,
          user: {
            _id: '$user._id',
            firstName: '$user.firstName',
            lastName: '$user.lastName',
            avatar: '$user.avatar',
          },
          totalEcoScore: 1,
          totalCarbonSaved: { $round: ['$totalCarbonSaved', 2] },
          totalWasteDiverted: { $round: ['$totalWasteDiverted', 2] },
          analysisCount: 1,
        }
      }
    ]);

    res.status(200).json({ leaderboard, period });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({ message: 'Failed to fetch leaderboard' });
  }
};