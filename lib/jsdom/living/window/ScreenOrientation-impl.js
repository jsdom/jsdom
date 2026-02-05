"use strict";

// https://w3c.github.io/screen-orientation/#screenorientation-interface
const EventTargetImpl = require("../events/EventTarget-impl").implementation;

class ScreenOrientationImpl extends EventTargetImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject);
    this._type = "landscape-primary";
    this._angle = 0;
  }

  get type() {
    return this._type;
  }

  get angle() {
    return this._angle;
  }

  lock(orientation) {
    return Promise.resolve(undefined);
  }

  unlock() {
    // No-op in jsdom; screen orientation cannot actually change.
  }
}

exports.implementation = ScreenOrientationImpl;
