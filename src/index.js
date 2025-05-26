'use strict';

const WhatsAppWebSocket = require('./websocket');
const MessageManager = require('./message');
const MediaManager = require('./media');
const ReactionManager = require('./reactions');
const { saveSession, loadSession } = require('./session');
const QRAuth = require('./qr_auth');
const NotificationsManager = require('./notifications');
const GroupsManager = require('./groups');
const ReconnectManager = require('./reconnect');

/**
 * WhatsAppClient integrează toate modulele într-un API public unificat.
 */
class WhatsAppClient {
  constructor() {
    // Inițializează conexiunea WebSocket.
    this.wsClient = new WhatsAppWebSocket();
    
    // Setează reconectarea automată.
    this.reconnectManager = new ReconnectManager(this.wsClient, 5000);

    // Informații de autentificare de bază.
    this.loginInfo = {
      clientId: null,
      // Cheile sunt pentru demonstrație, în practică acestea sunt derivate corect.
      key: {
        encKey: Buffer.alloc(32),
        macKey: Buffer.alloc(32)
      }
    };

    this.connInfo = {
      // Completează cu alte token-uri și informații de conexiune.
    };

    // Inițializează managerii pentru mesaje, media, reacții și grupuri.
    this.messageManager = new MessageManager(this);
    this.mediaManager = new MediaManager(this);
    this.reactionManager = new ReactionManager(this);
    this.groupsManager = new GroupsManager(this);

    // Inițializează autentificarea QR.
    this.qrAuth = new QRAuth();

    // Inițializează notificările.
    this.notificationsManager = new NotificationsManager(this);
    this.notificationsManager.initNotifications();

    // Setează ascultători pentru evenimente.
    this.wsClient.on('open', () => { console.log('Connected to WhatsApp Web'); });
    this.wsClient.on('json', (tag, json) => { console.log('Received JSON:', tag, json); });
    this.wsClient.on('binary', (tag, buffer) => { console.log('Received binary data:', tag); });
    this.wsClient.on('close', () => { console.log('Disconnected from WhatsApp Web'); });
  }

  connect() {
    this.wsClient.connect();
    // Aici poți adăuga logica de autentificare prin QR sau restaurare de sesiune.
  }

  disconnect() {
    this.wsClient.disconnect();
  }

  sendText(number, text) {
    this.messageManager.sendTextMessage(number, text);
  }

  sendImage(number, caption, imagePath) {
    this.mediaManager.sendImageMessage(number, caption, imagePath);
  }

  sendReaction(remoteJid, messageId, reaction) {
    this.reactionManager.sendReaction(remoteJid, messageId, reaction);
  }
  
  createGroup(subject, participants) {
    this.groupsManager.createGroup(subject, participants);
  }
  
  async generateQRCode(authData) {
    try {
      const qrDataUrl = await this.qrAuth.generateQR(authData);
      console.log('Generated QR Code:', qrDataUrl);
      return qrDataUrl;
    } catch (err) {
      console.error('Error generating QR Code:', err);
    }
  }
}

module.exports = WhatsAppClient;

// Exemplu de utilizare:
if (require.main === module) {
  const client = new WhatsAppClient();
  client.connect();

  // Exemplu: generarea codului QR pentru autentificare
  client.generateQRCode('sample_auth_data').then(qrCodeDataUrl => {
    console.log('QR Code data URL:', qrCodeDataUrl);
  });

  setTimeout(() => {
    client.sendText("123456789", "Hello from our complete WhatsApp client!");
    // Pentru teste suplimentare:
    // client.sendImage("123456789", "Test image", "./path/to/image.jpg");
    // client.sendReaction("123456789@s.whatsapp.net", "MESSAGE_ID", "👍");
    // client.createGroup("New Group", ["123456789", "987654321"]);
  }, 5000);
}
