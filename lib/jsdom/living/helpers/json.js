"use strict";
const { utf8toStringLoose } = require("@exodus/bytes/utf8.js");

// https://infra.spec.whatwg.org/#parse-json-from-bytes
exports.parseJSONFromBytes = bytes => {
  // https://encoding.spec.whatwg.org/#utf-8-decode - strip UTF-8 BOM if present
  // See also https://github.com/ExodusOSS/bytes/issues/17.
  if (bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF) {
    bytes = bytes.subarray(3);
  }
  return JSON.parse(utf8toStringLoose(bytes));
};
