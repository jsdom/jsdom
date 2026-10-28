"use strict";

module.exports = tokenize;
const stringUtils = require("../utils/string.js");
const { associatedTokens, closingTokens } = require("../values/block.js");
const { NestingLimitError } = require("./errors.js");

// Token kinds are shared immutable metadata. Grammar tagging copies `types`
// before adding production-specific tags.
const functionTokenTypes = ["<function-token>"];
const identifierTokenTypes = ["<ident-token>"];
const numberTokenTypes = ["<number-token>"];
const dimensionTokenTypes = ["<dimension-token>"];
const percentageTokenTypes = ["<percentage-token>"];
const badStringTokenTypes = ["<bad-string-token>"];
const stringTokenTypes = ["<string-token>"];
const badURLTokenTypes = ["<bad-url-token>"];
const urlTokenTypes = ["<url-token>"];
const delimiterTokenTypes = ["<delimiter-token>"];
const hashTokenTypes = ["<hash-token>"];
const atKeywordTokenTypes = ["<at-keyword-token>"];

class CharacterCursor {
  index = -1;

  constructor(text, source, diagnostics) {
    // Non-ASCII code units only occur inside name, string, URL, and comment
    // runs. Those runs preserve surrogate pairs; escape consumption reads a
    // whole code point explicitly. Token positions therefore use UTF-16.
    this.data = text;
    this.source = source;
    this.diagnostics = diagnostics;
  }

  get current() {
    return this.data[this.index];
  }

  atEnd() {
    return this.index + 1 >= this.data.length;
  }

  peek(offset = 0) {
    return this.data[this.index + 1 + offset];
  }

  consume() {
    return this.index + 1 < this.data.length ? this.data[++this.index] : null;
  }

  consumeCodePoint() {
    const start = this.index + 1;
    const codePoint = this.data.codePointAt(start);
    if (codePoint === undefined) {
      return null;
    }
    const width = codePoint > 0xffff ? 2 : 1;
    this.index += width;
    return this.data.slice(start, start + width);
  }

  consumeIf(character) {
    return this.peek() === character ? this.data[++this.index] : null;
  }

  take(count) {
    const start = this.index + 1;
    const end = Math.min(start + count, this.data.length);
    this.index = end - 1;
    const result = this.data.slice(start, end);
    return result;
  }

  consumeIdentifierRun() {
    const { data } = this;
    const start = this.index + 1;
    let end = start;
    while (end < data.length && stringUtils.isIdentifierCharacter(data[end])) {
      ++end;
    }
    this.index = end - 1;
    const result = data.slice(start, end);
    return result;
  }

  consumeDigits() {
    const { data } = this;
    const start = this.index + 1;
    let end = start;
    while (end < data.length && stringUtils.isDigit(data[end])) {
      ++end;
    }
    this.index = end - 1;
    const result = data.slice(start, end);
    return result;
  }

  skipWhitespace() {
    const { data } = this;
    const start = this.index + 1;
    let end = start;
    while (data[end] === " " || data[end] === "\t" || data[end] === "\n") {
      ++end;
    }
    this.index = end - 1;
    return end !== start;
  }
}

function recoverEOF(input, suffix, replacement) {
  if (input.source) {
    input.source.eofRecovery = { suffix, replacement };
  }
}

function reportError(input, message) {
  if (input.diagnostics && input.diagnostics.onError) {
    const error = new SyntaxError(message);
    error.offset = input.index;
    input.diagnostics.onError(error);
  }
}

// https://drafts.csswg.org/css-syntax-3/#consume-remnants-of-bad-url
function consumeInvalidURL(input) {
  let value = "";
  while (!input.atEnd()) {
    const character = input.consume();
    value += stringUtils.startsWithEscape(input.current, input.peek())
      ? consumeEscape(input)
      : character;
    if (character === ")") {
      break;
    }
  }
  return value;
}

// https://drafts.csswg.org/css-syntax-3/#consume-comments
function consumeComments(input) {
  while (input.peek() === "/" && input.peek(1) === "*") {
    input.take(2);
    while (input.peek() !== "*" || input.peek(1) !== "/") {
      if (input.atEnd()) {
        reportError(input, "Unclosed comment");
        recoverEOF(input, "*/");
        return;
      }
      input.consume();
    }
    input.take(2);
  }
}

