"use strict";

const MouseEventImpl = require("./MouseEvent-impl").implementation;

class WheelEventImpl extends MouseEventImpl {}

module.exports = {
  implementation: WheelEventImpl
};
