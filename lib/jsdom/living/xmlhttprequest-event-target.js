"use strict";

const EventTarget = require("./generated/EventTarget");

function XMLHttpRequestEventTarget() {
  if (!new.target) {
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
Object.defineProperty(XMLHttpRequestEventTarget.prototype, Symbol.toStringTag, {
  value: "XMLHttpRequestEventTarget",
  writable: false,
  enumerable: false,
  configurable: true
});

module.exports = function (core) {
  core.XMLHttpRequestEventTarget = XMLHttpRequestEventTarget;
};
