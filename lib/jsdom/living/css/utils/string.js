"use strict";

const { Buffer } = require("node:buffer");
const { asciiLowercase: toLowerCase } = require("../../helpers/strings.js");

exports.copyString = copyString;
exports.copySource = copySource;
exports.isDigit = isDigit;
exports.isHexadecimal = isHexadecimal;
exports.isIdentifierCharacter = isIdentifierCharacter;
exports.isIdentifierStartCharacter = isIdentifierStartCharacter;
exports.isNonASCIIIdentifierCharacter = isNonASCIIIdentifierCharacter;
exports.isNonPrintableCharacter = isNonPrintableCharacter;
exports.isQuote = isQuote;
exports.isWhitespace = isWhitespace;
exports.quote = quote;
exports.startsWithDecimal = startsWithDecimal;
exports.startsWithEscape = startsWithEscape;
exports.startsWithExponent = startsWithExponent;
exports.startsWithIdentifier = startsWithIdentifier;
exports.startsWithNumber = startsWithNumber;
exports.tab = tab;
exports.toCSSProperty = toCSSProperty;
exports.toIDLAttribute = toIDLAttribute;
exports.toLowerCase = toLowerCase;
exports.toNumber = toNumber;

// Cached substrings must not retain arbitrarily large source strings. UTF-16 preserves
// lone surrogates so that copying does not change CSS input preprocessing.
const copyBufferSize = 4096;
let copyBuffer;

function copyString(value) {
  const byteLength = value.length * 2;
  if (byteLength > copyBufferSize) {
    return Buffer.from(value, "utf16le").toString("utf16le");
  }
  copyBuffer ??= Buffer.allocUnsafeSlow(copyBufferSize);
  copyBuffer.write(value, 0, byteLength, "utf16le");
  return copyBuffer.toString("utf16le", 0, byteLength);
}

// Optional source spelling becomes owned text only when published in syntax.
function copySource(source) {
  return source === undefined ? undefined : copyString(source);
}

// https://drafts.csswg.org/css-syntax-3/#digit
function isDigit(character = "") {
  const code = character.charCodeAt(0);
  return character.length === 1 && code >= 48 && code <= 57;
}

// https://drafts.csswg.org/css-syntax-3/#hex-digit
function isHexadecimal(character = "") {
  return /^[a-f\d]+$/i.test(character);
}

// https://drafts.csswg.org/css-syntax-3/#identifier-start-code-point
function isIdentifierStartCharacter(character = "") {
  const code = character.charCodeAt(0);
  return code >= 128 || (character.length === 1 &&
    (code === 95 || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)));
}

// https://drafts.csswg.org/css-syntax-3/#identifier-code-point
function isIdentifierCharacter(character = "") {
  const code = character.charCodeAt(0);
  return code >= 128 || (character.length === 1 &&
    (code === 45 || code === 95 || (code >= 48 && code <= 57) ||
     (code >= 65 && code <= 90) || (code >= 97 && code <= 122)));
}

// https://drafts.csswg.org/css-syntax-3/#non-printable-code-point
function isNonPrintableCharacter(character = "") {
  const codePoint = character.codePointAt(0);
  return character === "\t" || codePoint === 0x7F || (codePoint >= 0 && codePoint <= 8) ||
    (codePoint >= 0xE && codePoint <= 0x1F);
}

// https://drafts.csswg.org/css-syntax-3/#non-ascii-ident-code-point
function isNonASCIIIdentifierCharacter(character = "") {
  const codePoint = character.codePointAt(0);
  // Preserve the interoperable identifier repertoire while CSSWG resolves
  // https://github.com/w3c/csswg-drafts/issues/7129.
  return codePoint >= 0x80;
}

function isQuote(character = "") {
  return character === "\"" || character === "'";
}

// https://drafts.csswg.org/css-syntax-3/#whitespace
function isWhitespace(character = "") {
  return character === " " || character === "\n" || character === "\t";
}

function quote(value) {
  return value.includes("'") ? `"${value}"` : `'${value}'`;
}

function tab(depth) {
  let ws = depth * 4;
  let tabs = "";
  while (ws-- > 0) {
    tabs += " ";
  }
  return tabs;
}

function startsWithDecimal(first, second) {
  return first === "." && isDigit(second);
}

// https://drafts.csswg.org/css-syntax-3/#starts-with-a-valid-escape
function startsWithEscape(first, second) {
  return first === "\\" && second !== "\n";
}

function startsWithExponent(first, second, third) {
  return first && toLowerCase(first) === "e" &&
    (isDigit(second) || ((second === "-" || second === "+") && isDigit(third)));
}

// https://drafts.csswg.org/css-syntax-3/#would-start-an-identifier
function startsWithIdentifier(first, second, third) {
  switch (first) {
    case "-":
      return isIdentifierStartCharacter(second) || second === "-" || startsWithEscape(second, third);
    case "\\":
      return startsWithEscape(first, second);
    default:
      return isIdentifierStartCharacter(first);
  }
}

// https://drafts.csswg.org/css-syntax-3/#starts-with-a-number
function startsWithNumber(first, second, third) {
  switch (first) {
    case "-":
    case "+":
      return isDigit(second) || (second === "." && isDigit(third));
    case ".":
      return isDigit(second);
    default:
      return isDigit(first);
  }
}

// https://drafts.csswg.org/cssom-1/#idl-attribute-to-css-property
function toCSSProperty(attribute, dashPrefix) {
  let output = dashPrefix ? "-" : "";
  output += toLowerCase(attribute.replace(/[A-Z]/g, "-$&"));
  return output;
}

// https://drafts.csswg.org/cssom-1/#css-property-to-idl-attribute
function toIDLAttribute(property, lowercaseFirst) {
  let output = "";
  let uppercaseNext = false;
  if (lowercaseFirst) {
    property = property.substring(1);
  }
  for (const character of property) {
    if (character === "-") {
      uppercaseNext = true;
    } else if (uppercaseNext) {
      uppercaseNext = false;
      output += character.toUpperCase();
    } else {
      output += character;
    }
  }
  return output;
}

// https://drafts.csswg.org/css-syntax-3/#convert-string-to-number
// https://github.com/w3c/csswg-drafts/issues/7472
function toNumber(string) {
  const number = Number(string);
  return number === 0 ? 0 : number;
}
