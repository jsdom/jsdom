"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const load = require("../util.js").load(__dirname);

// Tests adapted from https://github.com/web-platform-tests/wpt/blob/master/dom/nodes/Node-parentElement.html
// Spec: http://dom.spec.whatwg.org/#dom-node-parentelement

describe("node-parent-element", { skipIfBrowser: true }, () => {
  specify("When the parent is null parentElement should be null", () => {
    const document = load("test");
    assert.strictEqual(
      document.parentElement, null,
      "When the parent is null, parentElement is not null"
    );
  });

  specify(
    "When the parent is a document parentElement should be null (doctype)",
    () => {
      const document = load("test");
      assert.strictEqual(
        document.doctype.parentElement, null,
        "When the parent is a document, parentElement is not null (doctype)"
      );
    }
  );

  specify(
    "When the parent is a document parentElement should be null (element)",
    () => {
      const document = load("test");
      assert.strictEqual(
        document.documentElement.parentElement, null,
        "When the parent is a document, parentElement is not null (element)"
      );
    }
  );

  specify(
    "When the parent is a document parentElement should be null (comment)",
    () => {
      const document = load("test");
      const comment = document.appendChild(document.createComment("foo"));
      assert.strictEqual(
        comment.parentElement, null,
        "When the parent is a document, parentElement is not null (comment)"
      );
    }
  );

  specify(
    "parentElement should return null for children of DocumentFragments (element)",
    () => {
      const document = load("test");
      const df = document.createDocumentFragment();
      assert.strictEqual(df.parentElement, null, "parentElement of DocumentFragment does not return null");
      const el = document.createElement("div");
      assert.strictEqual(
        el.parentElement, null,
        "parentElement of Element that is not attached to the DOM does not return null"
      );
      df.appendChild(el);
      assert.strictEqual(
        el.parentNode, df,
        "parentNode does return null for an child Element of DocumentFragment"
      );
      assert.strictEqual(
        el.parentElement, null,
        "parentElement does not return null for children of DocumentFragments (element)"
      );
    }
  );


  specify(
    "parentElement should return null for children of DocumentFragments (text)",
    () => {
      const document = load("test");
      const df = document.createDocumentFragment();
      assert.strictEqual(df.parentElement, null, "parentElement of DocumentFragment does not return null");
      const text = document.createTextNode("bar");
      assert.strictEqual(
        text.parentElement, null,
        "parentElement of Text that is not attached to the DOM does not return null"
      );
      df.appendChild(text);
      assert.strictEqual(
        text.parentNode, df,
        "parentNode does return null for an child Text node of DocumentFragment"
      );
      assert.strictEqual(
        text.parentElement, null,
        "parentElement doesn't return null for children of DocumentFragments (text)"
      );
    }
  );

  specify(
    "parentElement should work correctly with DocumentFragments (element)",
    () => {
      const document = load("test");
      const df = document.createDocumentFragment();
      const parent = document.createElement("div");
      df.appendChild(parent);
      const el = document.createElement("div");
      assert.strictEqual(
        el.parentElement, null,
        "parentElement of Element that is not attached to the DOM does not return null"
      );
      parent.appendChild(el);
      assert.strictEqual(
        el.parentElement, parent,
        "parentElement doesn't work correctly with DocumentFragments (element)"
      );
    }
  );

  specify(
    "parentElement should work correctly with DocumentFragments (text)",
    () => {
      const document = load("test");
      const df = document.createDocumentFragment();
      const parent = document.createElement("div");
      df.appendChild(parent);
      const text = document.createTextNode("bar");
      assert.strictEqual(
        text.parentElement, null,
        "parentElement of Text that is not attached to the DOM does not return null"
      );
      parent.appendChild(text);
      assert.strictEqual(
        text.parentElement, parent,
        "parentElement doesn't work correctly with DocumentFragments (text)"
      );
    }
  );

  specify(
    "parentElement should work correctly in disconnected subtrees (element)",
    () => {
      const document = load("test");
      const parent = document.createElement("div");
      const el = document.createElement("div");
      assert.strictEqual(
        el.parentElement, null,
        "parentElement of Element that is not attached to the DOM does not return null"
      );
      parent.appendChild(el);
      assert.strictEqual(
        el.parentElement, parent,
        "parentElement doesn't work correctly in disconnected subtrees (element)"
      );
    }
  );

  specify(
    "parentElement should work correctly in disconnected subtrees (text)",
    () => {
      const document = load("test");
      const parent = document.createElement("div");
      const text = document.createTextNode("bar");
      assert.strictEqual(
        text.parentElement, null,
        "parentElement of Text that is not attached to the DOM does not return null"
      );
      parent.appendChild(text);
      assert.strictEqual(
        text.parentElement, parent,
        "parentElement doesn't work correctly in disconnected subtrees (text)"
      );
    }
  );

  specify("parentElement should work correctly in a document (element)", () => {
    const document = load("test");
    const el = document.createElement("div");
    assert.strictEqual(
      el.parentElement, null,
      "parentElement of Element that is not attached to the DOM does not return null"
    );
    document.body.appendChild(el);
    assert.strictEqual(
      el.parentElement, document.body,
      "parentElement doesn't work correctly in a document (element)"
    );
  });
});
