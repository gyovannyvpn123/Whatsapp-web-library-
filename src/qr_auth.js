'use strict';

const qrcode = require('qrcode');

class QRAuth {
  /**
   * Generates a QR code image as a data URL.
   * @param {string} authData - The authentication data to encode.
   * @returns {Promise<string>} - A promise that resolves with a data URL (PNG) representing the QR code.
   */
  async generateQR(authData) {
    try {
      const qrDataUrl = await qrcode.toDataURL(authData, {
        errorCorrectionLevel: 'L',
        type: 'image/png',
        margin: 1
      });
      return qrDataUrl;
    } catch (error) {
      console.error('QR Code generation error:', error);
      throw error;
    }
  }
}

module.exports = QRAuth;
