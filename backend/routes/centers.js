const express = require("express");
const router = express.Router();
const DonationCenter = require("../models/DonationCenter");

// GET /centers - Get all centers (donation, recycling, or both)
router.get("/", async (req, res) => {
  try {
    // Optionally filter by type: ?type=donation|recycling|both
    const filter = req.query.type ? { type: req.query.type } : {};
    const centers = await DonationCenter.find(filter);
    res.json(centers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch centers" });
  }
});

module.exports = router;
