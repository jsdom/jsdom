"use strict";

const CSSStyleDeclaration = require("./CSSStyleDeclaration-impl.js");
// https://drafts.csswg.org/cssom-1/#csspagedescriptors
class CSSPageDescriptorsImpl extends CSSStyleDeclaration.implementation {}
exports.implementation = CSSPageDescriptorsImpl;
