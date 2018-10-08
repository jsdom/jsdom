"use strict";
const HTMLCollection = require("../generated/HTMLCollection");
const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const { formOwner } = require("../helpers/form-controls");
const { mixin } = require("../../utils");
const { descendantsByHTMLLocalNames } = require("../helpers/traversal");

const listedElements = new Set(["button", "fieldset", "input", "object", "output", "select", "textarea"]);

class HTMLFieldSetElementImpl extends HTMLElementImpl {
  get elements() {
    return HTMLCollection.createImpl([], {
      element: this,
      query: () => descendantsByHTMLLocalNames(this, listedElements)
    });
  }

  get form() {
    return formOwner(this);
  }

  get type() {
    return "fieldset";
  }

  _barredFromConstraintValidationSpecialization() {
    return true;
  }
}

mixin(HTMLFieldSetElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLFieldSetElementImpl
};
