"use strict";
const jsdom = require("../..").jsdom;
const load = require("../util").load(__dirname);

// Tests for ParentNode's querySelectorAll
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselectorall

exports["querySelectorAll exists on documents"] = t => {
  const doc = load("test");

  t.ok(doc.querySelectorAll, "document.querySelectorAll exists");
  t.ok(typeof doc.querySelectorAll === "function", "document.querySelectorAll is a function");
  t.ok(doc.querySelectorAll("body"), "document.querySelectorAll can find the <body> element");
  t.strictEqual(doc.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");

  t.done();
};

exports["querySelectorAll exists on elements"] = t => {
  const doc = load("test");

  t.ok(doc.body.querySelectorAll, "document.body.querySelectorAll exists");
  t.ok(typeof doc.body.querySelectorAll === "function", "document.body.querySelectorAll is a function");
  t.strictEqual(doc.body.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");

  t.done();
};

exports["querySelectorAll exists on document fragments"] = t => {
  const doc = jsdom();
  const docFrag = doc.createDocumentFragment();

  const div = doc.createElement("div");
  div.innerHTML = "<p>Hello</p>";
  docFrag.appendChild(div);

  t.ok(docFrag.querySelectorAll, "docFrag.querySelectorAll exists");
  t.ok(typeof docFrag.querySelectorAll === "function", "docFrag.querySelectorAll is a function");
  t.strictEqual(docFrag.querySelectorAll("div").length, 1, "document.querySelectorAll can find a <div> element");
  t.strictEqual(docFrag.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");

  t.done();
};

exports["querySelectorAll converts its argument to a string before processing"] = t => {
  const doc = load("test");

  const elements = doc.querySelectorAll(["strong", "em"]);
  t.ok(elements.length === 3, "document.querySelectorAll returns all instances of <strong> and <em> elements");

  const stringifiableObj = {
    toString() {
      return "p";
    }
  };
  const expectedP = doc.querySelectorAll(stringifiableObj);
  t.ok(expectedP.length === 1, "document.querySelectorAll calls toString on any given object");

  t.done();
};
