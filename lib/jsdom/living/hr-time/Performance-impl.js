"use strict";

const EventTargetImpl = require("../events/EventTarget-impl").implementation;

// https://w3c.github.io/hr-time/#dfn-coarsen-time
// jsdom has no cross-origin isolation, so the resolution is always 100 microseconds (0.1 ms). Dividing by the
// reciprocal keeps the result an exact decimal instead of a float like 6.4000000000000004.
function coarsenTime(timestamp) {
  return Math.floor(timestamp * 10) / 10;
}

class PerformanceImpl extends EventTargetImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this.timeOrigin = coarsenTime(privateData.timeOrigin);
    this._nowAtTimeOrigin = privateData.nowAtTimeOrigin;
  }

  now() {
    return coarsenTime(performance.now() - this._nowAtTimeOrigin);
  }

  toJSON() {
    return { timeOrigin: this.timeOrigin };
  }
}

exports.implementation = PerformanceImpl;
