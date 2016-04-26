"use strict";
const fs = require("fs");
const path = require("path");
const jsdom = require("../..");
const isCanvasInstalled = require("../util").isCanvasInstalled;
const toFileUrl = require("../util").toFileUrl(__dirname);

exports["Image constructor should create a HTMLImageElement with specified width and height"] = t => {
  const window = jsdom.jsdom().defaultView;
  const image = new window.Image(100, 200);

  t.strictEqual(image.width, 100, "width should be set to the passed constructor parameter");
  t.strictEqual(image.height, 200, "height should be set to the passed constructor parameter");
  t.done();
};

exports["loading image from valid external URL"] = t => {
  if (!isCanvasInstalled(t)) {
    return;
  }
  const window = jsdom.jsdom("", { features: { FetchExternalResources: ["img"] } }).defaultView;
  const image = new window.Image();
  const src = toFileUrl("files/image.png");
  t.strictEqual(image.width, 0, "before loading, width should be 0");
  t.strictEqual(image.height, 0, "before loading, height should be 0");
  t.strictEqual(image.naturalWidth, 0, "before loading, naturalWidth should be 0");
  t.strictEqual(image.naturalHeight, 0, "before loading, naturalHeight should be 0");
  t.strictEqual(image.complete, false, "before loading, complete should be false");
  t.strictEqual(image.src, "", "before loading, src should be an empty string");
  t.strictEqual(image.currentSrc, "", "before loading, currentSrc should be an empty string");
  image.src = src;
  image.onload = (event) => {
    t.ok(true, "onload should be triggered when loading from valid URL.");
    t.strictEqual(image.width, 168, "after loading, width should be 168");
    t.strictEqual(image.height, 168, "after loading, height should be 168");
    t.strictEqual(image.naturalWidth, 168, "after loading, naturalWidth should be 168");
    t.strictEqual(image.naturalHeight, 168, "after loading, naturalHeight should be 168");
    t.strictEqual(image.complete, true, "after loading, complete should be true");
    t.strictEqual(image.src, src, "after loading, src should be the image's URL");
    t.strictEqual(image.currentSrc, src, "after loading, currentSrc should be the image's URL");
    t.done();
  };
  image.onerror = (event) => {
    t.ok(false, "onerror should not be triggered when loading from valid URL");
    t.done();
  };
};

exports["loading image from data URL"] = t => {
  if (!isCanvasInstalled(t)) {
    return;
  }
  const window = jsdom.jsdom("", { features: { FetchExternalResources: ["img"] } }).defaultView;
  const image = new window.Image();
  const src = fs.readFileSync(path.resolve(__dirname, "files/image.txt"), { encoding: "utf-8" }).trim();
  image.onload = (event) => {
    t.ok(true, "onload should be triggered when loading from data URL.");
    t.done();
  };
  image.onerror = (event) => {
    t.ok(false, "onerror should not be triggered when loading from valid URL");
    t.done();
  };
  image.src = src;
  t.strictEqual(image.width, 168, "after setting data URL, width should be 168");
  t.strictEqual(image.height, 168, "after setting data URL, height should be 168");
  t.strictEqual(image.complete, true, "after setting data URL, complete should be true");
  t.strictEqual(image.src, src, "after setting data URL, src should be the data URL");
  t.strictEqual(image.currentSrc, src, "after setting data URL, currentSrc should be the data URL");
};

exports["loading image from invalid external URL"] = t => {
  if (!isCanvasInstalled(t)) {
    return;
  }
  const window = jsdom.jsdom("", { features: { FetchExternalResources: ["img"] } }).defaultView;
  const image = new window.Image();
  const src = "file://" + path.resolve(__dirname, "files/invalid.png");
  image.onload = () => {
    t.ok(false, "onload should not be triggered when loading from invalid URL.");
    t.done();
  };
  image.onerror = () => {
    t.ok(true, "onerror should be triggered when loading from valid URL.");
    t.done();
  };
  image.src = src;
};
