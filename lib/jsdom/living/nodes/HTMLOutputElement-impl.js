"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const { mixin } = require("../../utils");
const { getLabelsForLabelable, formOwner } = require("../helpers/form-controls");
const { childTextContent } = require("../helpers/text");

class HTMLOutputElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    this._labels = null;
  }

  _barredFromConstraintValidationSpecialization() {
    return true;
  }

  get labels() {
    return getLabelsForLabelable(this);
  }

  get form() {
    return formOwner(this);
  }

  get defaultValue() {
    return childTextContent(this);
  }

  set defaultValue(val) {
    this.textContent = val;
  }
}

mixin(HTMLOutputElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLOutputElementImpl
};
