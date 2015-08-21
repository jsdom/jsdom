"use strict";

var jsdom = require("../..").jsdom;

// Tests for window.atob and window.btoa
// Spec: https://html.spec.whatwg.org/multipage/webappapis.html#atob

const plaintext = "Hello, world!";
const base64text = "SGVsbG8sIHdvcmxkIQ==";

exports["window.btoa encodes a string to base64"] = function (t) {
  const window = jsdom().defaultView;
  t.strictEqual(window.btoa(plaintext), base64text);
  t.done();
};

exports["window.btoa throws an error if given non-ASCII characters"] = function (t) {
  const window = jsdom().defaultView;
  t.throws(function () {
    window.btoa(plaintext + "\u03BB");
  }, "String contains an invalid character");
  t.done();
};

exports["window.atob decodes a base64 string"] = function (t) {
  const window = jsdom().defaultView;
  t.strictEqual(window.atob(base64text), plaintext);
  t.done();
};
