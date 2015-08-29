"use strict";
const jsdom = require("../..");
// Tests for the HTML canvas element
// Spec: https://html.spec.whatwg.org/multipage/scripting.html#the-canvas-element


exports["canvas element is an instance of HTMLElement and HTMLCanvasElement (GH-649)"] = function (t) {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const canvas = document.createElement("canvas");

  t.strictEqual(canvas instanceof window.HTMLElement, true);
  t.strictEqual(canvas instanceof window.HTMLCanvasElement, true);
  t.done();
};

exports["canvas elements work with getElementById (GH-737)"] = function (t) {
  const document = jsdom.jsdom("<canvas id='foo'></canvas>");
  const canvas = document.getElementById("foo");

  t.ok(canvas);
  t.done();
};

exports["canvas elements width and height must default to 300x150"] = function (t) {
  const document = jsdom.jsdom();
  const canvas = document.createElement("canvas");

  t.strictEqual(canvas.width, 300);
  t.strictEqual(canvas.height, 150);

  canvas.width = 400;
  t.strictEqual(canvas.width, 400);
  t.strictEqual(canvas.getAttribute("width"), "400");
  canvas.width = "blasdfhdf";
  t.strictEqual(canvas.width, 300);
  t.strictEqual(canvas.getAttribute("width"), "300");
  canvas.width = 500;
  t.strictEqual(canvas.width, 500);
  t.strictEqual(canvas.getAttribute("width"), "500");
  canvas.width = -1;
  t.strictEqual(canvas.width, 300);
  t.strictEqual(canvas.getAttribute("width"), "300");

  canvas.height = 400;
  t.strictEqual(canvas.height, 400);
  t.strictEqual(canvas.getAttribute("height"), "400");
  canvas.height = "blasdfhdf";
  t.strictEqual(canvas.height, 150);
  t.strictEqual(canvas.getAttribute("height"), "150");
  canvas.height = 500;
  t.strictEqual(canvas.height, 500);
  t.strictEqual(canvas.getAttribute("height"), "500");
  canvas.height = -1;
  t.strictEqual(canvas.height, 150);
  t.strictEqual(canvas.getAttribute("height"), "150");

  t.done();
};
