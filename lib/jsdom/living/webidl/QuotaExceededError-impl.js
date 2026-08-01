"use strict";

const DOMException = require("./DOMException-impl");
const DOMExceptionImpl = DOMException.implementation;

exports.implementation = class QuotaExceededErrorImpl extends DOMExceptionImpl {
  constructor(globalObject, [message, { quota, requested }]) {
    super(globalObject, [message, "QuotaExceededError"]);

    this.quota = null;
    this.requested = null;

    if (quota !== undefined) {
      if (quota < 0) {
        throw new globalObject.RangeError("quota must be non-negative");
      }
      this.quota = quota;
    }

    if (requested !== undefined) {
      if (requested < 0) {
        throw new globalObject.RangeError("requested must be non-negative");
      }
      this.requested = requested;
    }

    if (this.quota !== null && this.requested !== null && this.requested < this.quota) {
      throw new globalObject.RangeError("requested must be greater than or equal to quota");
    }
  }
};

exports.init = DOMException.init;
