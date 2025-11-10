// backend/utils/qrGenerator.js
const QRCode = require('qrcode');
const crypto = require('crypto');

/**
 * Generate a unique, encrypted QR code for a transaction
 */
const generateQRCode = async (transactionId, listingId, recipientId) => {
  try {
    // Create unique payload with timestamp
    const payload = {
      t: transactionId.toString(),
      l: listingId.toString(),
      r: recipientId.toString(),
      ts: Date.now(),
      v: '1.0' // version
    };

    // Convert to JSON string
    const payloadString = JSON.stringify(payload);

    // Create hash for verification
    const hash = crypto
      .createHash('sha256')
      .update(payloadString + process.env.QR_SECRET)
      .digest('hex');

    // Combine payload with hash
    const qrData = {
      data: payloadString,
      hash: hash
    };

    // Convert to Base64 for compact QR code
    const qrString = Buffer.from(JSON.stringify(qrData)).toString('base64');

    // Generate QR code image (Data URL)
    const qrCodeDataURL = await QRCode.toDataURL(qrString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 400,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    return {
      qrCode: qrString,
      qrCodeImage: qrCodeDataURL,
      qrCodeHash: hash,
      payload: payload
    };

  } catch (error) {
    console.error('QR Generation Error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Verify QR code authenticity
 */
const verifyQRCode = (qrString) => {
  try {
    // Decode Base64
    const decodedString = Buffer.from(qrString, 'base64').toString('utf-8');
    const qrData = JSON.parse(decodedString);

    // Extract data and hash
    const { data, hash } = qrData;
    const payload = JSON.parse(data);

    // Verify hash
    const expectedHash = crypto
      .createHash('sha256')
      .update(data + process.env.QR_SECRET)
      .digest('hex');

    if (hash !== expectedHash) {
      throw new Error('Invalid QR code: Hash mismatch');
    }

    // Check timestamp (optional: prevent very old QR codes)
    const qrAge = Date.now() - payload.ts;
    const maxAge = 48 * 60 * 60 * 1000; // 48 hours

    if (qrAge > maxAge) {
      throw new Error('QR code expired');
    }

    return {
      valid: true,
      transactionId: payload.t,
      listingId: payload.l,
      recipientId: payload.r,
      timestamp: payload.ts,
      version: payload.v
    };

  } catch (error) {
    return {
      valid: false,
      error: error.message
    };
  }
};

/**
 * Generate QR code as Buffer (for downloads)
 */
const generateQRBuffer = async (qrString) => {
  try {
    const buffer = await QRCode.toBuffer(qrString, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 400,
      margin: 2
    });
    return buffer;
  } catch (error) {
    throw new Error('Failed to generate QR buffer');
  }
};

/**
 * Generate QR code as SVG (scalable)
 */
const generateQRSVG = async (qrString) => {
  try {
    const svg = await QRCode.toString(qrString, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      width: 400,
      margin: 2
    });
    return svg;
  } catch (error) {
    throw new Error('Failed to generate QR SVG');
  }
};

module.exports = {
  generateQRCode,
  verifyQRCode,
  generateQRBuffer,
  generateQRSVG
};