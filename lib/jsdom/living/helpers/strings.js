"use strict";

const Decimal = require("decimal.js");

// https://infra.spec.whatwg.org/#ascii-whitespace
const asciiWhitespaceRe = /^[\t\n\f\r ]$/;
exports.asciiWhitespaceRe = asciiWhitespaceRe;

// https://infra.spec.whatwg.org/#ascii-digit
const asciiDigitRe = /^[0-9]$/;
exports.asciiDigitRe = asciiDigitRe;

// https://infra.spec.whatwg.org/#ascii-lowercase
exports.asciiLowercase = s => {
  return s.replace(/[A-Z]/g, l => l.toLowerCase());
};

// https://infra.spec.whatwg.org/#ascii-uppercase
exports.asciiUppercase = s => {
  return s.replace(/[a-z]/g, l => l.toUpperCase());
};

// https://infra.spec.whatwg.org/#strip-newlines
exports.stripNewlines = s => {
  return s.replace(/[\n\r]+/g, "");
};

// https://infra.spec.whatwg.org/#strip-leading-and-trailing-ascii-whitespace
exports.stripLeadingAndTrailingASCIIWhitespace = s => {
  return s.replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
};

// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
exports.stripAndCollapseASCIIWhitespace = s => {
  return s.replace(/[ \t\n\f\r]+/g, " ").replace(/^[ \t\n\f\r]+/, "").replace(/[ \t\n\f\r]+$/, "");
};

// https://html.spec.whatwg.org/multipage/infrastructure.html#valid-simple-colour
exports.isValidSimpleColor = s => {
  return /^#[a-fA-F\d]{6}$/.test(s);
};

// https://infra.spec.whatwg.org/#ascii-case-insensitive
exports.asciiCaseInsensitiveMatch = (a, b) => {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; ++i) {
    if ((a.charCodeAt(i) | 32) !== (b.charCodeAt(i) | 32)) {
      return false;
    }
  }

  return true;
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#rules-for-parsing-integers
// Error is represented as null.
function parseIntegerDecimal(input) {
  let position = 0;
  let sign = 1;
  position = skipASCIIWhitespace(input, position);
  if (position >= input.length) {
    return null;
  }
  if (input[position] === "-") {
    sign = -1;
    position++;
    if (position >= input.length) {
      return null;
    }
  } else if (input[position] === "+") {
    position++;
    if (position >= input.length) {
      return null;
    }
  }
  if (!asciiDigitRe.test(input[position])) {
    return null;
  }
  let value = new Decimal(0);
  while (position < input.length && asciiDigitRe.test(input[position])) {
    value = value.mul(10).add(input.charCodeAt(position) - "0".charCodeAt(0));
    position++;
  }
  return value.mul(sign);
}
exports.parseIntegerDecimal = parseIntegerDecimal;
exports.parseInteger = input => {
  const decimal = parseIntegerDecimal(input);
  if (decimal === null) {
    return null;
  }
  return decimal.toNumber();
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#rules-for-parsing-non-negative-integers
// Error is represented as null.
function parseNonNegativeIntegerDecimal(input) {
  const value = parseIntegerDecimal(input);
  if (value === null) {
    return null;
  }
  if (value.isNegative()) {
    return null;
  }
  return value;
}
exports.parseNonNegativeIntegerDecimal = parseNonNegativeIntegerDecimal;
exports.parseNonNegativeInteger = input => {
  const decimal = parseNonNegativeIntegerDecimal(input);
  if (decimal === null) {
    return null;
  }
  return decimal.toNumber();
};

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-floating-point-number
const floatingPointNumRe = /^-?(?:\d+|\d*\.\d+)(?:[eE][-+]?\d+)?$/;
exports.isValidFloatingPointNumber = str => floatingPointNumRe.test(str);

// https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#rules-for-parsing-floating-point-number-values
// Error is represented as null.
exports.parseFloatingPointNumber = str => {
  // The implementation here is slightly different from the spec's. We need to use parseFloat() in order to retain
  // accuracy, but parseFloat() trims Unicode whitespace in addition to just ASCII ones, so we make sure that the
  // trimmed prefix contains only ASCII whitespace ourselves.
  const numWhitespace = str.length - str.trimStart().length;
  if (/[^\t\n\f\r ]/.test(str.slice(0, numWhitespace))) {
    return null;
  }
  const parsed = parseFloat(str);
  return isFinite(parsed) ? parsed : null;
};

// https://infra.spec.whatwg.org/#skip-ascii-whitespace
function skipASCIIWhitespace(input, position) {
  while (position < input.length && asciiWhitespaceRe.test(input[position])) {
    position++;
  }
  return position;
}
exports.skipASCIIWhitespace = skipASCIIWhitespace;

// https://infra.spec.whatwg.org/#split-on-ascii-whitespace
exports.splitOnASCIIWhitespace = str => {
  let position = 0;
  const tokens = [];
  position = skipASCIIWhitespace(str, position);
  if (position === str.length) {
    return tokens;
  }
  while (position < str.length) {
    const start = position;
    while (position < str.length && !asciiWhitespaceRe.test(str[position])) {
      position++;
    }
    tokens.push(str.slice(start, position));
    position = skipASCIIWhitespace(str, position);
  }
  return tokens;
};

// https://infra.spec.whatwg.org/#split-on-commas
exports.splitOnCommas = str => {
  let position = 0;
  const tokens = [];
  while (position < str.length) {
    let start = position;
    while (position < str.length && str[position] !== ",") {
      position++;
    }
    let end = position;
    while (start < str.length && asciiWhitespaceRe.test(str[start])) {
      start++;
    }
    while (end > start && asciiWhitespaceRe.test(str[end - 1])) {
      end--;
    }
    tokens.push(str.slice(start, end));
    if (position < str.length) {
      position++;
    }
  }
  return tokens;
};
