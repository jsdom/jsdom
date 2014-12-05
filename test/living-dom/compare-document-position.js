"use strict";

var load = require("../util").load(__dirname);

// Tests for the Living Standard implementation of compareDocumentPosition
// Spec: http://dom.spec.whatwg.org/#dom-node-comparedocumentposition

exports["A document contains and precedes its document type"] = function (t) {
  var doc = load("test");
  var doctype = doc.doctype;

  t.ok(doc.compareDocumentPosition(doctype) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Doctype contained");
  t.ok(doc.compareDocumentPosition(doctype) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Doctype follows");
  t.done();
};

exports["A document contains and precedes its newly attached document type"] = function (t) {
  var doc = load("test");
  var doctype = doc.doctype;
  var newDoctype = doc.implementation.createDocumentType(doctype.name, null, null);

  doc.replaceChild(newDoctype, doctype);

  t.ok(doc.compareDocumentPosition(newDoctype) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Doctype contained");
  t.ok(doc.compareDocumentPosition(newDoctype) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Doctype follows");
  t.done();
};

exports["Two document nodes obtained from the same document are disconnected and implementation specific"] =
    function (t) {
  var docA = load("test");
  var docB = load("test");

  t.ok(docA.compareDocumentPosition(docB) & docA.parentWindow.Node.DOCUMENT_POSITION_DISCONNECTED, "Disconnected");
  t.ok(docA.compareDocumentPosition(docB) & docA.parentWindow.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
    "Implementation Specific");
  t.done();
};

exports["A document is disconnected from and precedes a DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();
  fragment.innerHTML = "<span>I AM SPAN</span>";

  t.ok(doc.compareDocumentPosition(fragment) & doc.parentWindow.Node.DOCUMENT_POSITION_DISCONNECTED,
    "Fragment disconnected");
  t.ok(doc.compareDocumentPosition(fragment) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Fragment follows");
  t.ok(doc.compareDocumentPosition(fragment) & doc.parentWindow.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
    "Implementation Specific");
  t.done();
};

exports["A document node compared to itself returns nothing"] = function (t) {
  var doc = load("test");

  t.equal(doc.compareDocumentPosition(doc), 0, "No Bitmask");
  t.done();
};

exports["A document and a newly created document are disconnected and implementation specific"] = function (t) {
  var doc = load("test");
  var newDoc = doc.implementation.createDocument();

  t.ok(doc.compareDocumentPosition(newDoc) & doc.parentWindow.Node.DOCUMENT_POSITION_DISCONNECTED,
    "Fragment disconnected");
  t.ok(doc.compareDocumentPosition(newDoc) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Fragment follows");
  t.ok(doc.compareDocumentPosition(newDoc) & doc.parentWindow.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
    "Implementation Specific");
  t.done();
};

exports["A document contains and precedes its document element and vice versa"] = function (t) {
  var doc = load("test");
  var documentElement = doc.documentElement;

  t.ok(doc.compareDocumentPosition(documentElement) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "DocumentElement contained");
  t.ok(doc.compareDocumentPosition(documentElement) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING,
    "DocumentElement follows");
  t.ok(documentElement.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS,
    "Document contains");
  t.ok(documentElement.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING,
    "Document precedes");
  t.done();
};

exports["Document contains and precedes a newly attached element and vice versa"] = function (t) {
  var doc = load("test");
  var newElement = doc.createElement("p");
  doc.documentElement.appendChild(newElement);

  t.ok(doc.compareDocumentPosition(newElement) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Document contains");
  t.ok(doc.compareDocumentPosition(newElement) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING,
    "Document precedes");
  t.ok(newElement.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
  t.ok(newElement.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");
  t.done();
};

exports["Document contains and precedes an existing element and vice versa"] = function (t) {
  var doc = load("test");
  var element = doc.querySelectorAll("span").item(0);

  t.ok(doc.compareDocumentPosition(element) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Document contains");
  t.ok(doc.compareDocumentPosition(element) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Document precedes");
  t.ok(element.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
  t.ok(element.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");
  t.done();
};

exports["Document contains and precedes a newly attached processing instruction and vice versa"] = function (t) {
  var doc = load("test");
  var pi = doc.createProcessingInstruction("PITARGET", "PIDATA");

  doc.appendChild(pi);

  t.ok(doc.compareDocumentPosition(pi) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY, "Document contains");
  t.ok(doc.compareDocumentPosition(pi) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Document precedes");
  t.ok(pi.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS, "Element contained");
  t.ok(pi.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "Element follows");

  t.done();
};

exports["Document contains and precedes a newly attached comment and vice versa"] = function (t) {
  var doc = load("test");
  var comment = doc.createComment("I AM COMMENT");
  var span = doc.querySelectorAll("span").item(0);

  span.appendChild(comment);

  t.ok(doc.compareDocumentPosition(comment) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Document contains");
  t.ok(doc.compareDocumentPosition(comment) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Document precedes");
  t.ok(comment.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS, "Comment contained");
  t.ok(comment.compareDocumentPosition(doc) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "Comment follows");
  t.done();
};

exports["Document fragment contains and precedes a newly attached nide and vice versa"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();
  var span = doc.createElement("span");

  fragment.appendChild(span);

  t.ok(fragment.compareDocumentPosition(span) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY,
    "Fragment contains");
  t.ok(fragment.compareDocumentPosition(span) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Fragment precedes");
  t.ok(span.compareDocumentPosition(fragment) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS, "Span contained");
  t.ok(span.compareDocumentPosition(fragment) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "Span follows");
  t.done();
};

exports["Newly appended ProcessingInstruction node follows older appended ProcessingInstruction Node"] = function (t) {
  var doc = load("test");
  var pi1 = doc.createProcessingInstruction("PI1", "Processing Instruction 1");
  var pi2 = doc.createProcessingInstruction("PI2", "Processing Instruction 2");

  doc.documentElement.appendChild(pi1);
  doc.documentElement.appendChild(pi2);

  t.ok(pi1.compareDocumentPosition(pi2) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Second PI Follows");
  t.ok(pi2.compareDocumentPosition(pi1) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "First PI Precedes");
  t.done();
};

exports["Newly appended Text node follows older appended Text Node"] = function (t) {
  var doc = load("test");
  var t1 = doc.createTextNode("Hello,");
  var t2 = doc.createTextNode("World!");

  doc.documentElement.appendChild(t1);
  doc.documentElement.appendChild(t2);

  t.ok(t1.compareDocumentPosition(t2) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Second Text Node Follows");
  t.ok(t2.compareDocumentPosition(t1) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "First Text Node Precedes");
  t.done();
};

exports["Existing element precedes one later in the markup and vice versa"] = function (t) {
  var doc = load("test");
  var el1 = doc.getElementsByTagName("strong").item(0);
  var el2 = doc.getElementsByTagName("strong").item(1);

  t.ok(el1.compareDocumentPosition(el2) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Second Element Follows");
  t.ok(el2.compareDocumentPosition(el1) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "First Element Precedes");
  t.done();
};

exports["Element contains and precedes a decendant node and vice versa"] = function (t) {
  var doc = load("test");
  var span = doc.getElementsByTagName("span").item(0);
  var strong = doc.getElementsByTagName("strong").item(0);

  t.ok(span.compareDocumentPosition(strong) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINED_BY, "Span contains");
  t.ok(span.compareDocumentPosition(strong) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING, "Span precedes");
  t.ok(strong.compareDocumentPosition(span) & doc.parentWindow.Node.DOCUMENT_POSITION_CONTAINS, "Strong contained");
  t.ok(strong.compareDocumentPosition(span) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING, "Strong follows");
  t.done();
};

exports["A Child node precedes a child of a node later in the markup"] = function (t) {
  var doc = load("test");
  var strong = doc.getElementsByTagName("strong").item(0);
  var em = doc.getElementsByTagName("em").item(0);

  t.ok(strong.compareDocumentPosition(em) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING,
    "Second Element Follows");
  t.ok(em.compareDocumentPosition(strong) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING,
    "First Element Precedes");
  t.done();
};

exports["A newly attached child node precedes a child node later in the markup"] = function (t) {
  var doc = load("test");
  var span = doc.getElementsByTagName("strong").item(0);
  var newEl = doc.createElement("i");
  var em = doc.getElementsByTagName("em").item(0);

  span.appendChild(newEl);

  t.ok(newEl.compareDocumentPosition(em) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING,
    "Second Element Follows");
  t.ok(em.compareDocumentPosition(newEl) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING,
    "New Element Precedes");
  t.done();
};

exports["A newly attached child node follows a child node earlier in the markup"] = function (t) {
  var doc = load("test");
  var strong = doc.getElementsByTagName("strong").item(0);
  var p = doc.getElementsByTagName("p").item(0);
  var newEl = doc.createElement("i");

  p.appendChild(newEl);

  t.ok(newEl.compareDocumentPosition(strong) & doc.parentWindow.Node.DOCUMENT_POSITION_PRECEDING,
    "Second Element Precedes");
  t.ok(strong.compareDocumentPosition(newEl) & doc.parentWindow.Node.DOCUMENT_POSITION_FOLLOWING,
    "New Element Follows");
  t.done();
};

exports["Testing a node against a non node type throws an error"] = function (t) {
  var doc = load("test");

  t.throws(doc.compareDocumentPosition.bind(this, {}), "Throws");
  t.done();
};
