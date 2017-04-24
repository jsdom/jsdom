"use strict";
const load = require("../util.js").load(__dirname);

// Tests adapted from https://github.com/w3c/web-platform-tests/blob/master/dom/nodes/Node-parentElement.html
// Spec: http://dom.spec.whatwg.org/#dom-node-parentelement

exports["When the parent is null parentElement should be null"] = t => {
  const document = load("test");
  t.strictEqual(document.parentElement, null,
    "When the parent is null, parentElement is not null");
  t.done();
};

exports["When the parent is a document parentElement should be null (doctype)"] = t => {
  const document = load("test");
  t.strictEqual(document.doctype.parentElement, null,
    "When the parent is a document, parentElement is not null (doctype)");
  t.done();
};

exports["When the parent is a document parentElement should be null (element)"] = t => {
  const document = load("test");
  t.strictEqual(document.documentElement.parentElement, null,
    "When the parent is a document, parentElement is not null (element)");
  t.done();
};

exports["When the parent is a document parentElement should be null (comment)"] = t => {
  const document = load("test");
  const comment = document.appendChild(document.createComment("foo"));
  t.strictEqual(comment.parentElement, null,
    "When the parent is a document, parentElement is not null (comment)");
  t.done();
};

exports["parentElement should return null for children of DocumentFragments (element)"] = t => {
  const document = load("test");
  const df = document.createDocumentFragment();
  t.strictEqual(df.parentElement, null, "parentElement of DocumentFragment does not return null");
  const el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  df.appendChild(el);
  t.strictEqual(el.parentNode, df,
    "parentNode does return null for an child Element of DocumentFragment");
  t.strictEqual(el.parentElement, null,
    "parentElement does not return null for children of DocumentFragments (element)");
  t.done();
};


exports["parentElement should return null for children of DocumentFragments (text)"] = t => {
  const document = load("test");
  const df = document.createDocumentFragment();
  t.strictEqual(df.parentElement, null, "parentElement of DocumentFragment does not return null");
  const text = document.createTextNode("bar");
  t.strictEqual(text.parentElement, null,
    "parentElement of Text that is not attached to the DOM does not return null");
  df.appendChild(text);
  t.strictEqual(text.parentNode, df,
    "parentNode does return null for an child Text node of DocumentFragment");
  t.strictEqual(text.parentElement, null,
    "parentElement doesn't return null for children of DocumentFragments (text)");
  t.done();
};

exports["parentElement should work correctly with DocumentFragments (element)"] = t => {
  const document = load("test");
  const df = document.createDocumentFragment();
  const parent = document.createElement("div");
  df.appendChild(parent);
  const el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  parent.appendChild(el);
  t.strictEqual(el.parentElement, parent,
    "parentElement doesn't work correctly with DocumentFragments (element)");
  t.done();
};

exports["parentElement should work correctly with DocumentFragments (text)"] = t => {
  const document = load("test");
  const df = document.createDocumentFragment();
  const parent = document.createElement("div");
  df.appendChild(parent);
  const text = document.createTextNode("bar");
  t.strictEqual(text.parentElement, null,
    "parentElement of Text that is not attached to the DOM does not return null");
  parent.appendChild(text);
  t.strictEqual(text.parentElement, parent,
    "parentElement doesn't work correctly with DocumentFragments (text)");
  t.done();
};

exports["parentElement should work correctly in disconnected subtrees (element)"] = t => {
  const document = load("test");
  const parent = document.createElement("div");
  const el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  parent.appendChild(el);
  t.strictEqual(el.parentElement, parent,
    "parentElement doesn't work correctly in disconnected subtrees (element)");
  t.done();
};

exports["parentElement should work correctly in disconnected subtrees (text)"] = t => {
  const document = load("test");
  const parent = document.createElement("div");
  const text = document.createTextNode("bar");
  t.strictEqual(text.parentElement, null,
    "parentElement of Text that is not attached to the DOM does not return null");
  parent.appendChild(text);
  t.strictEqual(text.parentElement, parent,
    "parentElement doesn't work correctly in disconnected subtrees (text)");
  t.done();
};

exports["parentElement should work correctly in a document (element)"] = t => {
  const document = load("test");
  const el = document.createElement("div");
  t.strictEqual(el.parentElement, null,
    "parentElement of Element that is not attached to the DOM does not return null");
  document.body.appendChild(el);
  t.strictEqual(el.parentElement, document.body,
    "parentElement doesn't work correctly in a document (element)");
  t.done();
};
