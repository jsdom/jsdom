"use strict";
const conversions = require("webidl-conversions");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLSourceElementImpl extends HTMLElementImpl {
  get srcset() {
    return conversions.USVString(this.getAttributeNS(null, "srcset"));
  }

  set srcset(value) {
    this.setAttributeNS(null, "srcset", value);
  }
}

module.exports = {
  implementation: HTMLSourceElementImpl
};
