"use strict";

const load = require("../util").load(__dirname);

function nodeName(node) {
  return node && node.nodeName ? node.nodeName : node;
}

exports["Document should implement ParentNode:children"] = function (t) {
  const doc = load("parent-node");

  const parent = doc;
  t.strictEqual(parent.children.length, 1);
  t.strictEqual(nodeName(parent.children[0]), "HTML");
  t.strictEqual(nodeName(parent.children.item(0)), "HTML");
  t.strictEqual(nodeName(parent.children[1]), undefined);
  t.strictEqual(nodeName(parent.children.item(1)), null);
  t.strictEqual(nodeName(parent.children.namedItem("html_id")), "HTML");
  t.strictEqual(nodeName(parent.children.namedItem("foo")), null);
  t.ok(parent.children instanceof parent.defaultView.HTMLCollection, "children should be a HTMLCollection");
  t.done();
};

exports["Element should implement ParentNode:children"] = function (t) {
  const doc = load("parent-node");

  const parent = doc.body;
  t.strictEqual(parent.children.length, 2);
  t.strictEqual(nodeName(parent.children[0]), "A");
  t.strictEqual(nodeName(parent.children.item(0)), "A");
  t.strictEqual(nodeName(parent.children[1]), "DIV");
  t.strictEqual(nodeName(parent.children.item(1)), "DIV");
  t.strictEqual(nodeName(parent.children[2]), undefined);
  t.strictEqual(nodeName(parent.children.item(2)), null);
  t.strictEqual(nodeName(parent.children.namedItem("a_name")), "A");
  t.strictEqual(nodeName(parent.children.namedItem("foo")), null);
  t.ok(parent.children instanceof doc.defaultView.HTMLCollection, "children should be a HTMLCollection");
  t.done();
};

exports["DocumentFragment should implement ParentNode:children"] = function (t) {
  const doc = load("parent-node");
  const parent = doc.createDocumentFragment();

  while (doc.body.firstChild) {
    parent.appendChild(doc.body.firstChild);
  }

  t.strictEqual(parent.children.length, 2);
  t.strictEqual(nodeName(parent.children[0]), "A");
  t.strictEqual(nodeName(parent.children.item(0)), "A");
  t.strictEqual(nodeName(parent.children[1]), "DIV");
  t.strictEqual(nodeName(parent.children.item(1)), "DIV");
  t.strictEqual(nodeName(parent.children[2]), undefined);
  t.strictEqual(nodeName(parent.children.item(2)), null);
  t.strictEqual(nodeName(parent.children.namedItem("a_name")), "A");
  t.strictEqual(nodeName(parent.children.namedItem("foo")), null);
  t.ok(parent.children instanceof doc.defaultView.HTMLCollection, "children should be a HTMLCollection");
  t.done();
};
