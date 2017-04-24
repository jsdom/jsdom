"use strict";
const { jsdom } = require("../../lib/old-api.js");
const load = require("../util.js").load(__dirname);

// Tests for ParentNode's querySelector
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselector

exports["querySelector exists on documents"] = t => {
  const doc = load("test");

  t.ok(doc.querySelector, "document.querySelector exists");
  t.ok(typeof doc.querySelector === "function", "document.querySelector is a function");
  t.ok(doc.querySelector("body"), "document.querySelector can find the <body> element");
  t.ok(doc.querySelector("p"), "document.querySelector can find a <p> element");

  t.done();
};

exports["querySelector exists on elements"] = t => {
  const doc = load("test");

  t.ok(doc.body.querySelector, "document.body.querySelector exists");
  t.ok(typeof doc.body.querySelector === "function", "document.body.querySelector is a function");
  t.ok(doc.body.querySelector("p"), "document.body.querySelector can find a <p> element");

  t.done();
};

exports["querySelector exists on document fragments"] = t => {
  const doc = jsdom();
  const docFrag = doc.createDocumentFragment();

  const div = doc.createElement("div");
  div.innerHTML = "<p>Hello</p>";
  docFrag.appendChild(div);

  t.ok(docFrag.querySelector, "docFrag.querySelector exists");
  t.ok(typeof docFrag.querySelector === "function", "docFrag.querySelector is a function");
  t.ok(docFrag.querySelector("div"), "document.querySelector can find a <div> element");
  t.ok(docFrag.querySelector("p"), "document.querySelector can find a <p> element");

  t.done();
};

exports["querySelector converts its argument to a string before processing"] = t => {
  const doc = load("test");

  const element = doc.querySelector(["strong"]);
  t.ok(element, "document.querySelector returns the <strong> element");

  const stringifiableObj = {
    toString() {
      return "p";
    }
  };
  const expectedP = doc.querySelector(stringifiableObj);
  t.ok(expectedP, "document.querySelector calls toString on any given object");

  t.done();
};
