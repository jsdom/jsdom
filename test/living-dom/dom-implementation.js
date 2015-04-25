"use strict";
const jsdom = require("../..");

exports["new DOMImplementation() is not allowed"] = function (t) {
  const DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;

  let foo;
  t.throws(function () {
    foo = new DOMImplementation();
  }, /Illegal constructor/i);

  t.done();
};

exports["create an empty document"] = function (t) {
  const implementation = jsdom.jsdom().implementation;
  const document = implementation.createDocument(null, null, null);
  t.equal(document.childNodes.length, 0, "document should not contain any nodes");
  t.done();
};

exports["doctype ownerDocument"] = function (t) {
  const document = jsdom.jsdom();
  const doctype = document.implementation.createDocumentType("bananas");
  t.ok(doctype.ownerDocument === document, "doctype should belong to the document the implementation belongs to");
  const newDocument = document.implementation.createDocument(null, null, doctype);
  t.ok(doctype.ownerDocument === newDocument, "doctype should belong to the new document");
  t.done();
};

exports["doctype child of ownerDocument"] = function (t) {
  const document = jsdom.jsdom();
  const doctype = document.implementation.createDocumentType("hatstand");
  const newDocument = document.implementation.createDocument(null, null, doctype);
  t.ok(newDocument.firstChild === doctype, "doctype should be a child of the document");
  t.done();
};
  t.done();
};
