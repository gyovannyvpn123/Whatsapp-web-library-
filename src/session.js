'use strict';

const fs = require('fs');
const path = require('path');

const SESSION_FILE = path.join(__dirname, 'session.json');

/**
 * Saves session data to a JSON file.
 * @param {Object} sessionData - The session data.
 */
function saveSession(sessionData) {
  fs.writeFileSync(SESSION_FILE, JSON.stringify(sessionData, null, 2), 'utf8');
}

/**
 * Loads session data from the JSON file.
 * @returns {Object|null} - The session object or null if the file does not exist.
 */
function loadSession() {
  if (fs.existsSync(SESSION_FILE)) {
    return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
  }
  return null;
}

module.exports = {
  saveSession,
  loadSession
};
