"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

class HTMLTitleElementImpl extends HTMLElementImpl {
  get text() {
    return this.innerHTML;
  }

  set text(s) {
    this.innerHTML = s;
  }
}

module.exports = {
  implementation: HTMLTitleElementImpl
};
