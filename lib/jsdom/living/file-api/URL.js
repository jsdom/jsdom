"use strict";
const { URL } = require("whatwg-url/webidl2js-wrapper");
const ObjectURL = require("../../../generated/idl/URL");

// Generate the File API additions with jsdom's Blob bindings, while keeping whatwg-url's URL and URLSearchParams
// wrappers together. In particular, URL.parse() must continue to create instances of the installed constructor.
// Installing whatwg-url last restores its constructor registry entry; only the generated static methods are copied.
// TODO: Replace this adapter when webidl2js can install partial interfaces onto existing constructors:
// https://github.com/jsdom/webidl2js/issues/84
module.exports = {
  install(globalObject, globalNames) {
    ObjectURL.install(globalObject, globalNames);
    const additions = globalObject.URL;
    URL.install(globalObject, globalNames);
    Object.defineProperties(globalObject.URL, {
      createObjectURL: Object.getOwnPropertyDescriptor(additions, "createObjectURL"),
      revokeObjectURL: Object.getOwnPropertyDescriptor(additions, "revokeObjectURL")
    });
  }
};
