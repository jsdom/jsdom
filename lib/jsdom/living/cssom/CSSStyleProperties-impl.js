"use strict";

const cssstyle = require("cssstyle");
const CSSStyleDeclaration = require("./CSSStyleDeclaration-impl").implementation;

class CSSStyleProperties extends CSSStyleDeclaration {
  constructor(globalObject, args, { options = {} }) {
    super(globalObject, args, { options });
  }

  get cssFloat() {
    return this._style.float;
  }

  set cssFloat(value) {
    this._style.float = value;
  }
}

for (const definition of Object.values(cssstyle.propertyList)) {
  const { legacyAliasOf, name, styleDeclaration } = definition;
  const property = legacyAliasOf ?? name;
  for (const aliasProperty of styleDeclaration) {
    Object.defineProperty(CSSStyleProperties.prototype, aliasProperty, {
      get() {
        return this._style[property];
      },
      set(value) {
        this._style[property] = value;
      },
      enumerable: true
    });
  }
}

module.exports = {
  implementation: CSSStyleProperties
};
