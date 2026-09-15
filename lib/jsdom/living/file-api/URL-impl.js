"use strict";
const idlUtils = require("../../../generated/idl/utils");
const { addEntry, revokeEntry } = require("./blob-url-store");

exports.implementation = class URLImpl {
  static createObjectURL(globalObject, object) {
    // window.close(), including iframe removal, destroys the URL's creating environment. Match Chromium's
    // PublicURLManager by making methods saved from that environment inactive.
    if (globalObject._document === undefined) {
      return "";
    }
    return addEntry(object, idlUtils.implForWrapper(globalObject._document));
  }

  static revokeObjectURL(globalObject, url) {
    if (globalObject._document === undefined) {
      return;
    }
    revokeEntry(url, idlUtils.implForWrapper(globalObject._document));
  }
};
