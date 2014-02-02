"use strict";

var testcase = require("nodeunit").testCase;
var load = require("../util").load(__dirname);

exports["setAttribute should change the first attribute, irrespective of namespace"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // setAttribute changes the first attribute, irrespective of namespace.
  body.setAttributeNS("foo", "x", "first");
  body.setAttributeNS("foo2", "x", "second");
  body.setAttribute("x", "changed");

  // Check that the attribues are as we expect.
  test.equal(body.attributes.length, 2, "two attributes");
  test.equal(body.getAttribute("x"), "changed");
  test.equal(body.getAttributeNS("foo", "x"), "changed");
  test.equal(body.getAttributeNS("foo2", "x"), "second");

  test.done();
};

exports["removeAttribute should remove the first attribute, irrespective of namespace when the first attribute is not in a namespace"] = function(test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // Set body with attributes for testing.
  body.setAttribute("x", "first");
  body.setAttributeNS("foo", "x", "second");

  // Check that the attribues are as we expect.
  test.equal(body.attributes.length, 2, "two attributes");
  test.equal(body.getAttribute("x"), "first");
  test.equal(body.getAttributeNS(null, "x"), "first");
  test.equal(body.getAttributeNS("foo", "x"), "second");

  // removeAttribute removes the first attribute with name "x" that
  // we set on the element, irrespective of namespace.
  body.removeAttribute("x");

  // The only attribute remaining should be the second one.
  test.equal(body.getAttribute("x"), "second");
  test.equal(body.getAttributeNS(null, "x"), null);
  test.equal(body.getAttributeNS("foo", "x"), "second");
  test.equal(body.attributes.length, 1, "one attribute");

  test.done();
};

exports["removeAttribute should remove the first attribute, irrespective of namespace when the first attribute is in a namespace"] = function(test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // Set body with attributes for testing.
  body.setAttributeNS("foo", "x", "first");
  body.setAttributeNS("foo2", "x", "second");

  // Check that the attribues are as we expect.
  test.equal(body.attributes.length, 2, "two attributes");
  test.equal(body.getAttribute("x"), "first");
  test.equal(body.getAttributeNS("foo", "x"), "first");
  test.equal(body.getAttributeNS("foo2", "x"), "second");

  // removeAttribute removes the first attribute with name "x" that
  // we set on the element, irrespective of namespace.
  body.removeAttribute("x");

  // The only attribute remaining should be the second one.
  test.equal(body.getAttribute("x"), "second");
  test.equal(body.getAttributeNS("foo", "x"), null);
  test.equal(body.getAttributeNS("foo2", "x"), "second");
  test.equal(body.attributes.length, 1, "one attribute");

  test.done();
};

exports["hasAttribute should check for attribute presence, irrespective of namespace"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // Set body with attributes for testing.
  body.setAttributeNS("foo", "x", "first");

  // Checks for attribute presence, irrespective of namespace.
  test.ok(body.hasAttribute("x"));

  test.done();
};

exports["an attribute set by setAttributeNS should be accessible as a field on the `attributes` field of an Element"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // This attribute should be available as body.attribute.x.
  body.setAttribute("x", "first");

  test.equal(body.attributes.length, 1, "one attribute");
  test.equal(body.attributes.x.value, "first");

  test.done();
};


exports["an attribute with a null namespace should be accessible as a field on the `attributes` field of an Element"] = function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This attribute should be available as body.attribute.x.
    body.setAttributeNS(null, "x", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.equal(body.attributes.x.value, "first");

    test.done();
};

exports["an attribute with a set namespace should be accessible as a field on the `attributes` field of an Element"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // This does not make body.attributes.x available.
  body.setAttributeNS("foo", "x", "first");

  test.equal(body.attributes.length, 1, "one attribute");
  test.equal(body.attributes.x, undefined);

  test.done();
};

exports["setting an attribute should not overwrite the methods of an `AttributeList` object"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // This does not overwrite methods.
  body.setAttributeNS("foo", "setNamedItem", "first");

  test.equal(body.attributes.length, 1, "one attribute");
  test.equal(typeof body.attributes.setNamedItem, "function");

  test.done();
};

exports["setting an attribute should not overwrite the methods defined by parents of an `AttributeList` object"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // This does not overwrite methods on parent prototypes.
  body.setAttributeNS("foo", "toString", "first");

  test.equal(body.attributes.length, 1, "one attribute");
  test.equal(typeof body.attributes.toString, "function");

  test.done();
};

exports["setting an attribute should not overwrite the fields of an `AttributeList` object"] = function (test) {
  var doc = load("minimal");
  var body = doc.getElementsByTagName("body")[0];
  test.ok(body, "body is not null");

  // This does not overwrite fields.
  body.setAttributeNS("foo", "length", "first");

  test.equal(body.attributes.length, 1, "one attribute");
  test.done();
};
