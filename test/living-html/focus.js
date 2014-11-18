"use strict";

var jsdom = require("../..");

exports["focus method exists on any html element"] = function (t) {
  t.expect(6);
  jsdom.env("<input><div></div>", function (errors, window) {
    t.ifError(errors);
    var doc = window.document;

    var input = doc.querySelector("input");
    t.ok(input.focus, "HTMLInputElement.focus exists");
    t.ok(typeof input.focus === "function", "HTMLInputElement.focus is a function");
    input.focus();
    t.strictEqual(doc.activeElement, input);

    var div = doc.querySelector("div");
    t.ok(div.focus, "HTMLDivElement.focus exists");
    t.ok(typeof div.focus === "function", "HTMLDivElement.focus is a function");

    t.done();
  });
};
