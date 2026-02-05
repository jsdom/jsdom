"use strict";

// https://w3c.github.io/screen-orientation/#screenorientation-interface
const EventTargetImpl = require("../events/EventTarget-impl").implementation;

class ScreenOrientationImpl extends EventTargetImpl {
  // eslint-disable-next-line no-unused-vars -- signature required by generated wrapper
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

  // eslint-disable-next-line no-unused-vars -- argument validated by generated code
  lock(orientation) {
    // Always resolves; jsdom cannot change screen orientation.
    // Use globalObject.Promise so the returned Promise is from the window's realm (required for instanceof in tests).
    return this._globalObject.Promise.resolve(undefined);
  }

  unlock() {
    // No-op in jsdom; screen orientation cannot actually change.
  }
}

exports.implementation = ScreenOrientationImpl;
