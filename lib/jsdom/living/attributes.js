"use strict";
const DOMException = require("../web-idl/DOMException");
const defineGetter = require("../utils").defineGetter;

// https://dom.spec.whatwg.org/#namednodemap

const INTERNAL = Symbol("NamedNodeMap internal");

// TODO: use NamedPropertyTracker when https://github.com/tmpvar/jsdom/pull/1116 lands?

// Don't emulate named getters for these properties.
// Compiled later after NamedNodeMap is all set up.
const reservedNames = new Set();

function NamedNodeMap() {
  throw new TypeError("Illegal constructor");
}

defineGetter(NamedNodeMap.prototype, "length", function () {
  return this[INTERNAL].attributeList.length;
});

NamedNodeMap.prototype.item = function (index) {
  if (arguments.length < 1) {
    throw new TypeError("Not enough arguments to NamedNodeMap.prototype.item");
  }

  // Don't bother with full unsigned long long conversion. When we have better WebIDL support generally, revisit.
  index = Number(index);

  return this[index] || null;
};

NamedNodeMap.prototype.getNamedItem = function (name) {
  if (arguments.length < 1) {
    throw new TypeError("Not enough arguments to NamedNodeMap.prototype.getNamedItem");
  }
  name = String(name);

  return exports.getAttributeByName(this[INTERNAL].element, name);
};

NamedNodeMap.prototype.getNamedItemNS = function (namespace, localName) {
  if (arguments.length < 2) {
    throw new TypeError("Not enough arguments to NamedNodeMap.prototype.getNamedItemNS");
  }
  if (namespace === undefined || namespace === null) {
    namespace = null;
  } else {
    namespace = String(namespace);
  }
  localName = String(localName);

  return exports.getAttributeByNameNS(this[INTERNAL].element, namespace, localName);
};

NamedNodeMap.prototype.setNamedItem = function (attr) {
  if (!attr || !attr.constructor || attr.constructor.name !== "Attr") {
    throw new TypeError("First argument to NamedNodeMap.prototype.setNamedItem must be an Attr");
  }

  return exports.setAttribute(this[INTERNAL].element, attr);
};

NamedNodeMap.prototype.setNamedItemNS = function (attr) {
  if (!attr || attr.constructor.name !== "Attr") {
    throw new TypeError("First argument to NamedNodeMap.prototype.setNamedItemNS must be an Attr");
  }

  return exports.setAttribute(this[INTERNAL].element, attr, true);
};

NamedNodeMap.prototype.removeNamedItem = function (name) {
  if (arguments.length < 1) {
    throw new TypeError("Not enough arguments to NamedNodeMap.prototype.getNamedItem");
  }
  name = String(name);

  const attr = exports.removeAttributeByName(this[INTERNAL].element, name);

  if (attr === null) {
    throw new DOMException(DOMException.NOT_FOUND_ERR, "Tried to remove an attribute that was not present");
  }

  return attr;
};

NamedNodeMap.prototype.removeNamedItemNS = function (namespace, localName) {
  if (arguments.length < 2) {
    throw new TypeError("Not enough arguments to NamedNodeMap.prototype.removeNamedItemNS");
  }
  if (namespace === undefined || namespace === null) {
    namespace = null;
  } else {
    namespace = String(namespace);
  }
  localName = String(localName);

  const attr = exports.removeAttributeByNameNS(this[INTERNAL].element, namespace, localName);

  if (attr === null) {
    throw new DOMException(DOMException.NOT_FOUND_ERR, "Tried to remove an attribute that was not present");
  }

  return attr;
};

exports.NamedNodeMap = NamedNodeMap;

// TODO use just a plain block when https://github.com/jscs-dev/node-jscs/issues/1328 gets fixed
(function () {
  let prototype = NamedNodeMap.prototype;
  while (prototype) {
    for (const name of Object.getOwnPropertyNames(prototype)) {
      reservedNames.add(name);
    }
    prototype = Object.getPrototypeOf(prototype);
  }
}());

exports.createNamedNodeMap = function (element) {
  const nnm = Object.create(NamedNodeMap.prototype);
  nnm[INTERNAL] = {
    element: element,
    attributeList: [],
    attributesByNameMap: new Map()
  };
  return nnm;
};

// The following three are for https://dom.spec.whatwg.org/#concept-element-attribute-has. We don't just have a
// predicate tester since removing that kind of flexibility gives us the potential for better future optimizations.

exports.hasAttribute = function (element, A) {
  const attributesNNM = element._attributes;
  const attributeList = attributesNNM[INTERNAL].attributeList;

  return attributeList.indexOf(A) !== -1;
};

exports.hasAttributeByName = function (element, name) {
  const attributesNNM = element._attributes;
  const attributeList = attributesNNM[INTERNAL].attributeList;

  return attributeList.some(function (attribute) {
    return attribute._name === name;
  });
};

exports.hasAttributeByNameNS = function (element, namespace, localName) {
  const attributesNNM = element._attributes;
  const attributeList = attributesNNM[INTERNAL].attributeList;

  return attributeList.some(function (attribute) {
    return attribute._localName === localName && attribute._namespaceURI === namespace;
  });
};

exports.changeAttribute = function (element, attribute, value) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-change

  // TODO mutation observer stuff

  // TODO Attr: we should actually be modifying attribute's internal value. In fact, the value setter for Attrs should
  // delegate to this very function. However, currently Attrs are quite messed up.
  attribute.value = value;

  // TODO Attr: when we fix the above, we'll also need to call element._attrModified. However, the current code calls
  // _attrModified from within the setter.
  // Spec: "An attribute is set and an attribute is changed."
};

