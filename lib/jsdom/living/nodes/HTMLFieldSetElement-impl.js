"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { descendantsByHTMLLocalNames } = require("../helpers/traversal");
const { closest } = require("../helpers/traversal");

class HTMLFieldSetElementImpl extends HTMLElementImpl {
  get form() {
    return closest(this, "form");
  }

  get willValidate() {
    return !this.hasAttribute("disabled");
  }

  checkValidity() {
    if (!this.willValidate) {
      return true;
    }
    const fieldsets = descendantsByHTMLLocalNames(this, new Set(["fieldset"]));
    const controlNotUnderFieldset = control => fieldsets.every(fieldset => fieldset === control || !fieldset.contains(control));
    const controls = descendantsByHTMLLocalNames(this,
        new Set(["input", "select", "textarea"]));
    return !controls.concat(fieldsets).some(element => controlNotUnderFieldset(element) &&
      !element.checkValidity());
  }

  reportValidity() {
    if (!this.willValidate) {
      return true;
    }
    const fieldsets = descendantsByHTMLLocalNames(this, new Set(["fieldset"]));
    const controlNotUnderFieldset = control => fieldsets.every(fieldset => fieldset === control || !fieldset.contains(control));
    const controls = descendantsByHTMLLocalNames(this,
        new Set(["input", "select", "textarea"]));
    const invalidControls = controls.concat(fieldsets).filter(element => controlNotUnderFieldset(element) && !element.checkValidity());
    return invalidControls.length === 0;
  }

}

module.exports = {
  implementation: HTMLFieldSetElementImpl
};
