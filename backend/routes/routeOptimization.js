// backend/routes/routeOptimization.js

const express = require('express');
const router = express.Router();
const { RouteOptimizer } = require('../services/routeOptimizer');
const { auth } = require('../middleware/auth');
const Listing = require('../models/Listing');

/**
 * @route   POST /api/routes/optimize
 * @desc    Optimize pickup routes for NGO/volunteer
 * @access  Private
 */
router.post('/optimize', auth, async (req, res) => {
  try {
    const { depot, pickupIds, vehicleType, maxPickupsPerRoute, timeWindow } = req.body;

    // Validate depot
    if (!depot || !depot.lat || !depot.lon) {
      return res.status(400).json({
        success: false,
        message: 'Depot location (lat, lon) is required'
      });
    }

    // Fetch pickup listings from database
    const pickupListings = await Listing.find({
      _id: { $in: pickupIds },
      status: 'assigned'
    }).populate('donor', 'firstName lastName address');

    if (pickupListings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No valid pickup listings found'
      });
    }

    // Convert listings to pickup format
    const pickups = pickupListings.map(listing => ({
      id: listing._id,
      lat: listing.pickupLocation?.coordinates?.[1] || 0,
      lon: listing.pickupLocation?.coordinates?.[0] || 0,
      donorName: `${listing.donor.firstName} ${listing.donor.lastName}`,
      address: listing.donor.address,
      itemTitle: listing.title,
      quantity: listing.quantity,
      scheduledTime: listing.scheduledPickupTime
    }));

    // Run optimization
    const optimizer = new RouteOptimizer();
    const result = await optimizer.optimizeRoutes(depot, pickups, {
      vehicleType: vehicleType || 'medium_car',
      maxPickupsPerRoute: maxPickupsPerRoute || 15,
      timeWindow
    });

    res.json(result);
  } catch (error) {
    console.error('Route optimization error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to optimize routes',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/routes/my-assigned-pickups
 * @desc    Get all assigned pickups for current user (NGO)
 * @access  Private
 */
router.get('/my-assigned-pickups', auth, async (req, res) => {
  try {
    const pickups = await Listing.find({
      assignedTo: req.user._id,
      status: 'assigned'
    })
    .populate('donor', 'firstName lastName address phone')
    .sort({ scheduledPickupTime: 1 });

    const formattedPickups = pickups.map(listing => ({
      id: listing._id,
      lat: listing.pickupLocation?.coordinates?.[1] || 0,
      lon: listing.pickupLocation?.coordinates?.[0] || 0,
      donorName: `${listing.donor.firstName} ${listing.donor.lastName}`,
      donorPhone: listing.donor.phone,
      address: listing.donor.address,
      itemTitle: listing.title,
      quantity: listing.quantity,
      unit: listing.unit,
      scheduledTime: listing.scheduledPickupTime,
      category: listing.category
    }));

    res.json({
      success: true,
      pickups: formattedPickups,
      total: formattedPickups.length
    });
  } catch (error) {
    console.error('Error fetching pickups:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assigned pickups'
    });
  }
});

module.exports = router;