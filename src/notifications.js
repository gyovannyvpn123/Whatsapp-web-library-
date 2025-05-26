'use strict';

class NotificationsManager {
  /**
   * @param {Object} waClient - Instanța clientului WhatsApp.
   */
  constructor(waClient) {
    this.waClient = waClient;
  }
  
  /**
   * Initializează ascultătorii de notificări prin abonarea la evenimentele WebSocket.
   */
  initNotifications() {
    // Ascultă evenimentele JSON primite de la WebSocket
    this.waClient.wsClient.on('json', (tag, json) => {
      this.handleNotification(tag, json);
    });
  }
  
  /**
   * Procesează notificările primite.
   * @param {string} tag - Eticheta mesajului.
   * @param {Object} notification - Obiectul de notificare primit.
   */
  handleNotification(tag, notification) {
    if (notification.type) {
      switch(notification.type) {
        case 'notification':
          console.log('Received system notification:', notification);
          // Aici adaugi logica specifică notificărilor sistem
          break;
        case 'sync':
          console.log('Sync notification received:', notification);
          // Aici procesezi sincronizarea mesajelor
          break;
        default:
          console.log('Other notification received:', notification);
      }
    } else {
      console.log('Received unknown notification:', notification);
    }
  }
}

module.exports = NotificationsManager;
