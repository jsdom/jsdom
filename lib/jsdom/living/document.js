"use strict";
const DOMException = require("../web-idl/DOMException");
const validateNames = require("./helpers/validate-names");
const defineGetter = require("../utils").defineGetter;
const defineSetter = require("../utils").defineSetter;
const memoizeQuery = require("../utils").memoizeQuery;
const generatedAttr = require("./generated/Attr");
const clone = require("./node").clone;
const listOfElementsWithClassNames = require("./node").listOfElementsWithClassNames;
const validateName = require("./helpers/validate-names").name;
const validateAndExtract = require("./helpers/validate-names").validateAndExtract;
const NODE_TYPE = require("../living/node-type");
const idlUtils = require("./generated/utils");

const Comment = require("./generated/Comment");
const ProcessingInstruction = require("./generated/ProcessingInstruction");
const Text = require("./generated/Text");

module.exports = function (core) {
  core.Document.prototype.createProcessingInstruction = function (target, data) {
    validateNames.name(target);

    if (data.indexOf("?>") !== -1) {
      throw new core.DOMException(core.DOMException.INVALID_CHARACTER_ERR,
        "Processing instruction data cannot contain the string \"?>\"");
    }

    return ProcessingInstruction.create([], {
      ownerDocument: this,
      target,
      data
    });
  };

  core.Document.prototype.createTextNode = function (data) {
    return Text.create([], {
      ownerDocument: this,
      data
    });
  };

  core.Document.prototype.createComment = function (data) {
    return Comment.create([], {
      ownerDocument: this,
      data
    });
  };

  core.Document.prototype.createElement = function (localName) {
    validateName(localName);
    if (this._parsingMode === "html") {
      localName = localName.toLowerCase();
    }

    const element = idlUtils.implForWrapper(this)._createElementWithCorrectElementInterface(localName, "http://www.w3.org/1999/xhtml");
    element._namespaceURI = "http://www.w3.org/1999/xhtml";
    element._localName = localName;
    element._ownerDocument = this;

    return element;
  };

  core.Document.prototype.createElementNS = function (namespace, qualifiedName) {
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, qualifiedName);

    const element = idlUtils.implForWrapper(this)._createElementWithCorrectElementInterface(extracted.localName, extracted.namespace);
    element._namespaceURI = extracted.namespace;
    element._prefix = extracted.prefix;
    element._localName = extracted.localName;
    element._ownerDocument = this;

    return element;
  };

  core.Document.prototype.createDocumentFragment = function () {
    return new core.DocumentFragment(this);
  };

  core.Document.prototype.createAttribute = function (localName) {
    if (arguments.length < 1) {
      throw new TypeError("not enough arguments to Document.prototype.createAttribute");
    }
    localName = String(localName);

    validateName(localName);

    if (this._parsingMode === "html") {
      localName = localName.toLowerCase();
    }

    return generatedAttr.create([], { localName });
  };

  core.Document.prototype.createAttributeNS = function (namespace, name) {
    if (namespace === undefined) {
      namespace = null;
    }
    namespace = namespace !== null ? String(namespace) : namespace;

    const extracted = validateAndExtract(namespace, name);
    return generatedAttr.create([], {
      namespace: extracted.namespace,
      namespacePrefix: extracted.prefix,
      localName: extracted.localName
    });
  };


  core.Document.prototype.importNode = function (node, deep) {
    if (!("_ownerDocument" in node)) {
      throw new TypeError("First argument to importNode must be a Node");
    }
    deep = Boolean(deep);

    if (node.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      throw new DOMException(DOMException.NOT_SUPPORTED_ERR, "Cannot import a document node");
    }

    return clone(core, node, this, deep);
  };

  core.Document.prototype.getElementsByClassName = memoizeQuery(function getElementsByClassName(classNames) {
    return listOfElementsWithClassNames(classNames, this);
  });

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
