"use strict";

const EventTarget = require("./generated/events/EventTarget");

function XMLHttpRequestEventTarget() {
  if (!(this instanceof XMLHttpRequestEventTarget)) {
    throw new TypeError("DOM object constructor cannot be called as a function.");
  }
  EventTarget.setup(this);
  this.onabort = null;
  this.onerror = null;
  this.onload = null;
  this.onloadend = null;
  this.onloadstart = null;
  this.onprogress = null;
  this.ontimeout = null;
}

XMLHttpRequestEventTarget.prototype = Object.create(EventTarget.interface.prototype);

module.exports = function (core) {
  core.XMLHttpRequestEventTarget = XMLHttpRequestEventTarget;
};
