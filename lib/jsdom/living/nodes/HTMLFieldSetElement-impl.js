"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { closest } = require("../helpers/traversal");

class HTMLFieldSetElementImpl extends HTMLElementImpl {
  get form() {
    return closest(this, "form");
  }
}

module.exports = {
  implementation: HTMLFieldSetElementImpl
};
