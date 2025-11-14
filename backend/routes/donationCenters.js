const express = require('express');
const router = express.Router();
const DonationCenter = require('../models/DonationCenter');

// Get all centers
router.get('/', async (req, res) => {
  try {
    const centers = await DonationCenter.find({ verified: true });
    res.json({ success: true, centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get nearby centers
router.get('/nearby', async (req, res) => {
  try {
    const { latitude, longitude, maxDistance = 10000 } = req.query; // 10km default

    const centers = await DonationCenter.find({
      verified: true,
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      }
    });

    res.json({ success: true, centers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get single center
router.get('/:id', async (req, res) => {
  try {
    const center = await DonationCenter.findById(req.params.id);
    
    if (!center) {
      return res.status(404).json({ success: false, message: 'Center not found' });
    }

    res.json({ success: true, center });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;