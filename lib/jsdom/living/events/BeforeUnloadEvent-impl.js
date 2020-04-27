"use strict";

const EventImpl = require("./Event-impl.js").implementation;

exports.implementation = class BeforeUnloadEventImpl extends EventImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    // We can't use `this.returnValue = ""`, as that would invoke the setter in `EventImpl`
    Object.defineProperty(this, "returnValue", {
      configurable: true,
      enumerable: true,
      writable: true,
      value: ""
    });
  }
};
