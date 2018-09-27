"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { associatedForm } = require("../helpers/form-controls");

class HTMLLegendElementImpl extends HTMLElementImpl {
  get form() {
    return associatedForm(this);
  }
}

module.exports = {
  implementation: HTMLLegendElementImpl
};
