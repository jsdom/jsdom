"use strict";
const fs = require("fs");
const path = require("path");
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

exports["canvas must resize correctly when given a non-default width/height (GH-1025)"] = t => {
  const document = jsdom.jsdom("<canvas width='400' height='400'></canvas>");
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  ctx.beginPath();
  ctx.strokeStyle = "rgba(0,255,0,1)";
  ctx.moveTo(50, 50);
  ctx.lineTo(50, 300);
  ctx.lineTo(300, 300);
  ctx.lineTo(300, 50);
  ctx.lineTo(50, 50);
  ctx.stroke();
  ctx.closePath();

  const expected = fs.readFileSync(path.resolve(__dirname, "files/expected-canvas.txt"), { encoding: "utf-8" }).trim();
  t.strictEqual(canvas.toDataURL(), expected);
  t.done();
};

exports["canvas width and height properties must reflect their attributes after setting them (GH-1281)"] = t => {
  const document = jsdom.jsdom("<canvas></canvas>");
  const canvas = document.querySelector("canvas");

  canvas.setAttribute("width", 99);
  canvas.setAttribute("height", 101);
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
