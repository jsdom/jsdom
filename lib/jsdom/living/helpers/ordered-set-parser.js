"use strict";

module.exports = function orderedSetParser(input) {
  return new Set(input.split(/[\u{0009}\u{000A}\u{000C}\u{000D}\u{0020}]+/u).filter(Boolean));
};
