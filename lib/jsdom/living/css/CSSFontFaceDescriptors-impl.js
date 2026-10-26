"use strict";

const CSSStyleDeclaration = require("./CSSStyleDeclaration-impl.js");
// https://drafts.csswg.org/css-fonts-5/#cssfontfacedescriptors
class CSSFontFaceDescriptorsImpl extends CSSStyleDeclaration.implementation {}
exports.implementation = CSSFontFaceDescriptorsImpl;
