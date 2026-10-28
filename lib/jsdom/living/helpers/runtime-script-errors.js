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

  if (typeof message !== "string") {
    message = "uncaught exception: " + inspect(errorObject);
  }

  target[errorReportingMode] = true;

  const event = createAnEvent("error", target._globalObject, ErrorEvent, {
    cancelable: true,
    message,
    filename: location,
    lineno: line,
    colno: col,
    error: errorObject,
  });

  try {
    target._dispatch(event);
  } finally {
    target[errorReportingMode] = false;
    return event.defaultPrevented;
  }
}

// This gives good results on real Error objects with stacks; poor ones otherwise.
// reportError() passes callerStack: the location then comes from the caller's stack, and the value's properties are
// only read when it is a native error, since https://html.spec.whatwg.org/#dom-reporterror must not run its getters.
function reportException(window, error, filenameHint, callerStack) {
  const readProperties = callerStack === undefined || util.types.isNativeError(error);
  const name = readProperties ? get(error, "name") : undefined;
  let message = readProperties ? get(error, "message") : undefined;
  const ownStack = readProperties ? get(error, "stack") : undefined;
  const stack = callerStack ?? ownStack;

  // reportError() events need a non-empty message, including for errors without one, like `new TypeError()`.
  if (callerStack !== undefined && message === "" && typeof name === "string") {
    message = name;
  }

  const lines = typeof stack === "string" && stack.split("\n");

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
    const displayAsError =
      typeof name === "string" && name && typeof message === "string" && ownStack;
    const errorString = displayAsError ? `[${name}: ${message}]` : inspect(error);
    const jsdomError = new Error(`Uncaught ${errorString}`, { cause: error });
    jsdomError.type = "unhandled-exception";

    window._settings.virtualConsole.emit("jsdomError", jsdomError);
  }
}

// Getters and Node.js custom inspection on the reported value are page code, so they can throw. Reporting must still
// happen in that case.
function get(value, key) {
  try {
    return value?.[key];
  } catch {
    return undefined;
  }
}

function inspect(value) {
  try {
    return util.inspect(value);
  } catch {
    try {
      return util.inspect(value, { customInspect: false });
    } catch {
      return `[${typeof value}]`;
    }
  }
}

module.exports = reportException;
