"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const load = require("../util.js").load(__dirname);

function nodeName(node) {
  return node && node.nodeName ? node.nodeName : node;
}

describe("parent-node", () => {
  test("Document should implement ParentNode:children", () => {
    const doc = load("parent-node");

    const parent = doc;
    assert.equal(parent.children.length, 1);
    assert.equal(nodeName(parent.children[0]), "HTML");
    assert.equal(nodeName(parent.children.item(0)), "HTML");
    assert.equal(nodeName(parent.children[1]), undefined);
    assert.equal(nodeName(parent.children.item(1)), null);
    assert.equal(nodeName(parent.children.namedItem("html_id")), "HTML");
    assert.equal(nodeName(parent.children.namedItem("foo")), null);
    assert.ok(parent.children instanceof parent.defaultView.HTMLCollection, "children should be a HTMLCollection");
  });

  test("Element should implement ParentNode:children", () => {
    const doc = load("parent-node");

    const parent = doc.body;
    assert.equal(parent.children.length, 2);
    assert.equal(nodeName(parent.children[0]), "A");
    assert.equal(nodeName(parent.children.item(0)), "A");
    assert.equal(nodeName(parent.children[1]), "DIV");
    assert.equal(nodeName(parent.children.item(1)), "DIV");
    assert.equal(nodeName(parent.children[2]), undefined);
    assert.equal(nodeName(parent.children.item(2)), null);
    assert.equal(nodeName(parent.children.namedItem("a_name")), "A");
    assert.equal(nodeName(parent.children.namedItem("foo")), null);
    assert.ok(parent.children instanceof doc.defaultView.HTMLCollection, "children should be a HTMLCollection");
  });

  test("DocumentFragment should implement ParentNode:children", () => {
    const doc = load("parent-node");
    const parent = doc.createDocumentFragment();

    while (doc.body.firstChild) {
      parent.appendChild(doc.body.firstChild);
    }

    assert.equal(parent.children.length, 2);
    assert.equal(nodeName(parent.children[0]), "A");
    assert.equal(nodeName(parent.children.item(0)), "A");
    assert.equal(nodeName(parent.children[1]), "DIV");
    assert.equal(nodeName(parent.children.item(1)), "DIV");
    assert.equal(nodeName(parent.children[2]), undefined);
    assert.equal(nodeName(parent.children.item(2)), null);
    assert.equal(nodeName(parent.children.namedItem("a_name")), "A");
    assert.equal(nodeName(parent.children.namedItem("foo")), null);
    assert.ok(parent.children instanceof doc.defaultView.HTMLCollection, "children should be a HTMLCollection");
  });
  test("Document should implement ParentNode:firstElementChild", () => {
    const doc = load("parent-node");
    assert.equal(nodeName(doc.firstElementChild), "HTML");
  });

  test("Element should implement ParentNode:firstElementChild", () => {
    const doc = load("parent-node");
    assert.equal(nodeName(doc.body.firstElementChild), "A");
    assert.equal(doc.createElement("div").firstElementChild, null);
  });

  test("DocumentFragment should implement ParentNode:firstElementChild", () => {
    const doc = load("parent-node");
    const fragment = doc.createDocumentFragment();

    assert.equal(fragment.firstElementChild, null);

    while (doc.body.firstChild) {
      fragment.appendChild(doc.body.firstChild);
    }

    assert.equal(nodeName(fragment.firstElementChild), "A");
  });


  test("Document should implement ParentNode:lastElementChild", () => {
    const doc = load("parent-node");
    assert.equal(nodeName(doc.lastElementChild), "HTML");
  });

  test("Element should implement ParentNode:lastElementChild", () => {
    const doc = load("parent-node");
    assert.equal(nodeName(doc.body.lastElementChild), "DIV");
    assert.equal(doc.createElement("div").lastElementChild, null);
  });

  test("DocumentFragment should implement ParentNode:lastElementChild", () => {
    const doc = load("parent-node");
    const fragment = doc.createDocumentFragment();

    assert.equal(fragment.lastElementChild, null);

    while (doc.body.firstChild) {
      fragment.appendChild(doc.body.firstChild);
    }

    assert.equal(nodeName(fragment.lastElementChild), "DIV");
  });

  test("Document should implement ParentNode:childElementCount", () => {
    const doc = load("parent-node");
    assert.equal(doc.childElementCount, 1);
  });

  test("Element should implement ParentNode:childElementCount", () => {
    const doc = load("parent-node");
    assert.equal(doc.body.childElementCount, 2);
  });

  test("DocumentFragment should implement ParentNode:childElementCount", () => {
    const doc = load("parent-node");
    const fragment = doc.createDocumentFragment();

    while (doc.body.firstChild) {
      fragment.appendChild(doc.body.firstChild);
    }

    assert.equal(fragment.childElementCount, 2);
  });
});
