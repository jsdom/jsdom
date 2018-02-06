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

  get willValidate() {
    return false;
  }

  get validity() {
    if (!this._validity) {
      this._validity = ValidityState.createImpl(this);
    }
    return this._validity;
  }

  checkValidity() {
    if (!this.willValidate) {
      return true;
    }
    const { validity } = this;
    if (!validity.valid) {
      this.dispatchEvent(Event.createImpl(["invalid", { cancelable: false }]));
    }
    return validity.valid;
  }

  setCustomValidity(message) {
    this._customErrorMessage = message;
  }

  reportValidity() {
    return this.checkValidity();
  }

  get validationMessage() {
    let message = "";
    const { validity } = this;
    if (!validity.valid) {
      if (validity.customError) {
        message = this._customErrorMessage;
      } else {
        message = "Constraints not satisfied";
      }
    }
    return message;
  }
};
