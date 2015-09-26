"use strict";
const load = require("../util").load(__dirname);
const jsdom = require("../..");

exports["setAttribute should change the first attribute, irrespective of namespace"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // setAttribute changes the first attribute, irrespective of namespace.
  body.setAttributeNS("foo", "x", "first");
  body.setAttributeNS("foo2", "x", "second");
  body.setAttribute("x", "changed");

  // Check that the attribues are as we expect.
  t.equal(body.attributes.length, 2, "two attributes");
  t.equal(body.getAttribute("x"), "changed");
  t.equal(body.getAttributeNS("foo", "x"), "changed");
  t.equal(body.getAttributeNS("foo2", "x"), "second");

  t.done();
};

exports["removeAttribute should remove the first attribute, irrespective of namespace when the first attribute is " +
"not in a namespace"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // Set body with attributes for testing.
  body.setAttribute("x", "first");
  body.setAttributeNS("foo", "x", "second");

  // Check that the attributes are as we expect.
  t.equal(body.attributes.length, 2, "two attributes");
  t.equal(body.getAttribute("x"), "first");
  t.equal(body.getAttributeNS(null, "x"), "first");
  t.equal(body.getAttributeNS("foo", "x"), "second");

  // removeAttribute removes the first attribute with name "x" that
  // we set on the element, irrespective of namespace.
  body.removeAttribute("x");

  // The only attribute remaining should be the second one.
  t.equal(body.getAttribute("x"), "second");
  t.equal(body.getAttributeNS(null, "x"), null);
  t.equal(body.getAttributeNS("foo", "x"), "second");
  t.equal(body.attributes.length, 1, "one attribute");

  t.done();
};

exports["removeAttribute should remove the first attribute, irrespective of namespace when the first attribute is " +
"in a namespace"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // Set body with attributes for testing.
  body.setAttributeNS("foo", "x", "first");
  body.setAttributeNS("foo2", "x", "second");

  // Check that the attribues are as we expect.
  t.equal(body.attributes.length, 2, "two attributes");
  t.equal(body.getAttribute("x"), "first");
  t.equal(body.getAttributeNS("foo", "x"), "first");
  t.equal(body.getAttributeNS("foo2", "x"), "second");

  // removeAttribute removes the first attribute with name "x" that
  // we set on the element, irrespective of namespace.
  body.removeAttribute("x");

  // The only attribute remaining should be the second one.
  t.equal(body.getAttribute("x"), "second");
  t.equal(body.getAttributeNS("foo", "x"), null);
  t.equal(body.getAttributeNS("foo2", "x"), "second");
  t.equal(body.attributes.length, 1, "one attribute");

  t.done();
};

exports["hasAttribute should check for attribute presence, irrespective of namespace"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // Set body with attributes for testing.
  body.setAttributeNS("foo", "x", "first");

  // Checks for attribute presence, irrespective of namespace.
  t.ok(body.hasAttribute("x"));

  t.done();
};

exports["an attribute set by setAttributeNS should be accessible as a field on the `attributes` field of an Element"] =
t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // This attribute should be available as body.attribute.x.
  body.setAttribute("x", "first");

  t.equal(body.attributes.length, 1, "one attribute");
  t.equal(body.attributes.x.value, "first");

  t.done();
};

exports["setNamedItem and removeNamedItem on `attributes` should add and remove fields from `attributes`"] = t => {
  const doc = jsdom.jsdom();
  const map = doc.body.attributes;

  t.equal(map.length, 0);

  const attr1 = doc.createAttribute("attr1");
  map.setNamedItem(attr1);
  t.equal(map.attr1, attr1);
  t.equal(map.length, 1);

  const attr2 = doc.createAttribute("attr2");
  map.setNamedItem(attr2);
  t.equal(map.attr2, attr2);
  t.equal(map.length, 2);

  const rm1 = map.removeNamedItem("attr1");
  t.equal(rm1, attr1);
  t.equal(map.length, 1);

  const rm2 = map.removeNamedItem("attr2");
  t.equal(rm2, attr2);
  t.equal(map.length, 0);

  t.done();
};

exports["setNamedItem and removeNamedItem on `attributes` should not interfere with existing method names"] = t => {
  const doc = jsdom.jsdom();
  const map = doc.body.attributes;

  const fooAttribute = doc.createAttribute("foo");
  map.setNamedItem(fooAttribute);

  const itemAttribute = doc.createAttribute("item");
  map.setNamedItem(itemAttribute);

  t.equal(map.foo, fooAttribute);
  t.equal(map.item, doc.defaultView.NamedNodeMap.prototype.item);

  map.removeNamedItem("item");
  t.equal(map.item, doc.defaultView.NamedNodeMap.prototype.item);

  t.done();
};

exports["an attribute with a null namespace should be accessible as a field on the `attributes` field of an Element"] =
t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // This attribute should be available as body.attribute.x.
  body.setAttributeNS(null, "x", "first");

  t.equal(body.attributes.length, 1, "one attribute");
  t.equal(body.attributes.x.value, "first");

  t.done();
};

exports["an attribute with a set namespace should be accessible as a field on the `attributes` field of an Element"] =
t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  body.setAttributeNS("foo", "x", "first");

  t.equal(body.attributes.length, 1, "one attribute");
  t.equal(body.attributes.x.value, "first");

  t.done();
};

exports["setting an attribute should not overwrite the methods of an `NamedNodeMap` object"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // This does not overwrite methods.
  body.setAttributeNS("foo", "setNamedItem", "first");

  t.equal(body.attributes.length, 1, "one attribute");
  t.equal(typeof body.attributes.setNamedItem, "function");

  t.done();
};

exports["setting an attribute should not overwrite the methods defined by parents of an `NamedNodeMap` object"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // This does not overwrite methods on parent prototypes.
  body.setAttributeNS("foo", "toString", "first");

  t.equal(body.attributes.length, 1, "one attribute");
  t.equal(typeof body.attributes.toString, "function");

  t.done();
};

exports["setting an attribute should not overwrite the fields of an `NamedNodeMap` object"] = t => {
  const doc = load("minimal");
  const body = doc.getElementsByTagName("body")[0];
  t.ok(body, "body is not null");

  // This does not overwrite fields.
  body.setAttributeNS("foo", "length", "first");

  t.equal(body.attributes.length, 1, "one attribute");
  t.done();
};

exports["hasAttribute should work with all attribute casings"] = t => {
  const document = jsdom.jsdom("<span data-e2='2' data-F2='3' id='t'></span>");

  t.ok(document.getElementById("t").hasAttribute("data-e2"));
  t.ok(document.getElementById("t").hasAttribute("data-E2"));
  t.ok(document.getElementById("t").hasAttribute("data-f2"));
  t.ok(document.getElementById("t").hasAttribute("data-F2"));

  t.done();
};

exports["setAttribute should lowercase before setting"] = t => {
  // https://github.com/whatwg/dom/issues/31

  const document = jsdom.jsdom();

  document.body.setAttribute("FOO", "bar");

  t.equal(document.body.getAttribute("foo"), "bar");
  t.equal(document.body.getAttribute("FOO"), "bar");
  t.equal(document.body.getAttributeNS("", "foo"), "bar");
  t.equal(document.body.getAttributeNS("", "FOO"), null);

  t.done();
};
