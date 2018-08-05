"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const load = require("../util.js").load(__dirname);

// Tests for ParentNode's querySelectorAll
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselectorall

describe("query-selector-all", { skipIfBrowser: true }, () => {
  specify("querySelectorAll exists on documents", () => {
    const doc = load("test");

    assert.ok(doc.querySelectorAll, "document.querySelectorAll exists");
    assert.ok(typeof doc.querySelectorAll === "function", "document.querySelectorAll is a function");
    assert.ok(doc.querySelectorAll("body"), "document.querySelectorAll can find the <body> element");
    assert.strictEqual(doc.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");
  });

  specify("querySelectorAll exists on elements", () => {
    const doc = load("test");

    assert.ok(doc.body.querySelectorAll, "document.body.querySelectorAll exists");
    assert.ok(typeof doc.body.querySelectorAll === "function", "document.body.querySelectorAll is a function");
    assert.strictEqual(doc.body.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");
  });

  specify("querySelectorAll exists on document fragments", () => {
    const doc = (new JSDOM()).window.document;
    const docFrag = doc.createDocumentFragment();

    const div = doc.createElement("div");
    div.innerHTML = "<p>Hello</p>";
    docFrag.appendChild(div);

    assert.ok(docFrag.querySelectorAll, "docFrag.querySelectorAll exists");
    assert.ok(typeof docFrag.querySelectorAll === "function", "docFrag.querySelectorAll is a function");
    assert.strictEqual(docFrag.querySelectorAll("div").length, 1, "document.querySelectorAll can find a <div> element");
    assert.strictEqual(docFrag.querySelectorAll("p").length, 1, "document.querySelectorAll can find a <p> element");
  });

  specify(
    "querySelectorAll converts its argument to a string before processing",
    () => {
      const doc = load("test");

      const elements = doc.querySelectorAll(["strong", "em"]);
      assert.ok(elements.length === 3, "document.querySelectorAll returns all instances of <strong> and <em> elements");

      const stringifiableObj = {
        toString() {
          return "p";
        }
      };
      const expectedP = doc.querySelectorAll(stringifiableObj);
      assert.ok(expectedP.length === 1, "document.querySelectorAll calls toString on any given object");
    }
  );
});
