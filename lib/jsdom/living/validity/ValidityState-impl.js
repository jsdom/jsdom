"use strict";

exports.implementation = class ValidityStateImpl {

    get badInput() {
        return this._state.badInput();
    }
    
    get customError() {
        return this._state.customError();
    }

    get patternMismatch() {
        return this._state.patternMismatch();
    }

    get rangeOverflow() {
        return this._state.rangeOverflow();
    }

    get rangeUnderflow() {
        return this._state.rangeUnderflow();

    }
    get stepMismatch() {
        return this._state.stepMismatch();
    }

    get tooLong() {
        return this._state.tooLong();
    }

    get tooShort() {
        return this._state.tooShort();
    }

    get typeMismatch() {
        return this._state.typeMismatch();
    }

    get valueMissing() {
        return this._state.valueMissing();
    }

    constructor(state) {
        this._state = state;
    }

    get valid() {
        return !(this.badInput && this.valueMissing && this.customError &&
            this.patternMismatch && this.rangeOverflow && this.rangeUnderflow &&
            this.stepMismatch && this.tooLong && this.tooShort && this.typeMismatch)
    }

};
