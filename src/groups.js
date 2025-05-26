'use strict';

const crypto = require('crypto');
const BinaryWriter = require('./binary_writer');
const { whatsappEncrypt } = require('./crypto');

class GroupsManager {
  /**
   * @param {Object} waClient - Instanța clientului WhatsApp.
   */
  constructor(waClient) {
    this.waClient = waClient;
  }
  
  /**
   * Creează un nou grup cu subiectul specificat și participanții dați.
   * @param {string} subject - Subiectul grupului.
   * @param {string[]} participants - Array de numere (fără domeniu) care vor participa.
   */
  createGroup(subject, participants) {
    const groupId = "GRP" + crypto.randomBytes(8).toString('hex').toUpperCase();
    const tag = Date.now().toString();
    
    const groupData = {
      group: {
        id: groupId,
        subject: subject,
        participants: participants.map(n => n + "@s.whatsapp.net"),
        creator: this.waClient.loginInfo.clientId,
        timestamp: Date.now()
      }
    };

    const writer = new BinaryWriter();
    writer.pushBytes(Buffer.from(JSON.stringify(groupData), 'utf8'));
    const binaryData = writer.getBuffer();

    const encryptedPayload = whatsappEncrypt(
      this.waClient.loginInfo.key.encKey,
      this.waClient.loginInfo.key.macKey,
      binaryData
    );
    
    const payload = tag + ',' + encryptedPayload.toString('binary');
    this.waClient.wsClient.ws.send(payload, { binary: true });
  }
  
  /**
   * Adaugă un participant la un grup existent.
   * @param {string} groupJid - JID-ul grupului.
   * @param {string} participant - Numărul participantului (fără domeniu).
   */
  addParticipant(groupJid, participant) {
    const tag = Date.now().toString();
    const data = {
      groupAction: {
        action: "add",
        groupJid: groupJid,
        participant: participant + "@s.whatsapp.net",
        timestamp: Date.now()
      }
    };
    
    const writer = new BinaryWriter();
    writer.pushBytes(Buffer.from(JSON.stringify(data), 'utf8'));
    const binaryData = writer.getBuffer();

    const encryptedPayload = whatsappEncrypt(
      this.waClient.loginInfo.key.encKey,
      this.waClient.loginInfo.key.macKey,
      binaryData
    );
    
    const payload = tag + ',' + encryptedPayload.toString('binary');
    this.waClient.wsClient.ws.send(payload, { binary: true });
  }
  
  /**
   * Elimină un participant dintr-un grup.
   * @param {string} groupJid - JID-ul grupului.
   * @param {string} participant - Numărul participantului (fără domeniu).
   */
  removeParticipant(groupJid, participant) {
    const tag = Date.now().toString();
    const data = {
      groupAction: {
        action: "remove",
        groupJid: groupJid,
        participant: participant + "@s.whatsapp.net",
        timestamp: Date.now()
      }
    };
    
    const writer = new BinaryWriter();
    writer.pushBytes(Buffer.from(JSON.stringify(data), 'utf8'));
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

module.exports = GroupsManager;
