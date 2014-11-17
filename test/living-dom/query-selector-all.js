"use strict";

var load = require("../util").load(__dirname);

// Tests for ParentNode's querySelector
// Spec: https://dom.spec.whatwg.org/#dom-parentnode-queryselectorall

exports["querySelectorAll exists on any given node"] = function (t) {
  var doc = load("test");

  t.ok(doc.querySelectorAll, "document.querySelectorAll exists");
  t.ok(typeof doc.querySelectorAll === "function", "document.querySelectorAll is a function");
  t.ok(doc.querySelectorAll("body"), "document.querySelectorAll can find the body element");
  t.ok(doc.querySelectorAll("p"), "document.querySelectorAll can find a 'p' element");

  t.done();
};

exports["querySelectorAll converts its argument to a string before processing"] = function (t) {
  var doc = load("test");

  var elements = doc.querySelectorAll(["strong", "em"]);
  t.ok(elements.length === 3, "document.querySelectorAll returns all instances of <strong> and <em> elements");

  var expectedP = doc.querySelectorAll({ toString: function () { return 'p'; } });
  t.ok(expectedP.length === 1, "document.querySelectorAll calls toString on any given object");

  t.done();
};
