"use strict";
const load = require("../util").load(__dirname);
const jsdom = require("../..");

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
