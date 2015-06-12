"use strict";
const isValidTargetOrigin = require("../utils").isValidTargetOrigin;
const DOMException = require("../web-idl/DOMException");

module.exports = function (message, targetOrigin) {
  const window = this;

  if (arguments.length < 2) {
    throw new TypeError("'postMessage' requires 2 arguments: 'message' and 'targetOrigin'");
  }

  targetOrigin = String(targetOrigin);

  if (!isValidTargetOrigin(targetOrigin)) {
    throw new DOMException(DOMException.SYNTAX_ERR, "Failed to execute 'postMessage' on 'Window': " +
      "Invalid target origin '" + targetOrigin + "' in a call to 'postMessage'.");
  }

  // TODO: I think we need to get the origin to set event.origin and do "/" checking

  if (targetOrigin !== "*" && targetOrigin !== window.origin) {
    return;
  }

  const event = window.document.createEvent("MessageEvent");
  event.initEvent("message", false, false);

  // TODO: Structured clone message
  event.data = message;
  window.dispatchEvent(event);
};
