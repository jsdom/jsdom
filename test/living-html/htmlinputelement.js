"use strict";

var jsdom = require("../..");

exports["html input should handle value/defaultValue correctly"] = function (t) {
  var input = jsdom.jsdom("<input>").querySelector("input");

  t.strictEqual(input.value, "",
    "value should equal empty string if uninitialized");
  t.strictEqual(input.defaultValue, "",
    "defaultValue should equal empty string if uninitialized");
  t.strictEqual(input.getAttribute("value"), null,
    "value attribute should be null (uninitialized)");

  input.defaultValue = "abc";

  t.strictEqual(input.value, "abc",
    "value should default to defaultValue if undefined");
  t.strictEqual(input.defaultValue, "abc",
    "defaultValue should equal to set string");
  t.strictEqual(input.getAttribute("value"), "abc",
    "value attribute should equal to set string");

  input.value = "def";

  t.strictEqual(input.value, "def",
    "value should get changed by setter");
  t.strictEqual(input.defaultValue, "abc",
    "defaultValue should equal to set string");
  t.strictEqual(input.getAttribute("value"), "abc",
    "value attribute should not change");

  input.value = null;

  t.strictEqual(input.value, "abc",
    "resetting value should fall back to defaultValue");
  t.strictEqual(input.getAttribute("value"), "abc",
    "value attribute should not change");


  t.done();
};
