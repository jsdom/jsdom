"use strict";

var load = require("../util").load(__dirname);

// Tests for node.contains
// Spec: http://dom.spec.whatwg.org/#dom-node-contains

exports["A node should contain its document type"] = function (t) {
  var doc = load("test");
  var doctype = doc.doctype;

  t.ok(doc.contains(doctype), "Document contains its DocumentType");
  t.ok(!doctype.contains(doc), "DocumentType does not contain its Document");
  t.done();
};

exports["A Document should be an inclusive descendant of itself"] = function (t) {
  var doc = load("test");

  t.ok(doc.contains(doc), "Document contains itself");
  t.done();
};

exports["A document should contain its document element but not the reverse"] = function (t) {
  var doc = load("test");
  var docElement = doc.documentElement;

  t.ok(doc.contains(docElement), "Document contains its DocumentElement");
  t.ok(!docElement.contains(doc), "Document Element does not contain its Document");
  t.done();
};

exports["A DocumentElement should contain a newly created and appended element"] = function (t) {
  var doc = load("test");
  var docElement = doc.documentElement;
  var newElement = doc.createElementNS("http://www.w3.org/1999/xhtml", "br");

  docElement.appendChild(newElement);

  t.ok(docElement.contains(newElement), "DocumentElement contains new appended element");
  t.ok(!newElement.contains(docElement), "New appended Element does not contain DocumentElement");
  t.done();
};

exports["The Document should contain a descendant node"] = function (t) {
  var doc = load("test");
  var elem = doc.getElementsByTagName("p").item(0);

  t.ok(doc.contains(elem), "Document contains a descendant node");
  t.ok(!elem.contains(doc), "Descentant node does not contain Document");
  t.done();
};

exports["An element should contain a new appended element"] = function (t) {
  var doc = load("test");
  var elem = doc.getElementsByTagName("p").item(0);
  var newElem = doc.createElementNS("http://www.w3.org/1999/xhtml", "br");

  elem.appendChild(newElem);

  t.ok(elem.contains(newElem), "Element contains new appended Element");
  t.ok(!newElem.contains(elem), "New Element does not contain Element");
  t.done();
};

exports["The Document should contain a newly attached ProcessingInstruction"] = function (t) {
  var doc = load("test");
  var pi = doc.createProcessingInstruction("PITarget", "PIDATA");

  doc.appendChild(pi);
  t.ok(doc.contains(pi), "Document contains new attached processing instruction");
  t.ok(!pi.contains(doc), "Processing Instruction does not contain doc");
  t.done();
};

exports["The document should contain a new attached Comment"] = function (t) {
  var doc = load("test");
  var elem = doc.getElementsByTagName("p").item(0);
  var comment = doc.createComment("Another Comment");

  elem.appendChild(comment);

  t.ok(doc.contains(comment), "Document contains new attached Comment");
  t.ok(!comment.contains(doc), "Comment does not contain Document");
  t.done();
};

exports["A DocumentFragment should contain a child node"] = function (t) {
  var doc = load("test");
  var docElement = doc.documentElement;
  var docFragment = doc.createDocumentFragment();

  docFragment.appendChild(docElement);

  var docFragmentChild = docFragment.firstChild;

  t.ok(docFragment.contains(docFragmentChild), "DocumentFragment contains child");
  t.ok(!docFragmentChild.contains(docFragment), "DocumentFragment child does not contain DocumentFragment");
  t.done();
};

exports["Created and attached sibling ProcessingInstructions should not not contain one another"] = function (t) {
  var doc = load("test");
  var pi1 = doc.createProcessingInstruction("PI1", "");
  var pi2 = doc.createProcessingInstruction("PI2", "");

  doc.appendChild(pi1);
  doc.appendChild(pi2);

  t.ok(!pi1.contains(pi2),
    "Attached ProcessingInstruction does not contain second attached ProcessingInstruction");
  t.ok(!pi2.contains(pi1),
    "Second attached ProcessingInstruction does not contain first attached ProcessingInstruction");
  t.done();
};

exports["Two created sibling ProcessingInstruction nodes should not contain one another"] = function (t) {
  var doc = load("test");
  var docElement = doc.documentElement;
  var txt1 = doc.createTextNode("T1");
  var txt2 = doc.createTextNode("T2");

  docElement.appendChild(txt1);
  docElement.appendChild(txt2);

  t.ok(!txt1.contains(txt2), "First attached TextNode does not contain second attached TextNode");
  t.ok(!txt2.contains(txt1), "Second attached TextNode does not contain first attached TextNode");
  t.done();
};

exports["The Text node children of two sibling elements should not contain one another"] = function (t) {
  var doc = load("test");
  var txt1 = doc.getElementsByTagName("span").item(0).firstChild;
  var txt2 = doc.getElementsByTagName("p").item(0).firstChild;

  t.ok(!txt1.contains(txt2),
    "Text node child of first sibling Element does not contain Text node child of second sibling Element");
  t.ok(!txt2.contains(txt1),
    "Text node child of second sibling Element does not contain Text node child of first sibling Element");
  t.done();
};

exports["An element should not contain a following element and vice versa"] = function (t) {
  var doc = load("test");
  var span = doc.getElementsByTagName("span").item(0);
  var p = doc.getElementsByTagName("p").item(0);

  t.ok(!span.contains(p), "Element does not contain following element");
  t.ok(!p.contains(span), "Element does not contain previous element");
  t.done();
};

exports["A document should not contain null"] = function (t) {
  var doc = load("test");

  t.ok(!doc.contains(null), "Document does not contain null");
  t.done();
};

exports["A DocumentType should not contain null"] = function (t) {
  var doc = load("test");

  t.ok(!doc.doctype.contains(null), "Doctype does not contain null");
  t.done();
};

exports["An existing node should not contain null"] = function (t) {
  var ele = load("test").querySelectorAll("p").item(0);

  t.ok(!ele.contains(null), "Element does not contain null");
  t.done();
};

exports["A document should not contain an unattached DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();

  t.ok(!doc.contains(fragment), "Document does not contain fragment");
  t.ok(!fragment.contains(doc), "Fragment does not contain document");
  t.done();
};

exports["A DocumentType should not contain an unattached DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();

  t.ok(!doc.doctype.contains(fragment), "DocumentType does not contain DocumentFragment");
  t.ok(!fragment.contains(doc.doctype), "DocumentFragment does not contain DocumentType");
  t.done();
};

exports["An existing element should not contain an unattached DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();
  var span = doc.querySelectorAll("span").item(0);

  t.ok(!span.contains(fragment), "Element does not contain DocumentFragment");
  t.ok(!fragment.contains(span), "DocumentFragment does not contain Element");
  t.done();
};

exports["An unattached element should not contain another unattached element"] = function (t) {
  var doc = load("test");
  var e1 = doc.createElement("p");
  var e2 = doc.createElement("p2");

  t.ok(!e1.contains(e2), "Element does not contain second Element");
  t.ok(!e2.contains(e1), "Second Element does not contain Element");
  t.done();
};

exports["Should return a boolean value"] = function (t) {
  var doc = load("test");
  var elem = doc.getElementsByTagName("p").item(0);
  var newElem = doc.createElementNS("http://www.w3.org/1999/xhtml", "br");

  elem.appendChild(newElem);

  t.strictEqual(true, elem.contains(newElem), "Return value must be 'true' (strictly)");
  t.strictEqual(false, newElem.contains(elem), "Return value must be 'false' (strictly)");
  t.done();
};
