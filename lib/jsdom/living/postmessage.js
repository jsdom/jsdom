"use strict";
const isValidTargetOrigin = require("../utils").isValidTargetOrigin;

module.exports = function (message, targetOrigin) {
  let window, event;

  if (!targetOrigin) {
    // TODO: Make sure error message is correct
    throw new TypeError(`'postMessage' requires a second argument 'targetOrigin'`); 
  }

  if (!isValidTargetOrigin(targetOrigin)) {
    // TODO: Make sure error message is correct
    throw new SyntaxError(`Failed to execute 'postMessage' on 'Window': Invalid target origin '${targetOrigin}' in a call to 'postMessage'.`); 
  }

  if (this._contentDocument) {
    // Inside iframe
    window = this._contentDocument.defaultView;
  } else {
    // Root window
    window = this;
  }

  event = window.document.createEvent("MessageEvent");
  event.initEvent("message", false, false);
  event.data = message;
  window.dispatchEvent(event);
};
