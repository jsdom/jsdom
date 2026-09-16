"use strict";
const XMLDocument = require("../../generated/idl/XMLDocument.js");
const Document = require("../../generated/idl/Document.js");

exports.createImpl = (globalObject, options, { alwaysUseDocumentClass = false } = {}) => {
  if (options.parsingMode === "xml" && !alwaysUseDocumentClass) {
    return XMLDocument.createImpl(globalObject, [], { options });
  }
  return Document.createImpl(globalObject, [], { options });
};
