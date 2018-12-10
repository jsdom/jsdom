"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLOListElementImpl extends HTMLElementImpl {
  get start() {
    const value = parseInt(this.getAttribute("start"));

    if (!isNaN(value)) {
      return value;
    }

    return 1;
  }
  set start(value) {
    this.setAttribute("start", value);
  }
}

module.exports = {
  implementation: HTMLOListElementImpl
};
