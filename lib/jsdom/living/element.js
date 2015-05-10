"use strict";
const defineGetter = require("../utils").defineGetter;
const attributes = require("./attributes");
const validateNames = require("./helpers/validate-names");
const DOMException = require("../web-idl/DOMException");

module.exports = function (core) {
  defineGetter(core.Element, "attributes", function () {
    return this._attributes;
  });

  core.Element.prototype.hasAttributes = function hasAttributes() {
    return attributes.hasAttributes(this);
  };

  core.Element.prototype.getAttribute = function getAttribute(name) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.getAttribute");
    }
    name = String(name);

    const attr = attributes.getAttributeByName(this, name);
    if (attr === null) {
      return null;
    }

    return attr.value; // TODO Attr: _value when Attrs are fixed
  };

  core.Element.prototype.getAttributeNS = function getAttributeNS(namespace, localName) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Element.prototype.getAttributeNS");
    }
    if (namespace === undefined || namespace === null) {
      namespace = null;
    } else {
      namespace = String(namespace);
    }
    localName = String(localName);

    const attr = attributes.getAttributeByNameNS(this, namespace, localName);
    if (attr === null) {
      return null;
    }

    return attr.value; // TODO Attr: _value when Attrs are fixed
  };

  core.Element.prototype.setAttribute = function setAttribute(name, value) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Element.prototype.setAttribute");
    }
    name = String(name);
    value = String(value);

    validateNames.name(name);

    if (this._namespaceURI === "http://www.w3.org/1999/xhtml" && this._ownerDocument._parsingMode === "html") {
      name = name.toLowerCase();
    }

    const attribute = attributes.getAttributeByName(this, name);

    if (attribute === null) {
      // TODO Attr: clean up when Attr gets fixed
      const newAttr = new core.Attr(this._ownerDocument, name);
      newAttr.value = value;
      attributes.appendAttribute(this, newAttr);
      return;
    }

    attributes.changeAttribute(this, attribute, value);
  };

  core.Element.prototype.setAttributeNS = function setAttributeNS(namespace, name, value) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Element.prototype.setAttributeNS");
    }
    if (namespace === undefined || namespace === null) {
      namespace = null;
    } else {
      namespace = String(namespace);
    }
    name = String(name);
    value = String(value);

    const extracted = validateNames.validateAndExtract(namespace, name);

    attributes.setAttributeValue(this, extracted.localName, value, extracted.qualifiedName, extracted.prefix,
      extracted.namespace);
  };

  core.Element.prototype.removeAttribute = function removeAttribute(name) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.removeAttribute");
    }
    name = String(name);

    attributes.removeAttributeByName(this, name);
  };

  core.Element.prototype.removeAttributeNS = function removeAttributeNS(namespace, localName) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Element.prototype.removeAttributeNS");
    }
    if (namespace === undefined || namespace === null) {
      namespace = null;
    } else {
      namespace = String(namespace);
    }
    localName = String(localName);

    attributes.removeAttributeByNameNS(this, namespace, localName);
  };

  core.Element.prototype.hasAttribute = function hasAttribute(name) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.hasAttribute");
    }
    name = String(name);

    if (this._namespaceURI === "http://www.w3.org/1999/xhtml" && this._ownerDocument._parsingMode === "html") {
      name = name.toLowerCase();
    }

    return attributes.hasAttributeByName(this, name);
  };

  core.Element.prototype.hasAttributeNS = function hasAttributeNS(namespace, localName) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Element.prototype.hasAttributeNS");
    }
    if (namespace === undefined || namespace === null) {
      namespace = null;
    } else {
      namespace = String(namespace);
    }
    localName = String(localName);

    if (namespace === "") {
      namespace = null;
    }

    return attributes.hasAttributeByNameNS(this, namespace, localName);
  };

  core.Element.prototype.getAttributeNode = function getAttributeNode(name) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.getAttributeNode");
    }
    name = String(name);

    return attributes.getAttributeByName(this, name);
  };

  core.Element.prototype.getAttributeNodeNS = function getAttributeNodeNS(namespace, localName) {
    if (arguments.length < 2) {
      throw new TypeError("Not enough arguments to Element.prototype.getAttributeNodeNS");
    }
    if (namespace === undefined || namespace === null) {
      namespace = null;
    } else {
      namespace = String(namespace);
    }
    localName = String(localName);

    return attributes.getAttributeByNameNS(this, namespace, localName);
  };

  core.Element.prototype.setAttributeNode = function setAttributeNode(attr) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.setAttributeNode");
    }
    if (!attr || !attr.constructor || attr.constructor.name !== "Attr") {
      throw new TypeError("First argument to Element.prototype.setAttributeNode must be an Attr");
    }

    return attributes.setAttribute(this, attr);
  };

  core.Element.prototype.setAttributeNodeNS = function setAttributeNodeNS(attr) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.setAttributeNodeNS");
    }
    if (!attr || !attr.constructor || attr.constructor.name !== "Attr") {
      throw new TypeError("First argument to Element.prototype.setAttributeNodeNS must be an Attr");
    }

    return attributes.setAttribute(this, attr, true);
  };

  core.Element.prototype.removeAttributeNode = function removeAttributeNode(attr) {
    if (arguments.length < 1) {
      throw new TypeError("Not enough arguments to Element.prototype.setAttributeNode");
    }
    if (!attr || !attr.constructor || attr.constructor.name !== "Attr") {
      throw new TypeError("First argument to Element.prototype.removeAttributeNode must be an Attr");
    }

    if (!attributes.hasAttribute(this, attr)) {
      throw new DOMException(DOMException.NOT_FOUND_ERR, "Tried to remove an attribute that was not present");
    }

    attributes.removeAttribute(this, attr);

    return attr;
  };
};
