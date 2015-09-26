"use strict";
const jsdom = require("../..");
// Tests for the HTML canvas element
// Spec: https://html.spec.whatwg.org/multipage/scripting.html#the-canvas-element


exports["canvas element is an instance of HTMLElement and HTMLCanvasElement (GH-649)"] = t => {
  const document = jsdom.jsdom();
  const window = document.defaultView;
  const canvas = document.createElement("canvas");

  t.strictEqual(canvas instanceof window.HTMLElement, true);
  t.strictEqual(canvas instanceof window.HTMLCanvasElement, true);
  t.done();
};

exports["canvas elements work with getElementById (GH-737)"] = t => {
  const document = jsdom.jsdom("<canvas id='foo'></canvas>");
  const canvas = document.getElementById("foo");

  t.ok(canvas);
  t.done();
};

exports["canvas elements width and height must default to 300x150"] = t => {
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

exports["canvas width and height must parse correctly initially (GH-1025)"] = t => {
  const document = jsdom.jsdom("<canvas width='99' height='101'></canvas>");
  const canvas = document.querySelector("canvas");

  t.strictEqual(canvas.width, 99);
  t.strictEqual(canvas.height, 101);
  t.done();
};

exports["toDataURL should work (when the canvas npm package is provided) (GH-1025)"] = t => {
  /* eslint-disable global-require */
  let Canvas;
  try {
    Canvas = require("canvas");
  } catch (e) { /* intentionally ignored */ }
  /* eslint-enable global-require */

  if (typeof Canvas !== "function") { // browserify will give back an empty object
    t.ok(true, "test ignored; not running with the canvas npm package installed");
    t.done();
    return;
  }

  const document = jsdom.jsdom("<canvas width='99' height='101'></canvas>");
  const canvas = document.querySelector("canvas");

  t.strictEqual(canvas.toDataURL().substring(0, 22), "data:image/png;base64,");
  t.done();
};
