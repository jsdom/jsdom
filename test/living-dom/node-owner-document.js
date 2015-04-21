"use strict";

var jsdom = require("../..").jsdom;

// Spec: https://dom.spec.whatwg.org/#dom-node-ownerdocument

exports["ownerDocument returns null for document nodes"] = function (t) {
  var doc = jsdom();
  t.equal(doc.ownerDocument, null);
  t.done();
};

exports["ownerDocument returns the appropriate document for in-document nodes"] = function (t) {
  var doc = jsdom("<!DOCTYPE html><p>Text</p><!-- comment -->");
  var el = doc.querySelector("p");
  var text = el.firstChild;
  var comment = el.nextSibling;
  var doctype = doc.doctype;

  t.equal(el.nodeType, doc.ELEMENT_NODE);
  t.equal(el.ownerDocument, doc, "element node");

  t.equal(text.nodeType, doc.TEXT_NODE);
  t.equal(text.ownerDocument, doc, "text node");

  t.equal(comment.nodeType, doc.COMMENT_NODE);
  t.equal(comment.ownerDocument, doc, "comment node");

  t.equal(doctype.nodeType, doc.DOCUMENT_TYPE_NODE);
  t.equal(doctype.ownerDocument, doc, "doctype node");

  // TODO processing instructions?

  t.done();
};

exports["ownerDocument returns the appropriate document for detached nodes"] = function (t) {
  var doc = jsdom();
  var el = doc.createElement("p");
  var text = doc.createTextNode("text");
  var comment = doc.createComment("comment");
  var doctype = doc.implementation.createDocumentType("blah", "blah", "blah");
  var fragment = doc.createDocumentFragment();
  var pi = doc.createProcessingInstruction("blah", "blah");

  t.equal(el.nodeType, doc.ELEMENT_NODE);
  t.equal(el.ownerDocument, doc, "element node");

  t.equal(text.nodeType, doc.TEXT_NODE);
  t.equal(text.ownerDocument, doc, "text node");

  t.equal(comment.nodeType, doc.COMMENT_NODE);
  t.equal(comment.ownerDocument, doc, "comment node");

  t.equal(doctype.nodeType, doc.DOCUMENT_TYPE_NODE);
  t.equal(doctype.ownerDocument, doc, "doctype node");

  t.equal(fragment.nodeType, doc.DOCUMENT_FRAGMENT_NODE);
  t.equal(fragment.ownerDocument, doc, "document fragment node");

  t.equal(pi.nodeType, doc.PROCESSING_INSTRUCTION_NODE);
  t.equal(pi.ownerDocument, doc, "procesing instruction node");

  t.done();
};
