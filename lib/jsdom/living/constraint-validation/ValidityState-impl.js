"use strict";

exports.implementation = class ValidityStateImpl {
  constructor(state = {}) {
    this._state = state;
  }

  get badInput() {
    return this._failsConstraint("badInput");
  }

  get customError() {
    return this._failsConstraint("customError");
  }

  get patternMismatch() {
    return this._failsConstraint("patternMismatch");
  }

  get rangeOverflow() {
    return this._failsConstraint("rangeOverflow");
  }

  get rangeUnderflow() {
    return this._failsConstraint("rangeUnderflow");
  }

  get stepMismatch() {
    return this._failsConstraint("stepMismatch");
  }

  get tooLong() {
    return this._failsConstraint("tooLong");
  }

  get tooShort() {
    return this._failsConstraint("tooShort");
  }

  get typeMismatch() {
    return this._failsConstraint("typeMismatch");
  }

  get valueMissing() {
    return this._failsConstraint("valueMissing");
  }

  _failsConstraint(method) {
    const validationMethod = this._state[method];
    if (validationMethod) {
      if (this._state.willValidate) {
        return this._state.willValidate() && validationMethod();
      }
      return validationMethod();
    }

    return false;
  }

  get valid() {
    return !(this.badInput || this.valueMissing || this.customError ||
            this.patternMismatch || this.rangeOverflow || this.rangeUnderflow ||
            this.stepMismatch || this.tooLong || this.tooShort || this.typeMismatch);
  }
};
