"use strict";

exports.implementation = class ValidityStateImpl {
  get badInput() {
      return this.validate("badInput");
  }

  get customError() {
    return this.validate("customError");
  }

  get patternMismatch() {
    return this.validate("patternMismatch");
  }

  get rangeOverflow() {
    return this.validate("rangeOverflow");
  }

  get rangeUnderflow() {
    return this.validate("rangeUnderflow");
  }

  get stepMismatch() {
    return this.validate("stepMismatch");
  }

  get tooLong() {
    return this.validate("tooLong");
  }

  get tooShort() {
    return this.validate("tooShort");
  }

  get typeMismatch() {
    return this.validate("typeMismatch");
  }

  get valueMissing() {
    return this.validate("valueMissing");
  }
  
  validate(method) {
    return this._state.willValidate() && this._state[method]();
  }  

  constructor(state) {
    this._state = state;
  }

  get valid() {
    return !(this.badInput || this.valueMissing || this.customError ||
            this.patternMismatch || this.rangeOverflow || this.rangeUnderflow &&
            this.stepMismatch || this.tooLong || this.tooShort || this.typeMismatch);
  }
};
