"use strict";
var xnv = require("xml-name-validator");

// https://dom.spec.whatwg.org/#validate

exports.name = function (name, core) {
  var result = xnv.name(name);
  if (!result.success) {
    throw new core.DOMException(core.DOMException.INVALID_CHARACTER_ERR,
      "\"" + name + "\" did not match the Name production: " + result.error);
  }
};

exports.qname = function (qname, core) {
  exports.name(qname, core);

  var result = xnv.qname(qname);
  if (!result.success) {
    throw new core.DOMException(core.DOMException.NAMESPACE_ERR,
      "\"" + qname + "\" did not match the QName production: " + result.error);
  }
};

exports.validateAndExtract = function (namespace, qualifiedName, core) {
  if (namespace === "") {
    namespace = null;
  }

  exports.qname(qualifiedName, core);

  var prefix = null;
  var localName = qualifiedName;

  var colonIndex = qualifiedName.indexOf(":");
  if (colonIndex !== -1) {
    prefix = qualifiedName.substring(0, colonIndex);
    localName = qualifiedName.substring(colonIndex + 1);
  }

  if (prefix !== null && namespace === null) {
    throw new core.DOMException(core.DOMException.NAMESPACE_ERR,
      "A namespace was given but a prefix was also extracted from the qualifiedName");
  }

  if (prefix === "xml" && namespace !== "http://www.w3.org/XML/1998/namespace") {
    throw new core.DOMException(core.DOMException.NAMESPACE_ERR,
      "A prefix of \"xml\" was given but the namespace was not the XML namespace");
  }

  if ((qualifiedName === "xmlns" || prefix === "xmlns") && namespace !== "http://www.w3.org/2000/xmlns/") {
    throw new core.DOMException(core.DOMException.NAMESPACE_ERR,
      "A prefix or qualifiedName of \"xmlns\" was given but the namespace was not the XMLNS namespace");
  }

  if (namespace === "http://www.w3.org/2000/xmlns/" && qualifiedName !== "xmlns" && prefix !== "xmlns") {
    throw new core.DOMException(core.DOMException.NAMESPACE_ERR,
      "The XMLNS namespace was given but neither the prefix nor qualifiedName was \"xmlns\"");
  }

  return { namespace: namespace, prefix: prefix, localName: localName, qualifiedName: qualifiedName };
};
