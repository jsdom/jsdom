"use strict";
const DOMException = require("../web-idl/DOMException");
const validateNames = require("./helpers/validate-names");
const defineGetter = require("../utils").defineGetter;
const defineSetter = require("../utils").defineSetter;
const clone = require("./node").clone;

module.exports = function (core) {
  core.Document.prototype.createProcessingInstruction = function (target, data) {
    target = String(target);
    data = String(data);

    validateNames.name(target);

    if (data.indexOf("?>") !== -1) {
      throw new core.DOMException(core.DOMException.INVALID_CHARACTER_ERR,
        "Processing instruction data cannot contain the string \"?>\"");
    }

    return new core.ProcessingInstruction(this._ownerDocument, target, data);
  };

  core.Document.prototype.createTextNode = function (data) {
    return new core.Text(this, String(data));
  };

  core.Document.prototype.createComment = function (data) {
    return new core.Comment(this, String(data));
  };

  core.Document.prototype.importNode = function (node, deep) {
    if (!("_childNodes" in node)) {
      throw new TypeError("First argument to importNode must be a Node");
    }
    deep = Boolean(deep);

    if (node.nodeType === core.Node.DOCUMENT_NODE) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "Cannot import a document node");
    }

    return clone(core, node, this, deep);
  };

  // https://html.spec.whatwg.org/multipage/dom.html#dom-document-cookie
  defineGetter(core.Document.prototype, "cookie", function () {
    return this._cookieJar.getCookieStringSync(this._URL, { http: false });
  });

  defineSetter(core.Document.prototype, "cookie", function (cookieStr) {
    cookieStr = String(cookieStr);
    this._cookieJar.setCookieSync(cookieStr, this._URL, {
      http: false,
      ignoreError: true
    });
  });
};
