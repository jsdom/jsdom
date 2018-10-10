"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const DefaultConstraintValidationImpl =
  require("../constraint-validation/DefaultConstraintValidation-impl").implementation;
const { mixin } = require("../../utils");
const { getLabelsForLabelable, formOwner } = require("../helpers/form-controls");

class HTMLOutputElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);
    this._labels = null;
    this._defaultValue = null;
    this._valueMode = "default";
  }

  _barredFromConstraintValidationSpecialization() {
    return true;
  }

  _formReset() {
    if (this._valueMode === "value") {
      this.textContent = this._defaultValue;
    }

    this._valueMode = "default";
  }

  get type() {
    return "output";
  }

  get labels() {
    return getLabelsForLabelable(this);
  }

  get form() {
    return formOwner(this);
  }

  get value() {
    return this.textContent;
  }

  set value(val) {
    this._valueMode = "value";
    this._defaultValue = this.textContent;
    this.textContent = val;
  }

  get defaultValue() {
    return this._valueMode === "default" ? this.textContent : this._defaultValue;
  }

  set defaultValue(val) {
    this._defaultValue = val;

    if (this._valueMode === "default") {
      this.textContent = val;
    }
  }
}

mixin(HTMLOutputElementImpl.prototype, DefaultConstraintValidationImpl.prototype);

module.exports = {
  implementation: HTMLOutputElementImpl
};
