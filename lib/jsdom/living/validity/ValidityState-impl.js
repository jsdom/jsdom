"use strict";

exports.implementation = class ValidityStateImpl {
  get badInput() {
    return this.hasErrors("badInput");
  }

  get customError() {
    return this.hasErrors("customError");
  }

  get patternMismatch() {
    return this.hasErrors("patternMismatch");
  }

  get rangeOverflow() {
    return this.hasErrors("rangeOverflow");
  }

  get rangeUnderflow() {
    return this.hasErrors("rangeUnderflow");
  }

  get stepMismatch() {
    return this.hasErrors("stepMismatch");
  }

  get tooLong() {
    return this.hasErrors("tooLong");
  }

  get tooShort() {
    return this.hasErrors("tooShort");
  }

  get typeMismatch() {
    return this.hasErrors("typeMismatch");
  }

  get valueMissing() {
    return this.hasErrors("valueMissing");
  }

  hasErrors(method) {
    const validationMethod = this._state[method];
      if (validationMethod) {
          if (this._state.willValidate) {
            return this._state.willValidate() && validationMethod();
          } else {
            return validationMethod();  
        }
    }

    return false;  
  }

  constructor(state) {
    this._state = state;
  }

  get valid() {
    return !(this.badInput || this.valueMissing || this.customError ||
            this.patternMismatch || this.rangeOverflow || this.rangeUnderflow ||
            this.stepMismatch || this.tooLong || this.tooShort || this.typeMismatch);
  }
};
