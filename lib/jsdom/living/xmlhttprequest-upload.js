"use strict";

module.exports = function (core) {
  const XMLHttpRequestEventTarget = core.XMLHttpRequestEventTarget;

  class XMLHttpRequestUpload extends XMLHttpRequestEventTarget {
    constructor() {
      super();
      if (!new.target) {
        throw new TypeError("DOM object constructor cannot be called as a function.");
      }
    }
  }
  Object.defineProperty(XMLHttpRequestUpload.prototype, Symbol.toStringTag, {
    value: "XMLHttpRequestUpload",
    writable: false,
    enumerable: false,
    configurable: true
  });

  core.XMLHttpRequestUpload = XMLHttpRequestUpload;
};

