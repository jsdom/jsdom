"use strict";
const jsdom = require("../..");


exports["create an empty document"] = function (t) {
  const DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;
  const dom = new DOMImplementation();
  const document = dom.createDocument(null, null, null);
  t.equal(document.childNodes.length, 0, "document should not contain any nodes");
  t.done();
};

exports["doctype ownerDocument"] = function (t) {
  const DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;
  const dom = new DOMImplementation();
  const doctype = dom.createDocumentType("bananas");
  const document = dom.createDocument(null, null, doctype);
  t.equal(doctype.ownerDocument, document, "doctype should belong to the document");
  t.done();
};

exports["doctype child of ownerDocument"] = function (t) {
  const DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;
  const dom = new DOMImplementation();
  const doctype = dom.createDocumentType("hatstand");
  const document = dom.createDocument(null, null, doctype);
  t.equal(document.firstChild, doctype, "doctype should be a child of the document");
  t.done();
};
