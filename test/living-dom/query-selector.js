"use strict";

var load = require("../util").load(__dirname);

// Tests for ParentNode's querySelector
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselector

exports["querySelector exists on any given node"] = function (t) {
  var doc = load("test");

  t.ok(doc.querySelector, "document.querySelector exists");
  t.ok(typeof doc.querySelector === "function", "document.querySelector is a function");
  t.ok(doc.querySelector("body"), "document.querySelector can find the body element");
  t.ok(doc.querySelector("p"), "document.querySelector can find a 'p' element");

  t.done();
};
