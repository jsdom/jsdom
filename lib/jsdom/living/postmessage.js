"use strict";
const isValidTargetOrigin = require("../utils").isValidTargetOrigin;

module.exports = function (message, targetOrigin) {
  // TODO: Add checking that 'this' is a Window?
  let window = this;
  let event;

  if (!targetOrigin) {
    // TODO: Make sure error message is correct
    throw new TypeError(`'postMessage' requires a second argument 'targetOrigin'`); 
  }

  if (!isValidTargetOrigin(targetOrigin)) {
    // TODO: Make sure error message is correct
    throw new SyntaxError(`Failed to execute 'postMessage' on 'Window': Invalid target origin '${targetOrigin}' in a call to 'postMessage'.`); 
  }

  // TODO: Investigate what "/" means and possibly add it
  if (targetOrigin !== "*" && targetOrigin !== window.origin) {
    return;
  }

  event = window.document.createEvent("MessageEvent");
  event.initEvent("message", false, false);
  event.data = message;
  window.dispatchEvent(event);
};
