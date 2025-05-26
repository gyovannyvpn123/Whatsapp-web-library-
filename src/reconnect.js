'use strict';

class ReconnectManager {
  /**
   * @param {Object} wsClient - Instanța WebSocket (WhatsAppWebSocket).
   * @param {number} [interval=5000] - Intervalul de reconectare în milisecunde.
   */
  constructor(wsClient, interval = 5000) {
    this.wsClient = wsClient;
    this.interval = interval;
    this.reconnectTimeout = null;
    this.setupListeners();
  }
  
  setupListeners() {
    this.wsClient.on('close', () => {
      console.log(`Connection closed, attempting to reconnect in ${this.interval}ms`);
      this.scheduleReconnect();
    });
    this.wsClient.on('error', () => {
      console.log(`Connection error, attempting to reconnect in ${this.interval}ms`);
      this.scheduleReconnect();
    });
    this.wsClient.on('open', () => {
      console.log('Reconnected successfully.');
      this.cancelReconnect();
    });
  }
  
  scheduleReconnect() {
    if (!this.reconnectTimeout) {
      this.reconnectTimeout = setTimeout(() => {
        console.log('Reconnecting...');
        this.wsClient.connect();
        this.reconnectTimeout = null;
      }, this.interval);
    }
  }
  
  cancelReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
  }
}

module.exports = ReconnectManager;
