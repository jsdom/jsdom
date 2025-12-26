"use strict";
const { TextEncoder } = require("@exodus/bytes/encoding.js");

// No wrapper needed since there are no constructor arguments.
exports.implementation = TextEncoder;
