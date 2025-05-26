'use strict';

const fs = require('fs');
const crypto = require('crypto');
const BinaryWriter = require('./binary_writer');
const { whatsappEncrypt } = require('./crypto');

/**
 * MediaManager handles sending media messages such as images.
 */
class MediaManager {
  /**
   * @param {Object} waClient - Instance of the WhatsApp client.
   */
  constructor(waClient) {
    this.waClient = waClient;
  }

  /**
   * Reads a file from the given path as a Buffer.
   * @param {string} filePath - Path to the file.
   * @returns {Buffer} - File content.
   */
  readFileAsBuffer(filePath) {
    return fs.readFileSync(filePath);
  }

  /**
   * Sends an image message.
   * @param {string} number - WhatsApp number (without domain).
   * @param {string} caption - Caption for the image.
   * @param {string} imagePath - Path to the image file.
   */
  sendImageMessage(number, caption, imagePath) {
    const imageBuffer = this.readFileAsBuffer(imagePath);
    const messageId = "IMG" + crypto.randomBytes(8).toString('hex').toUpperCase();
    const tag = Date.now().toString();

    // Exemplu simplificat pentru un mesaj de tip imagine.  
    // Într-o implementare completă, fișierul media trebuie uploadat și se obține un URL.
    const messageParams = {
      key: {
        fromMe: true,
        remoteJid: number + "@s.whatsapp.net",
        id: messageId
      },
      messageTimestamp: Date.now(),
      status: 1,
      message: {
        imageMessage: {
          url: "media/" + imagePath, // exemplu; aici ar trebui să fie URL-ul real
          mimetype: "image/jpeg",
          caption: caption,
          fileSha256: crypto.createHash('sha256').update(imageBuffer).digest('base64'),
          fileLength: imageBuffer.length
        }
      }
    };

    const writer = new BinaryWriter();
    writer.pushBytes(Buffer.from(JSON.stringify(messageParams), 'utf8'));
    const binaryData = writer.getBuffer();

    const encryptedPayload = whatsappEncrypt(
      this.waClient.loginInfo.key.encKey,
      this.waClient.loginInfo.key.macKey,
      binaryData
    );

    const payload = tag + ',' + encryptedPayload.toString('binary');
    this.waClient.wsClient.ws.send(payload, { binary: true });
  }
}

module.exports = MediaManager;
