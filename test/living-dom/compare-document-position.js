"use strict";
const load = require("../util").load(__dirname);

// Tests for the Living Standard implementation of compareDocumentPosition
// Spec: http://dom.spec.whatwg.org/#dom-node-comparedocumentposition

exports["A document contains and precedes its document type"] = t => {
  const doc = load("test");
  const doctype = doc.doctype;

  t.ok(doc.compareDocumentPosition(doctype) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Doctype contained");
  t.ok(doc.compareDocumentPosition(doctype) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Doctype follows");
  t.done();
};

exports["A document contains and precedes its newly attached document type"] = t => {
  const doc = load("test");
  const doctype = doc.doctype;
  const newDoctype = doc.implementation.createDocumentType(doctype.name, null, null);

  doc.replaceChild(newDoctype, doctype);

  t.ok(doc.compareDocumentPosition(newDoctype) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Doctype contained");
  t.ok(doc.compareDocumentPosition(newDoctype) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Doctype follows");
  t.done();
};

exports["Two document nodes obtained from the same document are disconnected and implementation specific"] = t => {
  const docA = load("test");
  const docB = load("test");

  t.ok(docA.compareDocumentPosition(docB) & docA.defaultView.Node.DOCUMENT_POSITION_DISCONNECTED, "Disconnected");
  t.ok(docA.compareDocumentPosition(docB) & docA.defaultView.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
    "Implementation Specific");
  t.done();
};

exports["A document is disconnected from and precedes a DocumentFragment"] = t => {
  const doc = load("test");
  const fragment = doc.createDocumentFragment();
  fragment.innerHTML = "<span>I AM SPAN</span>";

  t.ok(doc.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_DISCONNECTED,
    "Fragment disconnected");
  t.ok(doc.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Fragment follows");
  t.ok(doc.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
    "Implementation Specific");
  t.done();
};

exports["A document node compared to itself returns nothing"] = t => {
  const doc = load("test");

  t.equal(doc.compareDocumentPosition(doc), 0, "No Bitmask");
  t.done();
};

exports["A document and a newly created document are disconnected and implementation specific"] = t => {
  const doc = load("test");
  const newDoc = doc.implementation.createDocument();

  t.ok(doc.compareDocumentPosition(newDoc) & doc.defaultView.Node.DOCUMENT_POSITION_DISCONNECTED,
    "Fragment disconnected");
  t.ok(doc.compareDocumentPosition(newDoc) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Fragment follows");
  t.ok(doc.compareDocumentPosition(newDoc) & doc.defaultView.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
    "Implementation Specific");
  t.done();
};

exports["A document contains and precedes its document element and vice versa"] = t => {
  const doc = load("test");
  const documentElement = doc.documentElement;

  t.ok(doc.compareDocumentPosition(documentElement) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "DocumentElement contained");
  t.ok(doc.compareDocumentPosition(documentElement) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
    "DocumentElement follows");
  t.ok(documentElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS,
    "Document contains");
  t.ok(documentElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
    "Document precedes");
  t.done();
};

exports["Document contains and precedes a newly attached element and vice versa"] = t => {
  const doc = load("test");
  const newElement = doc.createElement("p");
  doc.documentElement.appendChild(newElement);

  t.ok(doc.compareDocumentPosition(newElement) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Document contains");
  t.ok(doc.compareDocumentPosition(newElement) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
    "Document precedes");
  t.ok(newElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
  t.ok(newElement.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");
  t.done();
};

exports["Document contains and precedes an existing element and vice versa"] = t => {
  const doc = load("test");
  const element = doc.querySelectorAll("span").item(0);

  t.ok(doc.compareDocumentPosition(element) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Document contains");
  t.ok(doc.compareDocumentPosition(element) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Document precedes");
  t.ok(element.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
  t.ok(element.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");
  t.done();
};

exports["Document contains and precedes a newly attached processing instruction and vice versa"] = t => {
  const doc = load("test");
  const pi = doc.createProcessingInstruction("PITARGET", "PIDATA");

  doc.appendChild(pi);

  t.ok(doc.compareDocumentPosition(pi) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY, "Document contains");
  t.ok(doc.compareDocumentPosition(pi) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Document precedes");
  t.ok(pi.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
  t.ok(pi.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");

  t.done();
};

exports["Document contains and precedes a newly attached comment and vice versa"] = t => {
  const doc = load("test");
  const comment = doc.createComment("I AM COMMENT");
  const span = doc.querySelectorAll("span").item(0);

  span.appendChild(comment);

  t.ok(doc.compareDocumentPosition(comment) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Document contains");
  t.ok(doc.compareDocumentPosition(comment) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Document precedes");
  t.ok(comment.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Comment contained");
  t.ok(comment.compareDocumentPosition(doc) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Comment follows");
  t.done();
};

exports["Document fragment contains and precedes a newly attached nide and vice versa"] = t => {
  const doc = load("test");
  const fragment = doc.createDocumentFragment();
  const span = doc.createElement("span");

  fragment.appendChild(span);

  t.ok(fragment.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Fragment contains");
  t.ok(fragment.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Fragment precedes");
  t.ok(span.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Span contained");
  t.ok(span.compareDocumentPosition(fragment) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Span follows");
  t.done();
};

exports["Newly appended ProcessingInstruction node follows older appended ProcessingInstruction Node"] = t => {
  const doc = load("test");
  const pi1 = doc.createProcessingInstruction("PI1", "Processing Instruction 1");
  const pi2 = doc.createProcessingInstruction("PI2", "Processing Instruction 2");

  doc.documentElement.appendChild(pi1);
  doc.documentElement.appendChild(pi2);

  t.ok(pi1.compareDocumentPosition(pi2) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Second PI Follows");
  t.ok(pi2.compareDocumentPosition(pi1) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "First PI Precedes");
  t.done();
};

exports["Newly appended Text node follows older appended Text Node"] = t => {
  const doc = load("test");
  const t1 = doc.createTextNode("Hello,");
  const t2 = doc.createTextNode("World!");

  doc.documentElement.appendChild(t1);
  doc.documentElement.appendChild(t2);

  t.ok(t1.compareDocumentPosition(t2) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Second Text Node Follows");
  t.ok(t2.compareDocumentPosition(t1) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "First Text Node Precedes");
  t.done();
};

exports["Existing element precedes one later in the markup and vice versa"] = t => {
  const doc = load("test");
  const el1 = doc.getElementsByTagName("strong").item(0);
  const el2 = doc.getElementsByTagName("strong").item(1);

  t.ok(el1.compareDocumentPosition(el2) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Second Element Follows");
  t.ok(el2.compareDocumentPosition(el1) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "First Element Precedes");
  t.done();
};

exports["Element contains and precedes a decendant node and vice versa"] = t => {
  const doc = load("test");
  const span = doc.getElementsByTagName("span").item(0);
  const strong = doc.getElementsByTagName("strong").item(0);

  t.ok(span.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINED_BY, "Span contains");
  t.ok(span.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING, "Span precedes");
  t.ok(strong.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_CONTAINS, "Strong contained");
  t.ok(strong.compareDocumentPosition(span) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING, "Strong follows");
  t.done();
};

exports["A Child node precedes a child of a node later in the markup"] = t => {
  const doc = load("test");
  const strong = doc.getElementsByTagName("strong").item(0);
  const em = doc.getElementsByTagName("em").item(0);

  t.ok(strong.compareDocumentPosition(em) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
    "Second Element Follows");
  t.ok(em.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
    "First Element Precedes");
  t.done();
};

exports["A newly attached child node precedes a child node later in the markup"] = t => {
  const doc = load("test");
  const span = doc.getElementsByTagName("strong").item(0);
  const newEl = doc.createElement("i");
  const em = doc.getElementsByTagName("em").item(0);

  span.appendChild(newEl);

  t.ok(newEl.compareDocumentPosition(em) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
    "Second Element Follows");
  t.ok(em.compareDocumentPosition(newEl) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
    "New Element Precedes");
  t.done();
};

exports["A newly attached child node follows a child node earlier in the markup"] = t => {
  const doc = load("test");
  const strong = doc.getElementsByTagName("strong").item(0);
  const p = doc.getElementsByTagName("p").item(0);
  const newEl = doc.createElement("i");

  p.appendChild(newEl);

  t.ok(newEl.compareDocumentPosition(strong) & doc.defaultView.Node.DOCUMENT_POSITION_PRECEDING,
    "Second Element Precedes");
  t.ok(strong.compareDocumentPosition(newEl) & doc.defaultView.Node.DOCUMENT_POSITION_FOLLOWING,
    "New Element Follows");
  t.done();
};

exports["Testing a node against a non node type throws an error"] = t => {
  const doc = load("test");

  t.throws(doc.compareDocumentPosition.bind(this, {}), "Throws");
  t.done();
};
