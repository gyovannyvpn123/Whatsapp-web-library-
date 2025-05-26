'use strict';

const WhatsAppWebSocket = require('./websocket');
const MessageManager = require('./message');
const MediaManager = require('./media');
const ReactionManager = require('./reactions');
const { saveSession, loadSession } = require('./session');

/**
 * WhatsAppClient integrates all modules into a unified public API.
 */
class WhatsAppClient {
  constructor() {
    // Initialize the WebSocket connection.
    this.wsClient = new WhatsAppWebSocket();

    // Basic objects for login and connection information.
    this.loginInfo = {
      clientId: null,
      // For demonstration, keys are set to empty Buffers.
      key: {
        encKey: Buffer.alloc(32),
        macKey: Buffer.alloc(32)
      }
    };

    this.connInfo = {
      // Additional connection tokens and info would be set here.
    };

    // Initialize managers.
    this.messageManager = new MessageManager(this);
    this.mediaManager = new MediaManager(this);
    this.reactionManager = new ReactionManager(this);

    // Set up event listeners.
    this.wsClient.on('open', () => { console.log('Connected to WhatsApp Web'); });
    this.wsClient.on('json', (tag, json) => { console.log('Received JSON:', tag, json); });
    this.wsClient.on('binary', (tag, buffer) => { console.log('Received binary data:', tag); });
    this.wsClient.on('close', () => { console.log('Disconnected from WhatsApp Web'); });
  }

  /**
   * Connects to WhatsApp Web.
   */
  connect() {
    this.wsClient.connect();
    // Here you can add QR code authentication or session restoration logic.
  }

  /**
   * Disconnects from WhatsApp Web.
   */
  disconnect() {
    this.wsClient.disconnect();
  }

  /**
   * Sends a text message.
   * @param {string} number - WhatsApp number (without domain).
   * @param {string} text - Text message.
   */
  sendText(number, text) {
    this.messageManager.sendTextMessage(number, text);
  }

  /**
   * Sends an image message.
   * @param {string} number - WhatsApp number.
   * @param {string} caption - Caption for the image.
   * @param {string} imagePath - Path to the image file.
   */
  sendImage(number, caption, imagePath) {
    this.mediaManager.sendImageMessage(number, caption, imagePath);
  }

  /**
   * Sends a reaction to a message.
   * @param {string} remoteJid - Recipient's jid (e.g., "123456789@s.whatsapp.net").
   * @param {string} messageId - ID of the message being reacted to.
   * @param {string} reaction - Emoji reaction.
   */
  sendReaction(remoteJid, messageId, reaction) {
    this.reactionManager.sendReaction(remoteJid, messageId, reaction);
  }
}

module.exports = WhatsAppClient;

// Example usage:
if (require.main === module) {
  const client = new WhatsAppClient();
  client.connect();

  // Wait 5 seconds for connection before sending test messages.
  setTimeout(() => {
    client.sendText("123456789", "Hello from our full WhatsApp client!");
    // Uncomment and adjust the following lines when you are ready to test media and reactions:
    // client.sendImage("123456789", "Test image", "./path/to/image.jpg");
    // client.sendReaction("123456789@s.whatsapp.net", "MESSAGE_ID", "👍");
  }, 5000);
      }
