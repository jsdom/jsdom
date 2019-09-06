"use strict";
const DOMException = require("domexception");
const MessageEvent = require("./generated/MessageEvent");
const { isValidTargetOrigin } = require("../utils");
const { fireAnEvent } = require("./helpers/events");
const url = require("url");

module.exports = function (message, targetOrigin) {
  if (arguments.length < 2) {
    throw new TypeError("'postMessage' requires 2 arguments: 'message' and 'targetOrigin'");
  }

  targetOrigin = String(targetOrigin);

  if (!isValidTargetOrigin(targetOrigin)) {
    throw new DOMException("Failed to execute 'postMessage' on 'Window': " +
      "Invalid target origin '" + targetOrigin + "' in a call to 'postMessage'.", "SyntaxError");
  }

  // TODO: targetOrigin === '/' - requires reference to source window
  // See https://github.com/tmpvar/jsdom/pull/1140#issuecomment-111587499
  if (targetOrigin !== "*" && targetOrigin !== this.location.origin) {
    return;
  }

  // Get call stack from Error object, so we can know which file (uri) invoked this method
  const stack = new Error().stack.split("\n");
  const prevStack = stack[2];

  let sourceOrigin = this.location.origin;

  // grab the filename part from stack trace and the hostname should be the origin
  if (prevStack) {
    const match = prevStack.match(/\((https?|file|javascript):\/\/.+\)$/);

    if (match) {
      const parsedUrl = url.parse(match[0].replace(/^\(/, ""));
      sourceOrigin = `${parsedUrl.protocol}//${parsedUrl.host}`;
    }
  }

  // TODO: event.source - requires reference to source window
  // TODO: event.ports
  // TODO: event.data - structured clone message - requires cloning DOM nodes
  setTimeout(() => {
    fireAnEvent("message", this, MessageEvent, { data: message, origin: sourceOrigin });
  }, 0);
};
