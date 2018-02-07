"use strict";

const ValidityState = require("../generated/ValidityState");
const Event = require("../generated/Event");

exports.implementation = class DefaultConstraintValidationImpl {
  get _customValidityErrorMessage() {
    if (typeof this._customErrorMessage !== "string") {
      return "";
    }
    return this._customErrorMessage;
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-willvalidate
  get willValidate() {
    return false;
  }

  get validity() {
    if (!this._validity) {
      this._validity = ValidityState.createImpl(this);
    }
    return this._validity;
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-checkvalidity
  checkValidity() {
    if (!this.willValidate) {
      return true;
    }
    const { validity } = this;
    if (!validity.valid) {
      this.dispatchEvent(Event.createImpl(["invalid", { cancelable: true }]));
    }
    return validity.valid;
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-setcustomvalidity
  setCustomValidity(message) {
    this._customErrorMessage = message;
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-reportvalidity
  // Since jsdom has no user interaction, it's the same as #checkValidity
  reportValidity() {
    return this.checkValidity();
  }

  // https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#dom-cva-validationmessage
  get validationMessage() {
    const { validity } = this;
    if (!this.willValidate || validity.valid) {
      return "";
    }
    if (validity.customError) {
      return this._customErrorMessage;
    }
    return "Constraints not satisfied";
  }
};
