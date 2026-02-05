"use strict";

// https://w3c.github.io/screen-orientation/#screenorientation-interface
const Event = require("../generated/Event");
const EventTargetImpl = require("../events/EventTarget-impl").implementation;
const { createAnEvent } = require("../helpers/events");
const idlUtils = require("../generated/utils");

class ScreenOrientationImpl extends EventTargetImpl {
  // eslint-disable-next-line no-unused-vars -- signature required by generated wrapper
  constructor(globalObject, args, privateData) {
    super(globalObject);
    this._type = "landscape-primary";
    this._angle = 0;
    this._onchange = null;
  }

  get onchange() {
    return this._onchange;
  }

  set onchange(handler) {
    this._onchange = handler;
  }

  get type() {
    return this._type;
  }

  get angle() {
    return this._angle;
  }

  _fireChangeEvent() {
    const event = createAnEvent("change", this._globalObject, Event, {});
    this._dispatch(event);
    const wrapper = idlUtils.wrapperForImpl(this);
    if (wrapper && typeof this._onchange === "function") {
      this._onchange.call(wrapper, event);
    }
  }

  // eslint-disable-next-line no-unused-vars -- argument validated by generated code
  lock(orientation) {
    // Always resolves; jsdom cannot change screen orientation.
    // Use globalObject.Promise so the returned Promise is from the window's realm (required for instanceof in tests).
    const promise = this._globalObject.Promise.resolve(undefined);
    if (typeof this._globalObject.queueMicrotask === "function") {
      this._globalObject.queueMicrotask(() => this._fireChangeEvent());
    } else {
      this._fireChangeEvent();
    }
    return promise;
  }

  unlock() {
    // No-op in jsdom; screen orientation cannot actually change.
    this._fireChangeEvent();
  }
}

exports.implementation = ScreenOrientationImpl;
