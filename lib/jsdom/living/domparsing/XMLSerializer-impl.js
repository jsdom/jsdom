"use strict";
const serialize = require("w3c-xmlserializer");
const DOMException = require("../generated/DOMException");
const utils = require("../generated/utils");

exports.implementation = class XMLSerializerImpl {
  constructor(globalObject) {
    this._sdGlobalObject = globalObject;
  }

  serializeToString(root) {
    try {
      return serialize(utils.wrapperForImpl(root), { requireWellFormed: false });
    } catch (e) {
      throw DOMException.create(this._sdGlobalObject, [e.message, "InvalidStateError"]);
    }
  }
};
