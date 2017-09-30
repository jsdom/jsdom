"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { reflectURLAttribute } = require("../../utils");

class HTMLSourceElementImpl extends HTMLElementImpl {
  get src() {
    return reflectURLAttribute(this, "src");
  }

  set src(value) {
    this.setAttribute("src", value);
  }
}

module.exports = {
  implementation: HTMLSourceElementImpl
};
