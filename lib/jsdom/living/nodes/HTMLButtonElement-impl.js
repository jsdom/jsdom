"use strict";
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { closest } = require("../helpers/traversal");
const { isDisabled } = require("../helpers/form-controls");
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const { mixin } = require("../../utils");

class HTMLButtonElementImpl extends HTMLElementImpl {
  _activationBehavior() {
    const { form } = this;
    if (form) {
      if (this.type === "submit" && !isDisabled(this)) {
        form._doSubmit();
      }
    }
  }

  _getValue() {
    const valueAttr = this.getAttribute("value");
    return valueAttr === null ? "" : valueAttr;
  }

  get form() {
    return closest(this, "form");
  }

  get type() {
    const typeAttr = (this.getAttribute("type") || "").toLowerCase();
    switch (typeAttr) {
      case "submit":
      case "reset":
      case "button":
        return typeAttr;
      default:
        return "submit";
    }
  }

  set type(v) {
    v = String(v).toLowerCase();
    switch (v) {
      case "submit":
      case "reset":
      case "button":
        this.setAttribute("type", v);
        break;
      default:
        this.setAttribute("type", "submit");
        break;
    }
  }

  get willValidate() {
    if (this.type === "reset" || this.type === "button" || isDisabled(this)) {
      return false;
    }
    // https://html.spec.whatwg.org/multipage/form-elements.html#the-datalist-element
    // Constraint validation: If an element has a datalist element ancestor,
    // it is barred from constraint validation.
    return this.type === "submit" && closest(this, "datalist") === null;
  }
}

mixin(HTMLButtonElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLButtonElementImpl
};
