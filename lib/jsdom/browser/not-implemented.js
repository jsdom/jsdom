"use strict";

module.exports = notImplemented;

class NotImplementedError extends Error {
  constructor(nameForErrorMessage) {
    super(`Not implemented: ${nameForErrorMessage}`);

    this.nameForErrorMessage = nameForErrorMessage;
  }

  get name() {
    return this.constructor.name;
  }

  get type() {
    return "not implemented";
  }
}

module.exports.NotImplementedError = NotImplementedError;

class NotImplementedMethodError extends NotImplementedError {
  constructor(qualifiedMethodName, ...callingArguments) {
    super(qualifiedMethodName);

    this.qualifiedMethodName = qualifiedMethodName;
    this.callingArguments = callingArguments;
  }
}

module.exports.NotImplementedMethodError = NotImplementedMethodError;

class NotImplementedWindowMethodError extends NotImplementedMethodError {
  constructor(methodName, ...callingArguments) {
    super(`window.${methodName}`, ...callingArguments);

    this.methodName = methodName;
  }
}

module.exports.NotImplementedWindowMethodError = NotImplementedWindowMethodError;

class NotImplementedNodeMethodError extends NotImplementedMethodError {
  constructor(nodeName, methodName, targetNode, ...callingArguments) {
    super(`HTML${nodeName[0].toUpperCase() + nodeName.slice(1)}Element.${methodName}`, ...callingArguments);

    this.nodeName = nodeName;
    this.methodName = methodName;
    this.targetNode = targetNode;
  }
}

module.exports.NotImplementedNodeMethodError = NotImplementedNodeMethodError;

class NotImplementedCanvasElementMethodError extends NotImplementedNodeMethodError {
  constructor(methodName, node, ...callingArguments) {
    super("canvas", methodName, node, ...callingArguments);
  }

  get message() {
    return super.message + " (without installing the canvas npm package)";
  }
}

module.exports.NotImplementedCanvasElementMethodError = NotImplementedCanvasElementMethodError;

class NotImplementedFormElementMethodError extends NotImplementedNodeMethodError {
  constructor(methodName, node, ...callingArguments) {
    super("form", methodName, node, ...callingArguments);
  }
}

module.exports.NotImplementedFormElementMethodError = NotImplementedFormElementMethodError;

class NotImplementedMediaElementMethodError extends NotImplementedNodeMethodError {
  constructor(methodName, node, ...callingArguments) {
    super("media", methodName, node, ...callingArguments);
  }
}

module.exports.NotImplementedMediaElementMethodError = NotImplementedMediaElementMethodError;

class NotImplementedNavigationError extends NotImplementedError {
  constructor(message, newURL, flags) {
    super(message);

    this.newURL = newURL;
    this.flags = flags;
  }
}

module.exports.NotImplementedNavigationError = NotImplementedNavigationError;

class NotImplementedJSResultNavigationError extends NotImplementedNavigationError {
  constructor(result, newURL, flags) {
    super("string results from 'javascript:' URLs", newURL, flags);

    this.jsResult = result;
  }
}

module.exports.NotImplementedJSResultNavigationError = NotImplementedJSResultNavigationError;

class NotImplementedFetchNavigationError extends NotImplementedNavigationError {
  constructor(newURL, flags) {
    super("navigation (except hash changes)", newURL, flags);
  }
}

module.exports.NotImplementedFetchNavigationError = NotImplementedFetchNavigationError;

class NotImplementedSessionHistoryTraversalError extends NotImplementedError {
  constructor(message, specifiedEntry, currentEntry) {
    super(message);

    this.specifiedEntry = specifiedEntry;
    this.currentEntry = currentEntry;
  }
}

module.exports.NotImplementedSessionHistoryTraversalError = NotImplementedSessionHistoryTraversalError;

function notImplemented(nameOrError, window) {
  if (!window) {
    // Do nothing for window-less documents.methodName
    return;
  }

  let error;
  if (typeof nameOrError === "string") {
    error = new NotImplementedError(nameOrError);
  } else if (nameOrError instanceof NotImplementedError) {
    error = nameOrError;
  } else {
    window._virtualConsole.emit("jsdomError", new Error("Unexpected error class"));
    error = nameOrError;
  }

  window._virtualConsole.emit("jsdomError", error);
}
