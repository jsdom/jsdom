"use strict";

// Tests for the HTML canvas element
// Spec: https://html.spec.whatwg.org/multipage/scripting.html#the-canvas-element

const jsdom = require("../..");


exports["canvas element is an instance of HTMLElement"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const canvas = document.createElement('canvas');

  t.strictEqual(canvas instanceof window.HTMLElement, true);

  t.done();
};
