'use strict';

/*
  This file holds protocol constants and tokens.
  The definitions below comprise a simplified version – for a full library,
  all tokens and tags used by WhatsApp Web should be included.
*/

const WATags = {
  LIST_EMPTY: 0,
  STREAM_END: 2,
  DICTIONARY_0: 236,
  DICTIONARY_1: 237,
  DICTIONARY_2: 238,
  DICTIONARY_3: 239,
  LIST_8: 248,
  LIST_16: 249,
  JID_PAIR: 250,
  HEX_8: 251,
  BINARY_8: 252,
  BINARY_20: 253,
  BINARY_32: 254,
  NIBBLE_8: 255,
  SINGLE_BYTE_MAX: 256,
  PACKED_MAX: 254
};

const WASingleByteTokens = [
  null, null, null,
  "200", "400", "404", "500", "501", "502",
  "action", "add", "after", "archive", "author", "available",
  "battery", "before", "body", "broadcast", "chat", "clear",
  "code", "composing", "contacts", "count", "create", "debug",
  "delete", "demote", "duplicate", "encoding", "error", "false",
  "filehash", "from", "g.us", "group", "groups_v2", "height",
  "id", "image", "in", "index", "invis", "item", "jid",
  "kind", "last", "leave", "live", "log", "media", "message",
  "mimetype", "missing", "modify", "name", "notification",
  "notify", "out", "owner", "participant", "paused", "picture",
  "played", "presence", "preview", "promote", "query", "raw",
  "read", "receipt", "received", "recipient", "recording", "relay",
  "remove", "response", "resume", "retry", "s.whatsapp.net",
  "seconds", "set", "size", "status", "subject", "subscribe", "t",
  "text", "to", "true", "type", "unarchive", "unavailable", "url",
  "user", "value", "web", "width", "mute", "read_only", "admin",
  "creator", "short", "update", "powersave", "checksum", "epoch",
  "block", "previous", "409", "replaced", "reason", "spam",
  "modify_tag", "message_info", "delivery", "emoji", "title",
  "description", "canonical-url", "matched-text", "star", "unstar",
  "media_key", "filename", "identity", "unread", "page", "page_count",
  "search", "media_message", "security", "call_log", "profile",
  "ciphertext", "invite", "gif", "vcard", "frequent", "privacy",
  "blacklist", "whitelist", "verify", "location", "document", "elapsed",
  "revoke_invite", "expiration", "unsubscribe", "disable", "vname",
  "old_jid", "new_jid", "announcement", "locked", "prop", "label",
  "color", "call", "offer", "call-id", "quick_reply", "sticker",
  "pay_t", "accept", "reject", "sticker_pack", "invalid", "canceled",
  "missed", "connected", "result", "audio", "video", "recent"
];

const WADoubleByteTokens = [
  // Populate as needed.
];

module.exports = {
  WATags,
  WASingleByteTokens,
  WADoubleByteTokens
};
