"use strict";

const values = require("./value.js");
const defaults = require("./defaults.js");
const collapse = values.keyword("collapse");
const nowrap = values.keyword("nowrap", ["text-wrap-mode"]);
const preserve = values.keyword("preserve");
const preserveBreaks = values.keyword("preserve-breaks");
const wrap = values.keyword("wrap", ["text-wrap-mode"]);

// https://drafts.csswg.org/css-text-4/#propdef-white-space
exports.mapping = new Map([
  ["normal", [collapse, wrap, defaults.none]],
  ["pre", [preserve, nowrap, defaults.none]],
  ["pre-wrap", [preserve, wrap, defaults.none]],
  ["pre-line", [preserveBreaks, wrap, defaults.none]]
]);
