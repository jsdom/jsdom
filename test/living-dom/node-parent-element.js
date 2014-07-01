"use strict";

var load = require("../util").load(__dirname);

// Tests adapted from https://github.com/w3c/web-platform-tests/blob/master/dom/nodes/Node-parentElement.html
// Spec: http://dom.spec.whatwg.org/#dom-node-parentelement

exports["When the parent is null parentElement should be null"] = function (t) {
  var document = load("test");
  t.strictEqual(document.parentElement, null,
    "When the parent is null, parentElement is not null");
  t.done();
};

exports["When the parent is a document parentElement should be null (doctype)"] = function (t) {
  var document = load("test");
  t.strictEqual(document.doctype.parentElement, null,
    "When the parent is a document, parentElement is not null (doctype)");
  t.done();
};

exports["When the parent is a document parentElement should be null (element)"] = function (t) {
  var document = load("test");
  t.strictEqual(document.documentElement.parentElement, null,
    "When the parent is a document, parentElement is not null (element)");
  t.done();
};

exports["When the parent is a document parentElement should be null (comment)"] = function (t) {
  var document = load("test");
  var comment = document.appendChild(document.createComment("foo"));
  t.strictEqual(comment.parentElement, null,
    "When the parent is a document, parentElement is not null (comment)");
  t.done();
};

exports["parentElement should return null for children of DocumentFragments (element)"] = function (t) {
  var document = load("test");
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


exports["parentElement should return null for children of DocumentFragments (text)"] = function (t) {
  var document = load("test");
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

exports["parentElement should work correctly with DocumentFragments (element)"] = function (t) {
  var document = load("test");
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

exports["parentElement should work correctly with DocumentFragments (text)"] = function (t) {
  var document = load("test");
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

exports["parentElement should work correctly in disconnected subtrees (element)"] = function (t) {
  var document = load("test");
  var parent = document.createElement("div");
  var el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  parent.appendChild(el);
  t.strictEqual(el.parentElement, parent,
    "parentElement doesn't work correctly in disconnected subtrees (element)");
  t.done();
};

exports["parentElement should work correctly in disconnected subtrees (text)"] = function (t) {
  var document = load("test");
  var parent = document.createElement("div");
  var text = document.createTextNode("bar");
  t.strictEqual(text.parentElement, null,
    "parentElement of Text that is not attached to the DOM does not return null");
  parent.appendChild(text);
  t.strictEqual(text.parentElement, parent,
    "parentElement doesn't work correctly in disconnected subtrees (text)");
  t.done();
};

exports["parentElement should work correctly in a document (element)"] = function (t) {
  var document = load("test");
  var el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  document.body.appendChild(el);
  t.strictEqual(el.parentElement, document.body,
    "parentElement doesn't work correctly in a document (element)");
  t.done();
};
