'use strict';

const crypto = require('crypto');
const { whatsappEncrypt } = require('./crypto');
const BinaryWriter = require('./binary_writer');
// Pentru exemplificare, folosim un obiect simplificat pentru WAMetrics.
const WAMetrics = { MESSAGE: 16 };

/**
 * MessageManager handles creating and sending text messages.
 */
class MessageManager {
  /**
   * @param {Object} waClient - Instance of the WhatsApp client.
   */
  constructor(waClient) {
    this.waClient = waClient;
    this.messageSentCount = 0;
  }

  /**
   * Sends a text message.
   * @param {string} number - WhatsApp number (without domain).
   * @param {string} text - The text to send.
   */
  sendTextMessage(number, text) {
    const messageId = "3EB0" + crypto.randomBytes(8).toString('hex').toUpperCase();
    const tag = Date.now().toString();

    const messageParams = {
      key: {
        fromMe: true,
        remoteJid: number + "@s.whatsapp.net",
        id: messageId
      },
      messageTimestamp: Date.now(),
      status: 1,
      message: {
        conversation: text
      }
    };

    // Serializare simplificată: transformăm obiectul în JSON.
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
    this.messageSentCount++;
  }
}

module.exports = MessageManager;
