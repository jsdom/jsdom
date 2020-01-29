"use strict";
const DocumentImpl = require("./Document-impl").implementation;

exports.implementation = class XMLDocumentImpl extends DocumentImpl {
  constructor(globalObject, args, privateData = {}) {
    let options;
    if (!(options = privateData.options)) {
      options = privateData.options = {};
    }

    // XMLDocument is always in "xml" mode:
    options.parsingMode = "xml";

    super(globalObject, args, privateData);
  }
};
