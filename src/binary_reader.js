'use strict';

/**
 * A simplified binary reader for parsing WhatsApp-like binary data.
 * Uses Node.js Buffers.
 */
class BinaryReader {
  /**
   * @param {Buffer} buffer - The buffer to read from.
   */
  constructor(buffer) {
    this.buffer = buffer;
    this.index = 0;
  }

  checkEOS(length) {
    if (this.index + length > this.buffer.length) {
      throw new Error('End of stream reached');
    }
  }

  readByte() {
    this.checkEOS(1);
    return this.buffer[this.index++];
  }

  /**
   * Reads n bytes as an unsigned integer.
   * @param {number} n - Number of bytes to read.
   * @param {boolean} [littleEndian=false] - Endianness.
   * @returns {number} - The integer value.
   */
  readIntN(n, littleEndian = false) {
    this.checkEOS(n);
    let ret = 0;
    if (littleEndian) {
      for (let i = 0; i < n; i++) {
        ret |= this.buffer[this.index + i] << (8 * i);
      }
    } else {
      for (let i = 0; i < n; i++) {
        ret |= this.buffer[this.index + i] << (8 * (n - 1 - i));
      }
    }
    this.index += n;
    return ret;
  }

  readInt16(littleEndian = false) {
    return this.readIntN(2, littleEndian);
  }

  /**
   * Reads a string of the given length.
   * @param {number} length - Length of the string to read.
   * @returns {string} - The read string (UTF-8).
   */
  readString(length) {
    this.checkEOS(length);
    const str = this.buffer.slice(this.index, this.index + length).toString('utf8');
    this.index += length;
    return str;
  }
}

module.exports = BinaryReader;
