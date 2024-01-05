"use strict";
const fs = require("node:fs");
const path = require("node:path");
const http = require("node:http");
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");
const { isCanvasInstalled } = require("../util.js");
const toFileUrl = require("../util").toFileUrl(__dirname);

describe("htmlimageelement", () => {
  test(
    "Image constructor should create a HTMLImageElement with specified width and height",
    () => {
      const { window } = new JSDOM();
      const image = new window.Image(100, 200);

      assert.equal(image.width, 100, "width should be set to the passed constructor parameter");
      assert.equal(image.height, 200, "height should be set to the passed constructor parameter");
    }
  );

  test("loading image from valid external URL", (t, done) => {
    if (!isCanvasInstalled(assert, done)) {
      return;
    }
    const { window } = new JSDOM(``, { resources: "usable" });
    const image = new window.Image();
    const src = toFileUrl("files/image.png");
    assert.equal(image.width, 0, "before loading, width should be 0");
    assert.equal(image.height, 0, "before loading, height should be 0");
    assert.equal(image.naturalWidth, 0, "before loading, naturalWidth should be 0");
    assert.equal(image.naturalHeight, 0, "before loading, naturalHeight should be 0");
    assert.equal(image.complete, true, "before loading or setting src, complete should be true");
    assert.equal(image.src, "", "before loading, src should be an empty string");
    assert.equal(image.currentSrc, "", "before loading, currentSrc should be an empty string");
    image.src = src;
    assert.equal(image.complete, false, "before loading and after setting src, complete should be false");
    image.onload = () => {
      assert.ok(true, "onload should be triggered when loading from valid URL.");
      assert.equal(image.width, 168, "after loading, width should be 168");
      assert.equal(image.height, 168, "after loading, height should be 168");
      assert.equal(image.naturalWidth, 168, "after loading, naturalWidth should be 168");
      assert.equal(image.naturalHeight, 168, "after loading, naturalHeight should be 168");
      assert.equal(image.complete, true, "after loading, complete should be true");
      assert.equal(image.src, src, "after loading, src should be the image's URL");
      assert.equal(image.currentSrc, src, "after loading, currentSrc should be the image's URL");
      done();
    };
    image.onerror = () => {
      assert.ok(false, "onerror should not be triggered when loading from valid URL");
    };
  });

  test("loading images should work with relative URLs (GH-1536)", (t, done) => {
    if (!isCanvasInstalled(assert, done)) {
      return;
    }

    let requestsSoFar = 0;

    const server = http.createServer((request, response) => {
      if (requestsSoFar === 0) {
        assert.equal(request.url, "/test.html");
        response.end(`<img src="/test.jpg">`);
      } else {
        assert.equal(request.url, "/test.jpg");
        response.end(``);
        server.close();
        done();
      }

      ++requestsSoFar;
    })
      .listen();

    JSDOM.fromURL(`http://127.0.0.1:${server.address().port}/test.html`, { resources: "usable" });
  });

  test("loading image from data URL", (t, done) => {
    if (!isCanvasInstalled(assert, done)) {
      return;
    }
    const { window } = new JSDOM(``, { resources: "usable" });
    const image = new window.Image();
    const src = fs.readFileSync(path.resolve(__dirname, "files/image.txt"), { encoding: "utf-8" }).trim();
    image.onload = () => {
      assert.ok(true, "onload should be triggered when loading from data URL.");
      assert.equal(image.width, 168, "after setting data URL, width should be 168");
      assert.equal(image.height, 168, "after setting data URL, height should be 168");
      assert.equal(image.complete, true, "after setting data URL, complete should be true");
      assert.equal(image.src, src, "after setting data URL, src should be the data URL");
      assert.equal(image.currentSrc, src, "after setting data URL, currentSrc should be the data URL");

      done();
    };
    image.onerror = () => {
      assert.ok(false, "onerror should not be triggered when loading from valid URL");
    };
    image.src = src;
  });

  test("loading image from invalid external URL", (t, done) => {
    if (!isCanvasInstalled(assert, done)) {
      return;
    }
    const { window } = new JSDOM(``, { resources: "usable" });
    const image = new window.Image();
    const src = "file://" + path.resolve(__dirname, "files/invalid.png");
    image.onload = () => {
      assert.ok(false, "onload should not be triggered when loading from invalid URL.");
    };
    image.onerror = () => {
      assert.ok(true, "onerror should be triggered when loading from valid URL.");
      done();
    };
    image.src = src;
  });
});
