"use strict";

var jsdom = require("../..");

// Tests for HTMLElement.dataset
// Spec: http://html.spec.whatwg.org/#dom-dataset

exports["A node should have a dataset property"] = function (t) {
  jsdom.env("<div></div>", function (errors, window) {
    t.ifError(errors);
    var document = window.document;
    var div = document.querySelector("div");

    t.ok(div.dataset instanceof window.DOMStringMap,
         "HTMLDivElement.dataset is an instance of DOMStringMap");

    t.done();
  });
};

exports["node.dataset has setters/getters for its attributes"] = function (t) {
  var document = jsdom.jsdom("<div data-test-attr='test-value' id='bogus'></div>");
  var div = document.querySelector("div");

  t.ok(Object.keys(div.dataset).length === 1,
       "node.dataset contains only attributes prefixed with data-");

  t.ok(div.dataset['test-attr'] === 'test-value',
       "node.dataset.attrName returns the data attribute's value");

  div.dataset['test-attr'] = 'new-value';
  var refreshedDiv = document.querySelector("div");
  t.ok(refreshedDiv.dataset['test-attr'] === 'new-value',
       "node.dataset.attrName lets you set its value");

  // When Object.observe comes out, add tests for adding a new data attribute

  t.done();
};
