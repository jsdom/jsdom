"use strict";
const isValidTargetOrigin = require("../utils").isValidTargetOrigin;

module.exports = function (message, targetOrigin) {
  let window = this;
  let event;

  if (!targetOrigin) {
    throw new TypeError("'postMessage' requires a second argument 'targetOrigin'");
  }

  if (!isValidTargetOrigin(targetOrigin)) {
    throw new SyntaxError("Failed to execute 'postMessage' on 'Window': " +
      "Invalid target origin '" + targetOrigin + "' in a call to 'postMessage'.");
  }

  if (targetOrigin !== "*" && targetOrigin !== window.origin) {
    return;
  }

  event = window.document.createEvent("MessageEvent");
  event.initEvent("message", false, false);
  event.data = message;
  window.dispatchEvent(event);
};
