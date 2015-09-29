"use strict";
const jsdom = require("../..").jsdom;

// Spec: https://dom.spec.whatwg.org/#dom-node-ownerdocument

exports["ownerDocument returns null for document nodes"] = t => {
  const doc = jsdom();
  t.equal(doc.ownerDocument, null);
  t.done();
};

exports["ownerDocument returns the appropriate document for in-document nodes"] = t => {
  const doc = jsdom("<!DOCTYPE html><p>Text</p><!-- comment -->");
  const el = doc.querySelector("p");
  const text = el.firstChild;
  const comment = el.nextSibling;
  const doctype = doc.doctype;

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

exports["ownerDocument returns the appropriate document for detached nodes"] = t => {
  const doc = jsdom();
  const el = doc.createElement("p");
  const text = doc.createTextNode("text");
  const comment = doc.createComment("comment");
  const doctype = doc.implementation.createDocumentType("blah", "blah", "blah");
  const fragment = doc.createDocumentFragment();
  const pi = doc.createProcessingInstruction("blah", "blah");

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
