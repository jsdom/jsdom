"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const { mixin } = require("../../utils");
const { getLabelsForLabelable } = require("../helpers/form-controls");

class HTMLOutputElementImpl extends HTMLElementImpl {
  _barredFromConstraintValidationSpecialization() {
    return true;
  }

  get labels() {
    return getLabelsForLabelable(this);
  }
}

mixin(HTMLOutputElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLOutputElementImpl
};
