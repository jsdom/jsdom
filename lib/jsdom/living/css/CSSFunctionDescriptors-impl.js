"use strict";

const CSSStyleDeclaration = require("./CSSStyleDeclaration-impl.js");
// https://drafts.csswg.org/css-mixins-1/#cssfunctiondescriptors
class CSSFunctionDescriptorsImpl extends CSSStyleDeclaration.implementation {}
exports.implementation = CSSFunctionDescriptorsImpl;
