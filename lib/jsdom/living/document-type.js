"use strict";

const utils = require("./generated/utils");
const DocumentType = require("./generated/DocumentType");

module.exports = core => {
  core.DocumentType = DocumentType.interface;
};

module.exports.create = (core, ownerDocument, name, publicId, systemId) => {
  return DocumentType.createImpl([], { core, ownerDocument, name, publicId, systemId });
};

module.exports.clone = (core, otherDoctype) => {
  return DocumentType.createImpl([], {
    core,
    ownerDocument: otherDoctype.ownerDocument,
    name: otherDoctype.name,
    publicId: otherDoctype.publicId,
    systemId: otherDoctype.systemId
  });
};

module.exports.getPrivates = doctype => {
  return utils.implForWrapper(doctype);
};
