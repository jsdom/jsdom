"use strict";

// https://fetch.spec.whatwg.org/#header-name
function isHeaderName(name) {
  return /^[!#$%&'*+\-.^`|~\w]+$/.test(name);
}

// https://fetch.spec.whatwg.org/#header-value
function isHeaderValue(value) {
  return value[0] !== "\t" &&
    value[0] !== " " &&
    value[value.length - 1] !== "\t" &&
    value[value.length - 1] !== " " &&
    !/[\0\r\n]/.test(value);
}

// https://fetch.spec.whatwg.org/#concept-header-value-normalize
function normalizeHeaderValue(potentialValue) {
  // Scan from each end so long interior whitespace runs do not cause quadratic regexp backtracking.
  let start = 0;
  let end = potentialValue.length;
  while (start < end && isHTTPWhitespace(potentialValue.charCodeAt(start))) {
    start++;
  }
  while (end > start && isHTTPWhitespace(potentialValue.charCodeAt(end - 1))) {
    end--;
  }
  return potentialValue.slice(start, end);
}

function isHTTPWhitespace(codePoint) {
  return codePoint === 0x09 || codePoint === 0x0A || codePoint === 0x0D || codePoint === 0x20;
}

module.exports = {
  isHeaderName,
  isHeaderValue,
  normalizeHeaderValue
};
