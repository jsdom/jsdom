"use strict";

const CSSStyleDeclaration = require("./CSSStyleDeclaration-impl.js");
// https://drafts.csswg.org/cssom-1/#cssmargindescriptors
// The interface is required by CSSOM but its IDL definition is missing.
// https://github.com/w3c/csswg-drafts/issues/10106
class CSSMarginDescriptorsImpl extends CSSStyleDeclaration.implementation {}
exports.implementation = CSSMarginDescriptorsImpl;
