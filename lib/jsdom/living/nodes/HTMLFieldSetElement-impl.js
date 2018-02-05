"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { descendantsByHTMLLocalNames } = require("../helpers/traversal");
const { closest } = require("../helpers/traversal");

class HTMLFieldSetElementImpl extends HTMLElementImpl {
  get form() {
    return closest(this, "form");
  }

  get willValidate() {
    return false;
  }

  checkValidity() {
    return true;
  }

  reportValidity() {
    return true;
  }

}

module.exports = {
  implementation: HTMLFieldSetElementImpl
};
