'use strict';

const crypto = require('crypto');

/**
 * Generates an HMAC-SHA256 signature.
 * @param {Buffer} key - The HMAC key.
 * @param {Buffer} message - The message to sign.
 * @returns {Buffer} - The HMAC digest.
 */
function hmacSha256(key, message) {
  return crypto.createHmac('sha256', key).update(message).digest();
}

/**
 * Implements HKDF (RFC 5869) for key derivation.
 * @param {Buffer} key - The input key material.
 * @param {number} length - The desired output key length.
 * @param {string} [appInfo=""] - Optional application info.
 * @returns {Buffer} - The derived key.
 */
function hkdf(key, length, appInfo = "") {
  let keyStream = Buffer.alloc(0);
  let keyBlock = Buffer.alloc(0);
  let blockIndex = 1;

  // Extract using a zero-filled salt (32 bytes)
  key = hmacSha256(Buffer.alloc(32), key);

  while (keyStream.length < length) {
    const msg = Buffer.concat([keyBlock, Buffer.from(appInfo), Buffer.from([blockIndex++])]);
    keyBlock = hmacSha256(key, msg);
    keyStream = Buffer.concat([keyStream, keyBlock]);
  }
  return keyStream.slice(0, length);
}

/**
 * Pads data using PKCS7 (AES block size is 16 bytes).
 * @param {Buffer} buffer - The data to pad.
 * @returns {Buffer} - Padded data.
 */
function aesPad(buffer) {
  const blockSize = 16;
  const padLength = blockSize - (buffer.length % blockSize);
  return Buffer.concat([buffer, Buffer.alloc(padLength, padLength)]);
}

/**
 * Removes PKCS7 padding.
 * @param {Buffer} buffer - Data with padding.
 * @returns {Buffer} - Unpadded data.
 */
function aesUnpad(buffer) {
  const padLength = buffer[buffer.length - 1];
  return buffer.slice(0, buffer.length - padLength);
}

/**
 * Encrypts plaintext using AES-256-CBC.
 * @param {Buffer} key - 32-byte encryption key.
 * @param {Buffer} plaintext - Data to encrypt.
 * @returns {Buffer} - IV concatenated with ciphertext.
 */
function aesEncrypt(key, plaintext) {
  plaintext = aesPad(plaintext);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  return Buffer.concat([iv, encrypted]);
}

/**
 * Decrypts ciphertext using AES-256-CBC.
 * @param {Buffer} key - 32-byte decryption key.
 * @param {Buffer} ciphertext - Data with IV prepended.
 * @returns {Buffer} - Decrypted plaintext.
 */
function aesDecrypt(key, ciphertext) {
  const iv = ciphertext.slice(0, 16);
  const data = ciphertext.slice(16);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
  return aesUnpad(decrypted);
}

/**
 * Implements WhatsApp encryption: AES + HMAC-SHA256.
 * @param {Buffer} encKey - The encryption key.
 * @param {Buffer} macKey - The MAC key.
 * @param {Buffer} plaintext - Data to encrypt.
 * @returns {Buffer} - HMAC digest concatenated with encrypted payload.
 */
function whatsappEncrypt(encKey, macKey, plaintext) {
  const encrypted = aesEncrypt(encKey, plaintext);
  const mac = hmacSha256(macKey, encrypted);
  return Buffer.concat([mac, encrypted]);
}

module.exports = {
  hmacSha256,
  hkdf,
  aesPad,
  aesUnpad,
  aesEncrypt,
  aesDecrypt,
  whatsappEncrypt
};
