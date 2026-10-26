"use strict";

// Returned for rejected grammar alternatives, including while parsing valid CSS.
// API boundaries create real exceptions with stacks when a failure must be exposed.
exports.ParseErrorInfo = class ParseErrorInfo {
  constructor(message) {
    this.message = message;
  }
};

// Keep resource limits separate from parser bugs and exceptions from error listeners.
exports.NestingLimitError = class NestingLimitError extends SyntaxError {
  constructor(offset) {
    super("CSS nesting limit exceeded");
    this.offset = offset;
  }
};
