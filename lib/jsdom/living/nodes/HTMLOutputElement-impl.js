"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const { mixin } = require("../../utils");

class HTMLOutputElementImpl extends HTMLElementImpl {
  _barredFromConstraintValidationSpecialization() {
    return true;
  }
}

mixin(HTMLOutputElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLOutputElementImpl
};
