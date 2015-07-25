"use strict";
var inheritFrom = require("../utils").inheritFrom;
const NODE_TYPE = require("../living/node-type");

module.exports = function (core) {
  core.DocumentType = function DocumentType(ownerDocument, name, publicId, systemId) {
    core.Node.call(this, ownerDocument);

    this._name = name;
    this._publicId = publicId;
    this._systemId = systemId;
  };

  inheritFrom(core.Node, core.DocumentType, {
    nodeType: NODE_TYPE.DOCUMENT_TYPE_NODE,  // TODO should be on prototype, not here
    get name() { return this._name; },
    get publicId() { return this._publicId; },
    get systemId() { return this._systemId; }
  });
};
