"use strict";
const DocumentImpl = require("./Document-impl").implementation;

exports.implementation = class XMLDocumentImpl extends DocumentImpl {
  constructor(globalObject, args, privateData = {}) {
    // XMLDocument is always in "xml" parsing mode:
    super(globalObject, args, { ...privateData, options: { ...privateData.options, parsingMode: "xml" } });
  }
};
