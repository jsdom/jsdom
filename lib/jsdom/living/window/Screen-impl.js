"use strict";

// https://drafts.csswg.org/cssom-view-1/#the-screen-interface
const ScreenOrientation = require("../generated/ScreenOrientation");

class ScreenImpl {
  // eslint-disable-next-line no-unused-vars -- signature required by generated wrapper
  constructor(globalObject, constructorArgs, privateData) {
    this._globalObject = globalObject;
    this._orientation = null;
  }

  get orientation() {
    if (this._orientation === null) {
      this._orientation = ScreenOrientation.createImpl(this._globalObject, [], {});
    }
    return this._orientation;
  }
}

ScreenImpl.prototype.availWidth = 0;
ScreenImpl.prototype.availHeight = 0;
ScreenImpl.prototype.width = 0;
ScreenImpl.prototype.height = 0;
ScreenImpl.prototype.colorDepth = 24;
ScreenImpl.prototype.pixelDepth = 24;

exports.implementation = ScreenImpl;
