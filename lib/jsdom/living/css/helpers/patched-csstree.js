"use strict";

const { next: syntaxes } = require("@csstools/css-syntax-patches-for-csstree");
const csstree = require("css-tree");

// fork() only returns the core parse/generate/walk API, dropping standalone utilities like string, url,
// ident, tokenTypes, etc. Re-export the ones we need.
const forked = csstree.fork(syntaxes);
forked.string = csstree.string;
forked.ident = csstree.ident;

const originalParse = forked.parse;
forked.parse = function (...args) {
  try {
    return originalParse.apply(this, args);
  } finally {
    if (args[1] && args[1].onParseError) {
      originalParse.call(this, "");
    }
  }
};

module.exports = forked;
