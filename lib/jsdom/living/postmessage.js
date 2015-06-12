"use strict";
const isValidTargetOrigin = require("../utils").isValidTargetOrigin;
const DOMException = require("../web-idl/DOMException");
const messageEventFactory = require("./messageevent");
const core = require("../level1/core");

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

  // TODO: targetOrigin === '/' - requires reference to source window
  if (targetOrigin !== "*" && targetOrigin !== window.origin) {
    return;
  }

  const MessageEvent = messageEventFactory(core);

  // TODO: event.source - requires reference to source window
  // TODO: event.origin - requires reference to source window
  // TODO: event.ports
  // TODO: event.data - structured clone message - requires cloning DOM nodes
  const event = new MessageEvent("message", {
    data: message
  });

  event.initEvent("message", false, false);

  setImmediate(function () {
    window.dispatchEvent(event);
  });
};