exports.appendAttribute = function (element, attribute) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-append

  const attributesNNM = element._attributes;
  const attributeList = attributesNNM[INTERNAL].attributeList;

  // TODO mutation observer stuff

  attributeList.push(attribute);
  attribute._ownerElement = element;

  // Sync target indexed properties
  attributesNNM[attributeList.length - 1] = attribute;

  // Sync target named properties
  if (!reservedNames.has(attribute._name)) {
    attributesNNM[attribute._name] = attribute;
  }

  // Sync name cache
  const cache = attributesNNM[INTERNAL].attributesByNameMap;
  let entry = cache.get(attribute._name);
  if (!entry) {
    entry = [];
    cache.set(attribute._name, entry);
  }
  entry.push(attribute);

  // Run jsdom hooks; roughly correspond to spec's "An attribute is set and an attribute is added."
  element._attrModified(attribute._name, attribute.value, null);
};

exports.removeAttribute = function (element, attribute) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-remove

  const attributesNNM = element._attributes;
  const attributeList = attributesNNM[INTERNAL].attributeList;

  // TODO mutation observer stuff

  for (let i = 0; i < attributeList.length; ++i) {
    if (attributeList[i] === attribute) {
      attributeList.splice(i, 1);
      attribute._ownerElement = null;

      // Sync target indexed properties
      for (let j = i; j < attributeList.length; ++j) {
        attributesNNM[j] = attributeList[j];
      }
      delete attributesNNM[attributeList.length];

      // Sync target named properties
      if (!reservedNames.has(attribute._name)) {
        delete attributesNNM[attribute._name];
      }

      // Sync name cache
      const cache = attributesNNM[INTERNAL].attributesByNameMap;
      const entry = cache.get(attribute._name);
      entry.splice(entry.indexOf(attribute), 1);
      if (entry.length === 0) {
        cache.delete(attribute._name);
      }

      // Run jsdom hooks; roughly correspond to spec's "An attribute is removed."
      element._attrModified(attribute._name, null, attribute.value);

      return;
    }
  }
};

exports.getAttributeByName = function (element, name) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name

  if (element._namespaceURI === "http://www.w3.org/1999/xhtml" &&
      element._ownerDocument._parsingMode === "html") {
    name = name.toLowerCase();
  }

  const cache = element._attributes[INTERNAL].attributesByNameMap;
  const entry = cache.get(name);
  if (!entry) {
    return null;
  }

  return entry[0];
};

exports.getAttributeValue = function (element, name) {
  const attr = exports.getAttributeByName(element, name);
  return attr && attr.value; // TODO Attr: do not use public API
};

exports.getAttributeByNameNS = function (element, namespace, localName) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace

  if (namespace === "") {
    namespace = null;
  }

  const attributeList = element._attributes[INTERNAL].attributeList;
  for (let i = 0; i < attributeList.length; ++i) {
    const attr = attributeList[i];
    if (attr._namespaceURI === namespace && attr._localName === localName) {
      return attr;
    }
  }

  return null;

};

exports.setAttribute = function (element, attr, namespaceAndLocalNameFlag) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-set

  if (attr._ownerElement !== null && attr._ownerElement !== element) {
    throw new DOMException(DOMException.INUSE_ATTRIBUTE_ERR);
  }

  let oldAttr = null;
  if (namespaceAndLocalNameFlag) {
    oldAttr = exports.getAttributeByNameNS(element, attr._namespaceURI, attr._localName);
  } else {
    oldAttr = exports.getAttributeByName(element, attr._name);
  }

  if (oldAttr === attr) {
    return attr;
  }

  if (oldAttr !== null) {
    exports.removeAttribute(element, oldAttr);
  }

  exports.appendAttribute(element, attr);

  return oldAttr;
};

exports.setAttributeValue = function (element, localName, value, name, prefix, namespace) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-set-value

  if (name === undefined) {
    name = localName;
  }
  if (prefix === undefined) {
    prefix = null;
  }

  const attribute = exports.getAttributeByNameNS(element, namespace, localName);
  if (attribute === null) {
    // TODO Attr: clean up when Attr gets cleaned up.
    const newAttribute = element._ownerDocument._createAttributeNoNameValidation();
    newAttribute._namespaceURI = namespace;
    newAttribute._prefix = prefix;
    newAttribute._localName = localName;
    newAttribute._name = name;
    newAttribute.value = value;

    exports.appendAttribute(element, newAttribute);
    return;
  }

  exports.changeAttribute(element, attribute, value);
};

exports.removeAttributeByName = function (element, name) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name

  const attr = exports.getAttributeByName(element, name);

  if (attr !== null) {
    exports.removeAttribute(element, attr);
  }

  return attr;
};

exports.removeAttributeByNameNS = function (element, namespace, localName) {
  // https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace

  const attr = exports.getAttributeByNameNS(element, namespace, localName);

  if (attr !== null) {
    exports.removeAttribute(element, attr);
  }

  return attr;
};

exports.copyAttributeList = function (sourceElement, destElement) {
  // Needed by https://dom.spec.whatwg.org/#concept-node-clone

  for (const sourceAttr of sourceElement._attributes[INTERNAL].attributeList) {
    // TODO Attr: clean up when Attr gets cleaned up.
    const destAttr = destElement._ownerDocument._createAttributeNoNameValidation();
    destAttr._namespaceURI = sourceAttr._namespaceURI;
    destAttr._prefix = sourceAttr._prefix;
    destAttr._localName = sourceAttr._localName;
    destAttr._name = sourceAttr._name;
    destAttr.value = sourceAttr.value;

    exports.appendAttribute(destElement, destAttr);
  }
};

exports.hasAttributes = function (element) {
  // Needed by https://dom.spec.whatwg.org/#dom-element-hasattributes

  return element._attributes[INTERNAL].attributeList.length > 0;
};
