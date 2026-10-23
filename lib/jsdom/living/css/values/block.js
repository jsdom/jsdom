"use strict";

const associatedTokens = exports.associatedTokens = {
  "(": ")",
  "[": "]",
  "{": "}"
};
exports.closingTokens = Object.values(associatedTokens);
exports.openingTokens = Object.keys(associatedTokens);
