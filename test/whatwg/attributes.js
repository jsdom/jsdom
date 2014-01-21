var testcase = require('nodeunit').testCase;
var fs = require('fs');
var path = require('path');
var jsdom = require("../../lib/jsdom");
var toFileUrl = require("../util").toFileUrl(__dirname);

var fileCache = {};
var load = function(name, options) {
  if (!options) {
    options = {};
  }

  var file = path.resolve(__dirname, "files/" + name + ".html");

  if(!options.url) {
    options.url = toFileUrl(file);
  }

  var contents = fileCache[file] || fs.readFileSync(file, 'utf8'),
      doc      = jsdom.jsdom(null, null, options),
      window   = doc.createWindow();

  doc.parent = window;
  window.loadComplete = function() {};

  doc.innerHTML = contents;
  fileCache[file] = contents;
  return doc;
};

exports.tests = {
  setAttribute01: function (test) {
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
  },
  removeAttribute01: function(test) {
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
  },
  removeAttribute02: function(test) {
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
  },
  hasAttribute01: function(test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // Set body with attributes for testing.
    body.setAttributeNS("foo", "x", "first");

    // Checks for attribute presence, irrespective of namespace.
    test.ok(body.hasAttribute("x"));

    test.done();
  },
  indexing01: function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This attribute should be available as body.attribute.x.
    body.setAttribute("x", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.equal(body.attributes.x.value, "first");

    test.done();
  },
  indexing02: function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This attribute should be available as body.attribute.x.
    body.setAttributeNS(null, "x", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.equal(body.attributes.x.value, "first");

    test.done();
  },
  indexing03: function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This does not make body.attributes.x available.
    body.setAttributeNS("foo", "x", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.equal(body.attributes.x, undefined);

    test.done();
  },
  indexing04: function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This does not overwrite methods.
    body.setAttributeNS("foo", "setNamedItem", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.equal(typeof body.attributes.setNamedItem, "function");

    test.done();
  },
  indexing05: function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This does not overwrite methods on parent prototypes.
    body.setAttributeNS("foo", "toString", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.equal(typeof body.attributes.toString, "function");

    test.done();
  },
  indexing06: function (test) {
    var doc = load("minimal");
    var body = doc.getElementsByTagName("body")[0];
    test.ok(body, "body is not null");

    // This does not overwrite fields.
    body.setAttributeNS("foo", "length", "first");

    test.equal(body.attributes.length, 1, "one attribute");
    test.done();
  }
};
