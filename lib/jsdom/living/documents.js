"use strict";
const XMLDocument = require("../living/generated/XMLDocument.js");
const Document = require("../living/generated/Document.js");
const { wrapperForImpl } = require("./generated/utils.js");

exports.createImpl = (globalObject, options = {}, useSubclass = true) => {
  const type = useSubclass ? options.parsingMode || "html" : null;
  switch (type) {
    case "xml":
      return XMLDocument.createImpl(globalObject, [], { options });
    case "html":
      // TODO: Implement 'HTMLDocument' (https://github.com/jsdom/jsdom/pull/2744)
      // eslint-disable-next-line no-fallthrough
    case null:
      return Document.createImpl(globalObject, [], { options });
    default:
      throw new Error(`Internal error: Document parsing mode ${String(type)} is not one of "html" or "xml".`);
  }
};

exports.createWrapper = (globalObject, options = {}, useSubclass = true) => {
  return wrapperForImpl(exports.createImpl(globalObject, options, useSubclass));
};
