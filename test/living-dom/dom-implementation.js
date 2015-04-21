"use strict";
var jsdom = require("../..");


exports["create an empty document"] = function (t) {
  var DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;
  var dom = new DOMImplementation();
  var document = dom.createDocument(null, null, null);
  t.equal(document.childNodes.length, 0, "document should not contain any nodes");
  t.done();
};

exports["doctype ownerDocument"] = function (t) {
  var DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;
  var dom = new DOMImplementation();
  var doctype = dom.createDocumentType("bananas");
  var document = dom.createDocument(null, null, doctype);
  t.equal(doctype.ownerDocument, document, "doctype should belong to the document");
  t.done();
};

exports["doctype child of ownerDocument"] = function (t) {
  var DOMImplementation = jsdom.jsdom().defaultView.DOMImplementation;
  var dom = new DOMImplementation();
  var doctype = dom.createDocumentType("hatstand");
  var document = dom.createDocument(null, null, doctype);
  t.equal(document.firstChild, doctype, "doctype should be a child of the document");
  t.done();
};
