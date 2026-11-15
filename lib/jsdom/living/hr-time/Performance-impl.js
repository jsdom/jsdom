"use strict";

const EventTargetImpl = require("../events/EventTarget-impl").implementation;

// https://w3c.github.io/hr-time/#dfn-coarsen-time
// jsdom has no cross-origin isolation, so the resolution is always 100 microseconds (0.1 ms). Moments are milliseconds
// since the Unix epoch, and are coarsened to a whole number of 100 microsecond units. Subtracting those integers and
// then dividing gives exact decimals instead of floats like 6.4000000000000004.
function coarsenTime(unsafeMoment) {
  return Math.floor(unsafeMoment * 10);
}

class PerformanceImpl extends EventTargetImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._coarsenedTimeOrigin = coarsenTime(privateData.timeOrigin);
    this.timeOrigin = this._coarsenedTimeOrigin / 10;
  }

  // https://w3c.github.io/hr-time/#dfn-relative-high-resolution-time
  now() {
    const coarsenedNow = coarsenTime(performance.timeOrigin + performance.now());
    return (coarsenedNow - this._coarsenedTimeOrigin) / 10;
  }
}

exports.implementation = PerformanceImpl;
