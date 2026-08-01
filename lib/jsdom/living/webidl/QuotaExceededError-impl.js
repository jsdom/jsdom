"use strict";

const DOMException = require("./DOMException-impl");
const DOMExceptionImpl = DOMException.implementation;

exports.implementation = class QuotaExceededErrorImpl extends DOMExceptionImpl {
  constructor(globalObject, [message, options]) {
    super(globalObject, [message, "QuotaExceededError"]);

    const { quota, requested } = options;

    if (quota !== undefined && quota < 0) {
      throw new globalObject.RangeError("quota must be non-negative");
    }
    if (requested !== undefined && requested < 0) {
      throw new globalObject.RangeError("requested must be non-negative");
    }
    if (quota !== undefined && requested !== undefined && requested < quota) {
      throw new globalObject.RangeError("requested must be greater than or equal to quota");
    }

    this.quota = quota === undefined ? null : quota;
    this.requested = requested === undefined ? null : requested;
  }
};

exports.init = DOMException.init;
