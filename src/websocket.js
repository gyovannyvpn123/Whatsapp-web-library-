'use strict';

const WebSocket = require('ws');
const EventEmitter = require('events');

/**
 * WhatsAppWebSocket class
 *
 * Manages a WebSocket connection to WhatsApp Web.
 * Emits events for connection open, message received (both JSON and binary),
 * errors, and close events.
 */
class WhatsAppWebSocket extends EventEmitter {
  /**
   * @param {string} url - The WebSocket URL (default: wss://web.whatsapp.com/ws).
   */
  constructor(url = 'wss://web.whatsapp.com/ws') {
    super();
    this.url = url;
    this.ws = null;
    this.keepAliveInterval = null;
  }

  /**
   * Connects to WhatsApp Web.
   */
  connect() {
    this.ws = new WebSocket(this.url, {
      headers: { 'Origin': 'https://web.whatsapp.com' }
    });

    this.ws.on('open', () => this.onOpen());
    this.ws.on('message', (data) => this.onMessage(data));
    this.ws.on('error', (err) => this.onError(err));
    this.ws.on('close', () => this.onClose());
  }

  onOpen() {
    this.emit('open');
    console.log('WhatsApp Web WebSocket connected.');
    this.startKeepAlive();
  }

  onMessage(data) {
    try {
      const messageData = data.toString();
      const index = messageData.indexOf(',');
      if (index === -1) {
        this.emit('message', messageData);
        return;
      }
      const tag = messageData.substring(0, index);
      const payload = messageData.substring(index + 1);
      try {
        const jsonPayload = JSON.parse(payload);
        this.emit('json', tag, jsonPayload);
      } catch (e) {
        this.emit('binary', tag, Buffer.from(payload, 'binary'));
      }
    } catch (err) {
      console.error('Error processing message:', err);
      this.emit('error', err);
    }
  }

  onError(err) {
    console.error('WebSocket error:', err);
    this.emit('error', err);
  }

  onClose() {
    console.log('WhatsApp Web WebSocket closed.');
    this.emit('close');
    this.stopKeepAlive();
  }

  sendJSON(obj, tag = null) {
    if (!tag) tag = Date.now().toString();
    const payload = tag + ',' + JSON.stringify(obj);
    this.ws.send(payload);
    return tag;
  }

  sendBinary(buffer, tag = null) {
    if (!tag) tag = Date.now().toString();
    const tagBuffer = Buffer.from(tag + ',');
    const finalBuffer = Buffer.concat([tagBuffer, buffer]);
    this.ws.send(finalBuffer);
    return tag;
  }

  startKeepAlive() {
    this.keepAliveInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send('?,,');
      }
    }, 20000);
  }

  stopKeepAlive() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
      this.keepAliveInterval = null;
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
    }
  }
}

module.exports = WhatsAppWebSocket;
