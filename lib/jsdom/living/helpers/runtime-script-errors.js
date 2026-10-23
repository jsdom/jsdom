"use strict";
const util = require("node:util");
const idlUtils = require("../../../generated/idl/utils");
const ErrorEvent = require("../../../generated/idl/ErrorEvent");
const { createAnEvent } = require("../helpers/events");

const errorReportingMode = Symbol("error reporting mode");

// https://html.spec.whatwg.org/multipage/webappapis.html#report-the-error
// Omits script parameter and any check for muted errors.
// Takes target as an EventTarget impl.
// Takes error object, message, and location as params, unlike the spec.
// Returns whether the event was handled or not.
function reportAnError(line, col, target, errorObject, message, location) {
  if (target[errorReportingMode]) {
    return false;
  }

  target[errorReportingMode] = true;

  if (typeof message !== "string") {
    message = "uncaught exception: " + util.inspect(errorObject);
  }

  const event = createAnEvent("error", target._globalObject, ErrorEvent, {
    cancelable: true,
    message,
    filename: location,
    lineno: line,
    colno: col,
    error: errorObject
  });

  try {
    target._dispatch(event);
  } finally {
    target[errorReportingMode] = false;
    return event.defaultPrevented;
  }
}

function reportException(window, error, filenameHint) {
  // This function will give good results on real Error objects with stacks; poor ones otherwise

  const stack = error && error.stack;
  reportExceptionWithLocation(window, error, {
    stack,
    message: error && error.message,
    displayAsError: () => shouldBeDisplayedAsError(error),
    filenameHint
  });
}

// https://html.spec.whatwg.org/multipage/webappapis.html#dom-reporterror
// Unlike reportException(), this must not invoke getters on the reported value, so the location comes from the
// caller's stack and the message from the value only when it is a native error.
function reportError(window, error, callerStack) {
  const isNativeError = util.types.isNativeError(error);
  reportExceptionWithLocation(window, error, {
    stack: callerStack,
    // Fall back to the name so that errors without a message, like `new TypeError()`, still get a non-empty one.
    message: isNativeError ? error.message || String(error.name) : undefined,
    displayAsError: () => isNativeError && shouldBeDisplayedAsError(error)
  });
}

function reportExceptionWithLocation(window, error, { stack, message, displayAsError, filenameHint }) {
  const lines = stack && stack.split("\n");

  // Find the first line that matches; important for multi-line messages
  let pieces;
  if (lines) {
    for (let i = 1; i < lines.length && !pieces; ++i) {
      pieces = lines[i].match(/at (?:(.+)\s+)?\(?(?:(.+?):(\d+):(\d+)|([^)]+))\)?/);
    }
  }

  const fileName = (pieces && pieces[2]) || filenameHint || window._document.URL;
  const lineNumber = (pieces && parseInt(pieces[3], 10)) || 0;
  const columnNumber = (pieces && parseInt(pieces[4], 10)) || 0;

  const windowImpl = idlUtils.implForWrapper(window);

  const handled = reportAnError(lineNumber, columnNumber, windowImpl, error, message, fileName);

  if (!handled) {
    const errorString = displayAsError() ? `[${error.name}: ${error.message}]` : util.inspect(error);
    const jsdomError = new Error(`Uncaught ${errorString}`, { cause: error });
    jsdomError.type = "unhandled-exception";

    window._settings.virtualConsole.emit("jsdomError", jsdomError);
  }
}

function shouldBeDisplayedAsError(x) {
  return x && x.name && x.message !== undefined && x.stack;
}

module.exports = reportException;
module.exports.reportError = reportError;
