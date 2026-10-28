"use strict";
const { screen } = require("./environment");

// https://drafts.csswg.org/cssom-view-1/#the-screen-interface
class ScreenImpl {}

ScreenImpl.prototype.availWidth = screen.availWidth;
ScreenImpl.prototype.availHeight = screen.availHeight;
ScreenImpl.prototype.width = screen.width;
ScreenImpl.prototype.height = screen.height;
ScreenImpl.prototype.colorDepth = screen.colorDepth;
ScreenImpl.prototype.pixelDepth = screen.pixelDepth;

exports.implementation = ScreenImpl;
