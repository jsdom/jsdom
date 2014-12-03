"use strict";

var jsdom = require("../..");

exports["html option should handle selected/defaultSelected correctly"] = function (t) {
  var doc = jsdom.jsdom('<html><head></head><body></body></html>');
  var option = doc.createElement('option');

  t.strictEqual(option.selected, false,
    'selectedness is false by default');

  option.setAttribute('selected', 'selected');
  t.strictEqual(option.selected, true,
    'selected IDL must return the current selectedness');

  option.removeAttribute('selected');
  t.strictEqual(option.selected, false,
    'dirtiness is still false, the selectedness should have been changed');

  option.selected = false; // sets the element's dirtiness flag to true
  t.strictEqual(option.selected, false,
    'on setting, the selected IDL must set the element\'s selectedness to the new value');

  option.setAttribute('selected', 'selected');
  t.strictEqual(option.selected, false,
    'selectedness should not have been changed because dirtiness is now true');

  t.done();
};
