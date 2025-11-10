// backend/controllers/qrController.js
const Transaction = require('../models/Transaction');
const Listing = require('../models/Listing');
const User = require('../models/User');
const { generateQRCode, verifyQRCode, generateQRBuffer } = require('../utils/qrGenerator');

/**
 * Generate QR code for a listing assignment
 * POST /api/qr/generate
 */
const generateQR = async (req, res) => {
  try {
    const { listingId, recipientId } = req.body;
    const donorId = req.user.id; // From auth middleware

    // Validate inputs
    if (!listingId || !recipientId) {
      return res.status(400).json({
        success: false,
        message: 'Listing ID and Recipient ID are required'
      });
    }

    // Verify listing exists and belongs to donor
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }

    if (listing.userId.toString() !== donorId) {
      return res.status(403).json({
        success: false,
        message: 'You can only generate QR codes for your own listings'
      });
    }

    if (listing.status !== 'assigned' && listing.status !== 'available') {
      return res.status(400).json({
        success: false,
        message: `Cannot generate QR for listing with status: ${listing.status}`
      });
    }

    // Verify recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        success: false,
        message: 'Recipient not found'
      });
    }

    // Check if active transaction already exists
    const existingTransaction = await Transaction.findOne({
      listing: listingId,
      recipient: recipientId,
      status: 'pending'
    });

    if (existingTransaction) {
      return res.status(200).json({
        success: true,
        message: 'QR code already exists',
        qrCode: existingTransaction.qrCode,
        qrCodeImage: existingTransaction.qrCodeImage || null,
        transaction: existingTransaction
      });
    }

    // Create new transaction record
    const transaction = new Transaction({
      listing: listingId,
      donor: donorId,
      recipient: recipientId,
      status: 'pending',
      pickupLocation: listing.location
    });

    // Generate QR code
    const qrResult = await generateQRCode(
      transaction._id,
      listingId,
      recipientId
    );

    // Save QR data to transaction
    transaction.qrCode = qrResult.qrCode;
    transaction.qrCodeHash = qrResult.qrCodeHash;
    transaction.qrCodeImage = qrResult.qrCodeImage;

    // Calculate impact
    transaction.calculateImpact({
      quantity: listing.quantity,
      estimatedWeight: listing.estimatedWeight || 1
    });

    await transaction.save();

    // Update listing status to assigned
    if (listing.status !== 'assigned') {
      listing.status = 'assigned';
      listing.assignedTo = recipientId;
      await listing.save();
    }

    res.status(201).json({
      success: true,
      message: 'QR code generated successfully',
      qrCode: qrResult.qrCode,
      qrCodeImage: qrResult.qrCodeImage,
      transaction: {
        id: transaction._id,
        expiresAt: transaction.expiresAt,
        status: transaction.status
      }
    });

  } catch (error) {
    console.error('Generate QR Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate QR code',
      error: error.message
    });
  }
};

/**
 * Verify QR code and complete transaction
 * POST /api/qr/verify
 */
const verifyQR = async (req, res) => {
  try {
    const { qrCode, location } = req.body;
    const scannerId = req.user.id; // User who scanned the QR

    if (!qrCode) {
      return res.status(400).json({
        success: false,
        message: 'QR code data is required'
      });
    }

    // Verify QR code authenticity
    const verification = verifyQRCode(qrCode);

    if (!verification.valid) {
      return res.status(400).json({
        success: false,
        message: verification.error || 'Invalid QR code'
      });
    }

    // Find transaction
    const transaction = await Transaction.findById(verification.transactionId)
      .populate('listing', 'title quantity category imageUrl estimatedWeight')
      .populate('donor', 'firstName lastName email profilePicture')
      .populate('recipient', 'firstName lastName email profilePicture');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check if already completed
    if (transaction.status === 'completed') {
      return res.status(400).json({
        success: false,
        message: 'This QR code has already been used',
        transaction: transaction
      });
    }

    // Check if expired
    if (transaction.status === 'expired' || new Date() > transaction.expiresAt) {
      transaction.status = 'expired';
      await transaction.save();
      
      return res.status(400).json({
        success: false,
        message: 'QR code has expired'
      });
    }

    // Verify scanner is either donor or recipient
    const isDonor = transaction.donor._id.toString() === scannerId;
    const isRecipient = transaction.recipient._id.toString() === scannerId;

    if (!isDonor && !isRecipient) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to verify this transaction'
      });
    }

    // Complete the transaction
    await transaction.complete(scannerId, location);

    // Update listing status
    const listing = await Listing.findById(transaction.listing._id);
    if (listing) {
      listing.status = 'completed';
      listing.completedAt = new Date();
      await listing.save();
    }

    // Update user stats (you can expand this)
    await User.findByIdAndUpdate(transaction.donor._id, {
      $inc: { 'stats.totalDonations': 1 }
    });

    await User.findByIdAndUpdate(transaction.recipient._id, {
      $inc: { 'stats.totalReceived': 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Pickup verified successfully! 🎉',
      transaction: transaction,
      impact: transaction.impact
    });

  } catch (error) {
    console.error('Verify QR Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify QR code',
      error: error.message
    });
  }
};

/**
 * Get transaction details
 * GET /api/qr/transaction/:id
 */
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findById(id)
      .populate('listing', 'title quantity category imageUrl')
      .populate('donor', 'firstName lastName email')
      .populate('recipient', 'firstName lastName email');

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check authorization
    const isDonor = transaction.donor._id.toString() === userId;
    const isRecipient = transaction.recipient._id.toString() === userId;

    if (!isDonor && !isRecipient) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access'
      });
    }

    res.status(200).json({
      success: true,
      transaction: transaction
    });

  } catch (error) {
    console.error('Get Transaction Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transaction',
      error: error.message
    });
  }
};

/**
 * Get user's transactions
 * GET /api/qr/my-transactions
 */
const getMyTransactions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, role } = req.query; // role: 'donor' or 'recipient'

    let query = {};

    if (role === 'donor') {
      query.donor = userId;
    } else if (role === 'recipient') {
      query.recipient = userId;
    } else {
      // Get both
      query.$or = [{ donor: userId }, { recipient: userId }];
    }

    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .populate('listing', 'title quantity category imageUrl')
      .populate('donor', 'firstName lastName')
      .populate('recipient', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: transactions.length,
      transactions: transactions
    });

  } catch (error) {
    console.error('Get Transactions Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch transactions',
      error: error.message
    });
  }
};

/**
 * Download QR code as image
 * GET /api/qr/download/:transactionId
 */
const downloadQR = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user.id;

    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Check authorization
    if (transaction.donor.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    // Generate QR as buffer
    const qrBuffer = await generateQRBuffer(transaction.qrCode);

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', `attachment; filename="qr-code-${transactionId}.png"`);
    res.send(qrBuffer);

  } catch (error) {
    console.error('Download QR Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to download QR code',
      error: error.message
    });
  }
};

module.exports = {
  generateQR,
  verifyQR,
  getTransaction,
  getMyTransactions,
  downloadQR
};