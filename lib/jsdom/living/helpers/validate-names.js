"use strict";
const xnv = require("xml-name-validator");
const DOMException = require("../../../generated/idl/DOMException");
const { XML_NS, XMLNS_NS } = require("../helpers/namespaces");

// This is the exact regular expression provided by the standard.
const validElementLocalNameRegex =
  /^(?:[A-Za-z][^\0\t\n\f\r />]*|[:_\u0080-\u{10FFFF}][A-Za-z0-9-.:_\u0080-\u{10FFFF}]*)$/u;
const invalidNamespacePrefix = /[\0\t\n\f\r />]/u;
const invalidAttributeLocalName = /[\0\t\n\f\r /=>]/u;
const invalidDoctypeName = /[\0\t\n\f\r >]/u;

// https://dom.spec.whatwg.org/#valid-namespace-prefix
function isValidNamespacePrefix(name) {
  return name.length >= 1 && !invalidNamespacePrefix.test(name);
}

// https://dom.spec.whatwg.org/#valid-attribute-local-name
function isValidAttributeLocalName(name) {
  return name.length >= 1 && !invalidAttributeLocalName.test(name);
}

// https://dom.spec.whatwg.org/#valid-element-local-name
function isValidElementLocalName(name) {
  return validElementLocalNameRegex.test(name);
}

// https://dom.spec.whatwg.org/#valid-doctype-name
function isValidDoctypeName(name) {
  return !invalidDoctypeName.test(name);
}

function throwInvalidCharacterError(globalObject, name, type) {
  throw DOMException.create(globalObject, [`"${name}" is not a valid ${type}`, "InvalidCharacterError"]);
}

exports.elementLocalName = (globalObject, name) => {
  if (!isValidElementLocalName(name)) {
    throwInvalidCharacterError(globalObject, name, "element local name");
  }
};

exports.attributeLocalName = (globalObject, name) => {
  if (!isValidAttributeLocalName(name)) {
    throwInvalidCharacterError(globalObject, name, "attribute local name");
  }
};

exports.doctypeName = (globalObject, name) => {
  if (!isValidDoctypeName(name)) {
    throwInvalidCharacterError(globalObject, name, "doctype name");
  }
};

// https://dom.spec.whatwg.org/#processinginstruction-initialize
exports.xmlName = (globalObject, name) => {
  if (!xnv.name(name)) {
    throw DOMException.create(globalObject, [`"${name}" did not match the Name production`, "InvalidCharacterError"]);
  }
};

// https://dom.spec.whatwg.org/#validate-and-extract
exports.validateAndExtract = (globalObject, namespace, qualifiedName, context) => {
  if (namespace === "") {
    namespace = null;
  }

  let prefix = null;
  let localName = qualifiedName;

  const colonIndex = qualifiedName.indexOf(":");
  if (colonIndex !== -1) {
    prefix = qualifiedName.substring(0, colonIndex);
    localName = qualifiedName.substring(colonIndex + 1);

    if (!isValidNamespacePrefix(prefix)) {
      throwInvalidCharacterError(globalObject, prefix, "namespace prefix");
    }
  }

  // At this point, `prefix` is either `null` or a valid namespace prefix.
  if (context === "attribute") {
    exports.attributeLocalName(globalObject, localName);
  }

  if (context === "element") {
    exports.elementLocalName(globalObject, localName);
  }

  if (prefix !== null && namespace === null) {
    throw DOMException.create(globalObject, [
      "A prefix was given but no namespace was provided",
      "NamespaceError"
    ]);
  }

  if (prefix === "xml" && namespace !== XML_NS) {
    throw DOMException.create(globalObject, [
      "A prefix of \"xml\" was given but the namespace was not the XML namespace",
      "NamespaceError"
    ]);
  }

  if ((qualifiedName === "xmlns" || prefix === "xmlns") && namespace !== XMLNS_NS) {
    throw DOMException.create(globalObject, [
      "A prefix or qualifiedName of \"xmlns\" was given but the namespace was not the XMLNS namespace",
      "NamespaceError"
    ]);
  }

  if (namespace === XMLNS_NS && qualifiedName !== "xmlns" && prefix !== "xmlns") {
    throw DOMException.create(globalObject, [
      "The XMLNS namespace was given but neither the prefix nor qualifiedName was \"xmlns\"",
      "NamespaceError"
    ]);
  }

  return { namespace, prefix, localName };
};
