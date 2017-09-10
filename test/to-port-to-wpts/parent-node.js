"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const load = require("../util.js").load(__dirname);

function nodeName(node) {
  return node && node.nodeName ? node.nodeName : node;
}

describe("parent-node", { skipIfBrowser: true }, () => {
  specify("Document should implement ParentNode:children", () => {
    const doc = load("parent-node");

    const parent = doc;
    assert.strictEqual(parent.children.length, 1);
    assert.strictEqual(nodeName(parent.children[0]), "HTML");
    assert.strictEqual(nodeName(parent.children.item(0)), "HTML");
    assert.strictEqual(nodeName(parent.children[1]), undefined);
    assert.strictEqual(nodeName(parent.children.item(1)), null);
    assert.strictEqual(nodeName(parent.children.namedItem("html_id")), "HTML");
    assert.strictEqual(nodeName(parent.children.namedItem("foo")), null);
    assert.ok(parent.children instanceof parent.defaultView.HTMLCollection, "children should be a HTMLCollection");
  });

  specify("Element should implement ParentNode:children", () => {
    const doc = load("parent-node");

    const parent = doc.body;
    assert.strictEqual(parent.children.length, 2);
    assert.strictEqual(nodeName(parent.children[0]), "A");
    assert.strictEqual(nodeName(parent.children.item(0)), "A");
    assert.strictEqual(nodeName(parent.children[1]), "DIV");
    assert.strictEqual(nodeName(parent.children.item(1)), "DIV");
    assert.strictEqual(nodeName(parent.children[2]), undefined);
    assert.strictEqual(nodeName(parent.children.item(2)), null);
    assert.strictEqual(nodeName(parent.children.namedItem("a_name")), "A");
    assert.strictEqual(nodeName(parent.children.namedItem("foo")), null);
    assert.ok(parent.children instanceof doc.defaultView.HTMLCollection, "children should be a HTMLCollection");
  });

  specify("DocumentFragment should implement ParentNode:children", () => {
    const doc = load("parent-node");
    const parent = doc.createDocumentFragment();

    while (doc.body.firstChild) {
      parent.appendChild(doc.body.firstChild);
    }

    assert.strictEqual(parent.children.length, 2);
    assert.strictEqual(nodeName(parent.children[0]), "A");
    assert.strictEqual(nodeName(parent.children.item(0)), "A");
    assert.strictEqual(nodeName(parent.children[1]), "DIV");
    assert.strictEqual(nodeName(parent.children.item(1)), "DIV");
    assert.strictEqual(nodeName(parent.children[2]), undefined);
    assert.strictEqual(nodeName(parent.children.item(2)), null);
    assert.strictEqual(nodeName(parent.children.namedItem("a_name")), "A");
    assert.strictEqual(nodeName(parent.children.namedItem("foo")), null);
    assert.ok(parent.children instanceof doc.defaultView.HTMLCollection, "children should be a HTMLCollection");
  });
  specify("Document should implement ParentNode:firstElementChild", () => {
    const doc = load("parent-node");
    assert.strictEqual(nodeName(doc.firstElementChild), "HTML");
  });

  specify("Element should implement ParentNode:firstElementChild", () => {
    const doc = load("parent-node");
    assert.strictEqual(nodeName(doc.body.firstElementChild), "A");
    assert.strictEqual(doc.createElement("div").firstElementChild, null);
  });

  specify("DocumentFragment should implement ParentNode:firstElementChild", () => {
    const doc = load("parent-node");
    const fragment = doc.createDocumentFragment();

    assert.strictEqual(fragment.firstElementChild, null);

    while (doc.body.firstChild) {
      fragment.appendChild(doc.body.firstChild);
    }

    assert.strictEqual(nodeName(fragment.firstElementChild), "A");
  });


  specify("Document should implement ParentNode:lastElementChild", () => {
    const doc = load("parent-node");
    assert.strictEqual(nodeName(doc.lastElementChild), "HTML");
  });

  specify("Element should implement ParentNode:lastElementChild", () => {
    const doc = load("parent-node");
    assert.strictEqual(nodeName(doc.body.lastElementChild), "DIV");
    assert.strictEqual(doc.createElement("div").lastElementChild, null);
  });

  specify("DocumentFragment should implement ParentNode:lastElementChild", () => {
    const doc = load("parent-node");
    const fragment = doc.createDocumentFragment();

    assert.strictEqual(fragment.lastElementChild, null);

    while (doc.body.firstChild) {
      fragment.appendChild(doc.body.firstChild);
    }

    assert.strictEqual(nodeName(fragment.lastElementChild), "DIV");
  });

  specify("Document should implement ParentNode:childElementCount", () => {
    const doc = load("parent-node");
    assert.strictEqual(doc.childElementCount, 1);
  });

  specify("Element should implement ParentNode:childElementCount", () => {
    const doc = load("parent-node");
    assert.strictEqual(doc.body.childElementCount, 2);
  });

  specify("DocumentFragment should implement ParentNode:childElementCount", () => {
    const doc = load("parent-node");
    const fragment = doc.createDocumentFragment();

    while (doc.body.firstChild) {
      fragment.appendChild(doc.body.firstChild);
    }

    assert.strictEqual(fragment.childElementCount, 2);
  });
});
