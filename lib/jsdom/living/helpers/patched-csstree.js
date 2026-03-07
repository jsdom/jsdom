"use strict";

const { next: syntaxes } = require("@csstools/css-syntax-patches-for-csstree");
const csstree = require("css-tree");

module.exports = csstree.fork(syntaxes);
