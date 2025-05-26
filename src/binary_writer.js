'use strict';

/**
 * A simplified binary writer for constructing WhatsApp-like messages.
 * Builds an array of byte values and outputs a Node.js Buffer.
 */
class BinaryWriter {
  constructor() {
    this.data = [];
  }

  pushByte(value) {
    this.data.push(value & 0xFF);
  }

  pushBytes(bytes) {
    if (Buffer.isBuffer(bytes)) {
      this.data = this.data.concat(Array.from(bytes));
    } else {
      this.data = this.data.concat(bytes);
    }
  }

  /**
   * Writes an unsigned integer using n bytes.
   * @param {number} value - The integer value.
   * @param {number} n - Number of bytes.
   * @param {boolean} [littleEndian=false] - Endianness.
   */
  pushIntN(value, n, littleEndian = false) {
    for (let i = 0; i < n; i++) {
      const shift = littleEndian ? i : (n - 1 - i);
      this.pushByte((value >> (8 * shift)) & 0xFF);
    }
  }

  /**
   * Writes a length-prefixed string.
   * For simplicity, writes the length as a single byte if possible.
   * @param {string} str - The string to write.
   */
  writeString(str) {
    const buf = Buffer.from(str, 'utf8');
    this.writeByteLength(buf.length);
    this.pushBytes(buf);
  }

  /**
   * Writes a length field with a tag:
   * - If length < 256, uses tag 252 (BINARY_8).
   * - If length < 2^20, uses tag 253 (BINARY_20).
   * - Otherwise, uses tag 254 (BINARY_32).
   * @param {number} length - The length to write.
   */
  writeByteLength(length) {
    if (length < 256) {
      this.pushByte(252);
      this.pushByte(length);
    } else if (length < (1 << 20)) {
      this.pushByte(253);
      const b1 = (length >> 16) & 0x0F;
      const b2 = (length >> 8) & 0xFF;
      const b3 = length & 0xFF;
      this.pushByte(b1);
      this.pushByte(b2);
      this.pushByte(b3);
    } else {
      this.pushByte(254);
      this.pushIntN(length, 4);
    }
  }

  getBuffer() {
    return Buffer.from(this.data);
  }
}

module.exports = BinaryWriter;
