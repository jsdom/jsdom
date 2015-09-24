"use strict";

var EventTarget = require("../../living/generated/events/EventTarget");

function XMLHttpRequestEventTarget() {
  if (!(this instanceof XMLHttpRequestEventTarget)) {
    throw new TypeError("DOM object constructor cannot be called as a function.");
  }
  EventTarget.setup(this);
}

XMLHttpRequestEventTarget.prototype = Object.create(EventTarget.interface.prototype);

module.exports = XMLHttpRequestEventTarget;
