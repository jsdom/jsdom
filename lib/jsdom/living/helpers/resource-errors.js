"use strict";

exports.reportResourceError = (element, url, cause) => {
  const error = new Error(`Could not load ${element.localName}: "${url}"`, { cause });
  error.type = "resource-loading";
  error.url = url;
  element._globalObject._virtualConsole.emit("jsdomError", error);
};
