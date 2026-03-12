"use strict";
const { CSSStyleDeclaration } = require("../living/css/CSSStyleDeclaration");

exports.addToCore = core => {
  // CSSStyleDeclaration is the only CSSOM class that isn't a webidl2js-generated interface.
  // All other CSSOM interfaces (CSSStyleSheet, CSSRule subclasses, MediaList, etc.) are
  // registered in interfaces.js and installed automatically via generatedInterface.install().
  core.CSSStyleDeclaration = CSSStyleDeclaration;
};
