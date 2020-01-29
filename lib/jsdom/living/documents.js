"use strict";
const XMLDocument = require("../living/generated/XMLDocument");
const Document = require("../living/generated/Document");

exports.createWrapper = (globalObject, options = {}, type = options.parsingMode || null) => {
  switch (type) {
    case "xml":
      return XMLDocument.create(globalObject, [], { options });
    case "html":
      // TODO: Implement 'HTMLDocument' (https://github.com/jsdom/jsdom/pull/2744)
      // eslint-disable-next-line no-fallthrough
    case null:
      return Document.create(globalObject, [], { options });
    default:
      throw new Error(`Internal error: Document type ${String(type)} is not one of null, "xml" or "html".`);
  }
};

exports.createImpl = (globalObject, options = {}, type = options.parsingMode || null) => {
  switch (type) {
    case "xml":
      return XMLDocument.createImpl(globalObject, [], { options });
    case "html":
      // TODO: Implement 'HTMLDocument' (https://github.com/jsdom/jsdom/pull/2744)
      // eslint-disable-next-line no-fallthrough
    case null:
      return Document.createImpl(globalObject, [], { options });
    default:
      throw new Error(`Internal error: Document type ${String(type)} is not one of null, "xml" or "html".`);
  }
};
