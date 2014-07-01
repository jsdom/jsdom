"use strict";

var load = require("../util").load(__dirname);

/**
 * Tests for the Living Standard implementation of compareDocumentPosition
 * @see http://dom.spec.whatwg.org/#dom-node-comparedocumentposition
 */

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


exports["Two document nodes obtained from the same document are disconnected & implementation specific"] = function (t) {
  var docA = load("test");
  var docB = load("test");

  t.ok(docA.compareDocumentPosition(docB) & doc.parentWindow.Node.DOCUMENT_POSITION_DISCONNECTED, "Disconnected");
  t.ok(docA.compareDocumentPosition(docB) & doc.parentWindow.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC,
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


/**
 * Tests for node.contains
 * @see  http://dom.spec.whatwg.org/#dom-node-contains
 */

exports["A node should contain its document type"] = function (t) {
  var doc = load("test"),
      doctype = doc.doctype;

  t.ok(doc.contains(doctype), "Document contains its DocumentType");
  t.ok(!doctype.contains(doc), "DocumentType does not contain its Document");
  t.done();
};


exports["Check that a Document is an inclusive descendant of itself"] = function (t) {
  var doc = load("test");
  t.ok(doc.contains(doc), "Document contains itself");
  t.done();
};


exports["Check that a document contains its document element but not the reverse"] = function (t) {
  var doc = load("test"),
      docElement = doc.documentElement;

  t.ok(doc.contains(docElement), "Document contains its DocumentElement");
  t.ok(!docElement.contains(doc), "Document Element does not contain its Document");
  t.done();
};


exports["Check that a DocumentElement contains a newly created and appended element"] = function (t) {
  var doc = load("test"),
  docElement = doc.documentElement,
  newElement = doc.createElementNS("http://www.w3.org/1999/xhtml","br");

  docElement.appendChild(newElement);

  t.ok(docElement.contains(newElement), "DocumentElement contains new appended element");
  t.ok(!newElement.contains(docElement), "New appended Element does not contain DocumentElement");
  t.done();
};


exports["Check that the Document contains a descendant node"] = function (t) {
  var doc = load("test"),
  elem = doc.getElementsByTagName("p").item(0);

  t.ok(doc.contains(elem), "Document contains a descendant node");
  t.ok(!elem.contains(doc), "Descentant node does not contain Document");
  t.done();
};


exports["Check that an element contains a new appended element"] = function (t) {
  var doc = load("test"),
  elem = doc.getElementsByTagName("p").item(0),
  newElem = doc.createElementNS("http://www.w3.org/1999/xhtml","br");

  elem.appendChild(newElem);

  t.ok(elem.contains(newElem), "Element contains new appended Element");
  t.ok(!newElem.contains(elem), "New Element does not contain Element");
  t.done();
};


exports["Check that the Document contains a newly attached ProcessingInstruction"] = function (t) {
  var doc = load("test"),
  pi = doc.createProcessingInstruction("PITarget", "PIDATA");

  doc.appendChild(pi);
  t.ok(doc.contains(pi), "Document contains new attached processing instruction");
  t.ok(!pi.contains(doc), "Processing Instruction does not contain doc");
  t.done();
};


exports["Check that the document contains a new attached Comment"] = function (t) {
  var doc = load("test"),
  elem = doc.getElementsByTagName("p").item(0),
  comment = doc.createComment("Another Comment");

  elem.appendChild(comment);

  t.ok(doc.contains(comment), "Document contains new attached Comment");
  t.ok(!comment.contains(doc), "Comment does not contain Document");
  t.done();
};


exports["Check that a DocumentFragment contains a child node"] = function (t) {
  var doc = load("test"),
  docElement = doc.documentElement,
  docFragment = doc.createDocumentFragment();

  docFragment.appendChild(docElement);

  var docFragmentChild = docFragment.firstChild;

  t.ok(docFragment.contains(docFragmentChild), "DocumentFragment contains child");
  t.ok(!docFragmentChild.contains(docFragment), "DocumentFragment child does not contain DocumentFragment");
  t.done();
};


exports["Check that created and attached sibling ProcessingInstructions do not contain one another"] = function (t) {
  var doc = load("test"),
  pi1 = doc.createProcessingInstruction("PI1", ""),
  pi2 = doc.createProcessingInstruction("PI2", "");

  doc.appendChild(pi1);
  doc.appendChild(pi2);

  t.ok(!pi1.contains(pi2),
    "Attached ProcessingInstruction does not contain second attached ProcessingInstruction");
  t.ok(!pi2.contains(pi1),
    "Second attached ProcessingInstruction does not contain first attached ProcessingInstruction");
  t.done();
};


exports["Check that two created sibling ProcessingInstruction nodes do not contain one another."] = function (t) {
  var doc = load("test"),
  docElement = doc.documentElement,
  txt1 = doc.createTextNode("T1"),
  txt2 = doc.createTextNode("T2");

  docElement.appendChild(txt1);
  docElement.appendChild(txt2);

  t.ok(!txt1.contains(txt2), "First attached TextNode does not contain second attached TextNode");
  t.ok(!txt2.contains(txt1), "Second attached TextNode does not contain first attached TextNode");
  t.done();
};


exports["Check that the Text node children of two sibling elements do not contain one another."] = function (t) {
  var doc = load("test"),
  txt1 = doc.getElementsByTagName("span").item(0).firstChild,
  txt2 = doc.getElementsByTagName("p").item(0).firstChild;

  t.ok(!txt1.contains(txt2),
    "Text node child of first sibling Element does not contain Text node child of second sibling Element");
  t.ok(!txt2.contains(txt1),
    "Text node child of second sibling Element does not contain Text node child of first sibling Element");
  t.done();
};


exports["Check that an element does not contain a following element and vice versa"] = function (t) {
  var doc = load("test"),
  span = doc.getElementsByTagName("span").item(0),
  p = doc.getElementsByTagName("p").item(0);

  t.ok(!span.contains(p), "Element does not contain following element");
  t.ok(!p.contains(span), "Element does not contain previous element");
  t.done();
};


exports["Check that a document does not contain null"] = function (t) {
  var doc = load("test");

  t.ok(!doc.contains(null), "Document does not contain null");
  t.done();
};


exports["Check that a DocumentType does not contain null"] = function (t) {
  var doc = load("test");

  t.ok(!doc.doctype.contains(null), "Doctype does not contain null");
  t.done();
};


exports["Check that an existing node does not contain null"] = function (t) {
  var ele = load("test").querySelectorAll("p").item(0);

  t.ok(!ele.contains(null), "Element does not contain null");
  t.done();
};


exports["Test that a document does not contain an unattached DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();

  t.ok(!doc.contains(fragment), "Document does not contain fragment");
  t.ok(!fragment.contains(doc), "Fragment does not contain document");
  t.done();
};


exports["Test that a DocumentType does not contain an unattached DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();

  t.ok(!doc.doctype.contains(fragment), "DocumentType does not contain DocumentFragment");
  t.ok(!fragment.contains(doc.doctype), "DocumentFragment does not contain DocumentType");
  t.done();
};


exports["Test that an existing element does not contain an unattached DocumentFragment"] = function (t) {
  var doc = load("test");
  var fragment = doc.createDocumentFragment();
  var span = doc.querySelectorAll("span").item(0);

  t.ok(!span.contains(fragment), "Element does not contain DocumentFragment");
  t.ok(!fragment.contains(span), "DocumentFragment does not contain Element");
  t.done();
};

exports["Test that an unattached element does not contain another unattached element"] = function (t) {
  var doc = load("test");
  var e1 = doc.createElement("p");
  var e2 = doc.createElement("p2");

  t.ok(!e1.contains(e2), "Element does not contain second Element");
  t.ok(!e2.contains(e1), "Second Element does not contain Element");
  t.done();
};


/**
 * Node.parentElement
 *
 * Tests adapted from https://github.com/w3c/web-platform-tests/blob/master/dom/nodes/Node-parentElement.html
 * Spec: http://dom.spec.whatwg.org/#dom-node-parentelement
 */

exports["Node.parentElement: When the parent is null parentElement should be null"] = function (t) {
    var document = load('test');
    t.strictEqual(document.parentElement, null,
        "When the parent is null, parentElement is not null");
    t.done();
};

exports["Node.parentElement: When the parent is a document parentElement should be null (doctype)"] = function (t) {
    var document = load('test');
    t.strictEqual(document.doctype.parentElement, null,
        "When the parent is a document, parentElement is not null (doctype)");
    t.done();
};

exports["Node.parentElement: When the parent is a document parentElement should be null (element)"] = function (t) {
    var document = load('test');
    t.strictEqual(document.documentElement.parentElement, null,
        "When the parent is a document, parentElement is not null (element)");
    t.done();
};

exports["Node.parentElement: When the parent is a document parentElement should be null (comment)"] = function (t) {
    var document = load('test');
    var comment = document.appendChild(document.createComment("foo"));
    t.strictEqual(comment.parentElement, null,
        "When the parent is a document, parentElement is not null (comment)");
    t.done();
};

exports["Node.parentElement: parentElement should return null for children of DocumentFragments (element)"]
    = function (t) {
  var document = load('test');
  var df = document.createDocumentFragment();
  t.strictEqual(df.parentElement, null, "parentElement of DocumentFragment does not return null");
  var el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  df.appendChild(el);
  t.strictEqual(el.parentNode, df,
    "parentNode does return null for an child Element of DocumentFragment");
  t.strictEqual(el.parentElement, null,
    "parentElement does not return null for children of DocumentFragments (element)");
  t.done();
};


exports["Node.parentElement: parentElement should return null for children of DocumentFragments (text)"]
    = function (t) {
  var document = load('test');
  var df = document.createDocumentFragment();
  t.strictEqual(df.parentElement, null, "parentElement of DocumentFragment does not return null");
  var text = document.createTextNode("bar");
  t.strictEqual(text.parentElement, null,
    "parentElement of Text that is not attached to the DOM does not return null");
  df.appendChild(text);
  t.strictEqual(text.parentNode, df,
    "parentNode does return null for an child Text node of DocumentFragment");
  t.strictEqual(text.parentElement, null,
    "parentElement doesn't return null for children of DocumentFragments (text)");
  t.done();
};

exports["Node.parentElement: parentElement should work correctly with DocumentFragments (element)"] = function (t) {
    var document = load('test');
    var df = document.createDocumentFragment();
    var parent = document.createElement("div");
    df.appendChild(parent);
    var el = document.createElement("div");
    t.strictEqual(el.parentElement, null,
      "parentElement of Element that is not attached to the DOM does not return null");
    parent.appendChild(el);
    t.strictEqual(el.parentElement, parent,
      "parentElement doesn't work correctly with DocumentFragments (element)");
    t.done();
};

exports["Node.parentElement: parentElement should work correctly with DocumentFragments (text)"] = function (t) {
    var document = load('test');
    var df = document.createDocumentFragment();
    var parent = document.createElement("div");
    df.appendChild(parent);
    var text = document.createTextNode("bar");
    t.strictEqual(text.parentElement, null,
      "parentElement of Text that is not attached to the DOM does not return null");
    parent.appendChild(text);
    t.strictEqual(text.parentElement, parent,
      "parentElement doesn't work correctly with DocumentFragments (text)");
    t.done();
};

exports["Node.parentElement: parentElement should work correctly in disconnected subtrees (element)"] = function (t) {
    var document = load('test');
    var parent = document.createElement("div");
    var el = document.createElement("div");
    t.strictEqual(el.parentElement, null,
      "parentElement of Element that is not attached to the DOM does not return null");
    parent.appendChild(el);
    t.strictEqual(el.parentElement, parent,
      "parentElement doesn't work correctly in disconnected subtrees (element)");
    t.done();
};

exports["Node.parentElement: parentElement should work correctly in disconnected subtrees (text)"] = function (t) {
    var document = load('test');
    var parent = document.createElement("div");
    var text = document.createTextNode("bar");
    t.strictEqual(text.parentElement, null,
      "parentElement of Text that is not attached to the DOM does not return null");
    parent.appendChild(text);
    t.strictEqual(text.parentElement, parent,
      "parentElement doesn't work correctly in disconnected subtrees (text)");
    t.done();
};

exports["Node.parentElement: parentElement should work correctly in a document (element)"] = function (t) {
    var document = load('test');
    var el = document.createElement("div");
    t.strictEqual(el.parentElement, null,
      "parentElement of Element that is not attached to the DOM does not return null");
    document.body.appendChild(el);
    t.strictEqual(el.parentElement, document.body,
      "parentElement doesn't work correctly in a document (element)");
    t.done();
};
