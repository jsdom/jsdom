"use strict";

// https://drafts.csswg.org/cssom-view-1/#the-screen-interface
const ScreenOrientation = require("../generated/ScreenOrientation");

class ScreenImpl {
  constructor(globalObject, constructorArgs, privateData) {
    this.orientation = ScreenOrientation.createImpl(globalObject, [], {});
  }
}

ScreenImpl.prototype.availWidth = 0;
ScreenImpl.prototype.availHeight = 0;
ScreenImpl.prototype.width = 0;
ScreenImpl.prototype.height = 0;
ScreenImpl.prototype.colorDepth = 24;
ScreenImpl.prototype.pixelDepth = 24;

exports.implementation = ScreenImpl;
