"use strict";
const jsdom = require("../..").jsdom;

// Tests for window.atob and window.btoa
// Spec: https://html.spec.whatwg.org/multipage/webappapis.html#atob

const plaintext = "Hello, world!";
const base64text = "SGVsbG8sIHdvcmxkIQ==";

exports["window.btoa encodes a string to base64"] = t => {
  const window = jsdom().defaultView;
  t.strictEqual(window.btoa(plaintext), base64text);
  t.done();
};

exports["btoa throws an InvalidCharacterError if any char's code point is above U+00FF"] = t => {
  t.expect(2);
  const window = jsdom().defaultView;

  try {
    window.btoa(plaintext + "\u03BB");
  } catch (err) {
    t.strictEqual(err instanceof window.DOMException, true);
    t.strictEqual(err.name, "InvalidCharacterError");
  }

  t.done();
};

exports["window.atob decodes a base64 string"] = t => {
  const window = jsdom().defaultView;
  t.strictEqual(window.atob(base64text), plaintext);
  t.done();
};

exports["atob throws an InvalidCharacterError if any char's code point is above U+00FF"] = t => {
  t.expect(2);
  const window = jsdom().defaultView;

  try {
    window.atob(plaintext + "\u03BB");
  } catch (err) {
    t.strictEqual(err instanceof window.DOMException, true);
    t.strictEqual(err.name, "InvalidCharacterError");
  }

  t.done();
};
