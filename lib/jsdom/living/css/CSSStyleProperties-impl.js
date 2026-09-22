"use strict";

const CSSStyleDeclarationImpl = require("./CSSStyleDeclaration-impl.js").implementation;
const propertyDescriptors = require("../../../generated/css-property-descriptors");

class CSSStylePropertiesImpl extends CSSStyleDeclarationImpl {
  get cssFloat() {
    return this.getPropertyValue("float");
  }

  set cssFloat(value) {
    this._updateStyle(() => propertyDescriptors.float.set.call(this, value));
  }
}

for (const [property, descriptor] of Object.entries(propertyDescriptors)) {
  Object.defineProperty(CSSStylePropertiesImpl.prototype, property, {
    get: descriptor.get,
    set(value) {
      this._updateStyle(() => descriptor.set.call(this, value));
    },
    enumerable: descriptor.enumerable,
    configurable: descriptor.configurable
  });
}

exports.implementation = CSSStylePropertiesImpl;