// https://drafts.csswg.org/css-syntax-3/#consume-escaped-code-point
function consumeEscape(input) {
  const character = input.consumeCodePoint();
  if (!character) {
    reportError(input, "Invalid escape sequence (missing code point)");
    recoverEOF(input, "", "�");
    return "�";
  }
  if (stringUtils.isHexadecimal(character)) {
    let hex = character;
    let hexCount = 0;
    while (stringUtils.isHexadecimal(input.peek()) && hexCount++ < 5) {
      hex += input.consume();
    }
    if (stringUtils.isWhitespace(input.peek())) {
      input.consume();
    }
    const codePoint = Number(`0x${hex}`);
    if (codePoint === 0 || (codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
      return "�";
    }
    return String.fromCodePoint(codePoint);
  }
  return character;
}

// https://drafts.csswg.org/css-syntax-3/#consume-ident-like-token
function consumeIdentifierLike(input) {
  const identifier = consumeIdentifier(input);
  if (input.consumeIf("(")) {
    const { start, value } = identifier;
    const lowercase = stringUtils.toLowerCase(value);
    if (lowercase === "url") {
      while (stringUtils.isWhitespace(input.peek()) && stringUtils.isWhitespace(input.peek(1))) {
        input.consume();
      }
      if (
        stringUtils.isQuote(input.peek()) ||
        (stringUtils.isWhitespace(input.peek()) && stringUtils.isQuote(input.peek(1)))
      ) {
        return {
          end: input.index + 1,
          start,
          types: functionTokenTypes,
          value: lowercase,
        };
      }
      return consumeURL(input, identifier);
    }
    return {
      end: input.index + 1,
      start,
      types: functionTokenTypes,
      value,
    };
  }
  return identifier;
}

// https://drafts.csswg.org/css-syntax-3/#consume-name
function consumeIdentifier(input) {
  const start = input.index + 1;
  let value = input.consumeIdentifierRun();
  while (stringUtils.startsWithEscape(input.peek(), input.peek(1))) {
    input.consume();
    value += consumeEscape(input);
    value += input.consumeIdentifierRun();
  }
  return {
    end: input.index + 1,
    start,
    types: identifierTokenTypes,
    // Names can outlive their input through selector and rule syntax.
    value: stringUtils.copyString(value),
  };
}

// https://drafts.csswg.org/css-syntax-3/#consume-number
// https://github.com/w3c/csswg-drafts/issues/7289
function consumeNumber(input) {
  const token = { start: input.index + 1, types: numberTokenTypes };
  let number = "";
  let integer = true;
  if (input.peek() === "+" || input.peek() === "-") {
    token.sign = number += input.consume();
  }
  number += input.consumeDigits();
  if (stringUtils.startsWithDecimal(input.peek(), input.peek(1))) {
    integer = false;
    number += input.take(2) + input.consumeDigits();
  }
  if (stringUtils.startsWithExponent(input.peek(), input.peek(1), input.peek(2))) {
    integer = false;
    number += input.take(2) + input.consumeDigits();
  }
  token.end = input.index + 1;
  token.value = stringUtils.toNumber(number);
  token.integer = integer;
  return token;
}

// https://drafts.csswg.org/css-syntax-3/#consume-numeric-token
function consumeNumeric(input) {
  const number = consumeNumber(input);
  const { start, value, integer } = number;
  if (stringUtils.startsWithIdentifier(input.peek(), input.peek(1), input.peek(2))) {
    const unit = consumeIdentifier(input);
    return {
      end: input.index + 1,
      start,
      types: dimensionTokenTypes,
      integer,
      unit: stringUtils.toLowerCase(unit.value),
      value,
    };
  }
  if (input.consumeIf("%")) {
    return {
      end: input.index + 1,
      start,
      types: percentageTokenTypes,
      unit: "%",
      value,
    };
  }
  return number;
}

// https://drafts.csswg.org/css-syntax-3/#consume-string-token
function consumeString(input) {
  const { current: ending, index: start } = input;
  let escapedEOF = false;
  let value = "";
  while (!input.atEnd()) {
    const character = input.consume();
    switch (character) {
      case ending:
        return {
          end: input.index + 1,
          start,
          types: stringTokenTypes,
          value,
        };
      case "\n":
        reportError(input, "Unexpected newline");
        --input.index;
        value += "\n";
        return {
          end: input.index + 1,
          start,
          types: badStringTokenTypes,
          value,
        };
      case "\\":
        if (input.peek() === "\n") {
          input.consume();
        } else if (!input.atEnd()) {
          value += consumeEscape(input);
        } else {
          escapedEOF = true;
        }
        break;
      default:
        value += character;
        break;
    }
  }
  reportError(input, "Unclosed string");
  recoverEOF(input, ending, escapedEOF ? "" : undefined);
  return {
    end: input.index + 1,
    start,
    types: stringTokenTypes,
    value,
  };
}

// https://drafts.csswg.org/css-syntax-3/#consume-url-token
function consumeURL(input, { start }) {
  let value = "";
  input.skipWhitespace();
  while (!input.atEnd()) {
    const character = input.consume();
    if (character === ")") {
      return {
        end: input.index + 1,
        start,
        types: urlTokenTypes,
        value,
      };
    }
    if (stringUtils.isWhitespace(character)) {
      input.skipWhitespace();
      if (input.consumeIf(")")) {
        return {
          end: input.index + 1,
          start,
          types: urlTokenTypes,
          value,
        };
      }
      if (input.atEnd()) {
        break;
      }
      reportError(input, "Unexpected whitespace");
      value += ` ${consumeInvalidURL(input)}`;
      return {
        end: input.index + 1,
        start,
        types: badURLTokenTypes,
        value,
      };
    }
    if (
      stringUtils.isQuote(character) ||
      character === "(" ||
      stringUtils.isNonPrintableCharacter(character)
    ) {
      reportError(input, `Unexpected "${character}"`);
      value += `${character}${consumeInvalidURL(input)}`;
      return {
        end: input.index + 1,
        start,
        types: badURLTokenTypes,
        value,
      };
    }
    if (character === "\\") {
      if (stringUtils.startsWithEscape(input.current, input.peek())) {
        value += consumeEscape(input);
        continue;
      }
      reportError(input, "Invalid escaped newline");
      value += `${character}${consumeInvalidURL(input)}`;
      return {
        end: input.index + 1,
        start,
        types: badURLTokenTypes,
        value,
      };
    }
    value += character;
  }
  reportError(input, "Unclosed url");
  recoverEOF(input, ")", input.source?.eofRecovery?.replacement);
  return {
    end: input.index + 1,
    start,
    types: urlTokenTypes,
    value,
  };
}

// https://drafts.csswg.org/css-syntax-3/#consume-token
function consumeToken(input) {
  const start = input.index + 1;
  if (input.skipWhitespace()) {
    do {
      consumeComments(input);
    } while (input.skipWhitespace());
    return {
      end: input.index + 1,
      start,
      types: delimiterTokenTypes,
      value: " ",
    };
  }
  const character = input.consume();
  if (stringUtils.isQuote(character)) {
    return consumeString(input);
  }
  if (character === "#") {
    if (
      stringUtils.isIdentifierCharacter(input.peek()) ||
      stringUtils.startsWithEscape(input.peek(), input.peek(1))
    ) {
      const type = stringUtils.startsWithIdentifier(input.peek(), input.peek(1), input.peek(2))
        ? "id"
        : "unrestricted";
      return {
        ...consumeIdentifier(input),
        start,
        type,
        types: hashTokenTypes,
      };
    }
  } else if (character === "+") {
    if (stringUtils.startsWithNumber(input.current, input.peek(), input.peek(1))) {
      --input.index;
      return consumeNumeric(input);
    }
  } else if (character === "-") {
    if (stringUtils.startsWithNumber(input.current, input.peek(), input.peek(1))) {
      --input.index;
      return consumeNumeric(input);
    }
    if (input.peek() === "-" && input.peek(1) === ">") {
      const value = `-${input.take(2)}`;
      return {
        end: input.index + 1,
        start,
        types: delimiterTokenTypes,
        value,
      };
    }
    if (stringUtils.startsWithIdentifier(input.current, input.peek(), input.peek(1))) {
      --input.index;
      return consumeIdentifierLike(input);
    }
  } else if (character === ".") {
    if (stringUtils.startsWithNumber(input.current, input.peek(), input.peek(1))) {
      --input.index;
      return consumeNumeric(input);
    }
  } else if (character === "<") {
    if (input.peek() === "!" && input.peek(1) === "-" && input.peek(2) === "-") {
      const value = `<${input.take(3)}`;
      return {
        end: input.index + 1,
        start,
        types: delimiterTokenTypes,
        value,
      };
    }
  } else if (character === "@") {
    if (stringUtils.startsWithIdentifier(input.peek(), input.peek(1), input.peek(2))) {
      return {
        ...consumeIdentifier(input),
        start,
        types: atKeywordTokenTypes,
      };
    }
  } else if (character === "\\") {
    if (stringUtils.startsWithEscape(input.current, input.peek())) {
      --input.index;
      return consumeIdentifierLike(input);
    }
    reportError(input, "Invalid escaped newline");
  } else if (stringUtils.isDigit(character)) {
    --input.index;
    return consumeNumeric(input);
  }
  if (stringUtils.isIdentifierStartCharacter(character)) {
    --input.index;
    return consumeIdentifierLike(input);
  }
  return {
    end: input.index + 1,
    start,
    types: delimiterTokenTypes,
    value: character,
  };
}

// https://drafts.csswg.org/css-syntax-3/#css-tokenize
function* tokenize(text, source, diagnostics) {
  const input = new CharacterCursor(text, source, diagnostics);
  const blocks = input.diagnostics ? [] : undefined;
  while (!input.atEnd()) {
    consumeComments(input);
    if (input.atEnd()) {
      break;
    }
    const token = consumeToken(input);
    if (blocks) {
      if (token.types[0] === "<function-token>") {
        blocks.push(")");
      } else if (token.types[0] === "<delimiter-token>") {
        const closing = associatedTokens[token.value];
        if (closing) {
          blocks.push(closing);
        } else if (closingTokens.includes(token.value)) {
          if (blocks.at(-1) === token.value) {
            blocks.pop();
          } else {
            reportError(input, `Unexpected ${token.value}`);
          }
        }
      }
      // Stylesheet parsing is recursive. Reject excessive nesting while lexing,
      // before either grammar matching or CSSOM construction can exhaust the stack.
      if (blocks.length > 128) {
        throw new NestingLimitError(token.start);
      }
    }
    yield token;
  }
  if (blocks && blocks.length > 0) {
    reportError(input, "Unclosed block");
  }
}
