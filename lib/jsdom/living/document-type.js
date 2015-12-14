"use strict";

const utils = require("./generated/utils");
const DocumentType = require("./generated/DocumentType");

module.exports = core => {
  core.DocumentType = DocumentType.interface;
};

module.exports.create = (core, ownerDocument, name, publicId, systemId) => {
  return DocumentType.create([], { ownerDocument, name, publicId, systemId });
};

module.exports.clone = (core, otherDoctype) => {
  const otherImpl = utils.implForWrapper(otherDoctype);
  return DocumentType.create([], {
    ownerDocument: otherImpl.ownerDocument,
    name: otherImpl.name,
    publicId: otherImpl.publicId,
    systemId: otherImpl.systemId
  });
};

module.exports.getPrivates = doctype => {
  return utils.implForWrapper(doctype);
};
