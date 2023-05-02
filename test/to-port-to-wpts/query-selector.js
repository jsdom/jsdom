"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const load = require("../util.js").load(__dirname);

// Tests for ParentNode's querySelector
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselector

describe("query-selector", () => {
  specify("querySelector exists on document fragments", () => {
    const doc = (new JSDOM()).window.document;
    const docFrag = doc.createDocumentFragment();

    const div = doc.createElement("div");
    div.innerHTML = "<p>Hello</p>";
    docFrag.appendChild(div);

    assert.ok(docFrag.querySelector, "docFrag.querySelector exists");
    assert.ok(typeof docFrag.querySelector === "function", "docFrag.querySelector is a function");
    assert.ok(docFrag.querySelector("div"), "document.querySelector can find a <div> element");
    assert.ok(docFrag.querySelector("p"), "document.querySelector can find a <p> element");
  });

  specify(
    "querySelector converts its argument to a string before processing",
    () => {
      const doc = load("test");

      const element = doc.querySelector(["strong"]);
      assert.ok(element, "document.querySelector returns the <strong> element");

      const stringifiableObj = {
        toString() {
          return "p";
        }
      };
      const expectedP = doc.querySelector(stringifiableObj);
      assert.ok(expectedP, "document.querySelector calls toString on any given object");
    }
  );
});
