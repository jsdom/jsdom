"use strict";
const fs = require("fs");
const path = require("path");
const http = require("http");

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const { isCanvasInstalled } = require("../util.js");
const toFileUrl = require("../util").toFileUrl(__dirname);

describe("htmlimageelement", { skipIfBrowser: true }, () => {
  specify(
    "Image constructor should create a HTMLImageElement with specified width and height",
    () => {
      const { window } = new JSDOM();
      const image = new window.Image(100, 200);

      assert.strictEqual(image.width, 100, "width should be set to the passed constructor parameter");
      assert.strictEqual(image.height, 200, "height should be set to the passed constructor parameter");
    }
  );

  specify("loading image from valid external URL", t => {
    if (!isCanvasInstalled(assert, t.done)) {
      return;
    }
    const { window } = new JSDOM(``, { resources: "usable" });
    const image = new window.Image();
    const src = toFileUrl("files/image.png");
    assert.strictEqual(image.width, 0, "before loading, width should be 0");
    assert.strictEqual(image.height, 0, "before loading, height should be 0");
    assert.strictEqual(image.naturalWidth, 0, "before loading, naturalWidth should be 0");
    assert.strictEqual(image.naturalHeight, 0, "before loading, naturalHeight should be 0");
    assert.strictEqual(image.complete, true, "before loading or setting src, complete should be true");
    assert.strictEqual(image.src, "", "before loading, src should be an empty string");
    assert.strictEqual(image.currentSrc, "", "before loading, currentSrc should be an empty string");
    image.src = src;
    assert.strictEqual(image.complete, false, "before loading and after setting src, complete should be false");
    image.onload = () => {
      assert.ok(true, "onload should be triggered when loading from valid URL.");
      assert.strictEqual(image.width, 168, "after loading, width should be 168");
      assert.strictEqual(image.height, 168, "after loading, height should be 168");
      assert.strictEqual(image.naturalWidth, 168, "after loading, naturalWidth should be 168");
      assert.strictEqual(image.naturalHeight, 168, "after loading, naturalHeight should be 168");
      assert.strictEqual(image.complete, true, "after loading, complete should be true");
      assert.strictEqual(image.src, src, "after loading, src should be the image's URL");
      assert.strictEqual(image.currentSrc, src, "after loading, currentSrc should be the image's URL");
      t.done();
    };
    image.onerror = () => {
      assert.ok(false, "onerror should not be triggered when loading from valid URL");
      t.done();
    };
  }, {
    async: true
  });

  specify("loading images should work with relative URLs (GH-1536)", t => {
    if (!isCanvasInstalled(assert, t.done)) {
      return;
    }

    let requestsSoFar = 0;

    const server = http.createServer((request, response) => {
      if (requestsSoFar === 0) {
        assert.strictEqual(request.url, "/test.html");
        response.end(`<img src="/test.jpg">`);
      } else {
        assert.strictEqual(request.url, "/test.jpg");
        response.end(``);
        server.close();
        t.done();
      }

      ++requestsSoFar;
    })
      .listen();

    JSDOM.fromURL(`http://127.0.0.1:${server.address().port}/test.html`, { resources: "usable" });
  }, {
    async: true
  });

  specify("loading image from data URL", t => {
    if (!isCanvasInstalled(assert, t.done)) {
      return;
    }
    const { window } = new JSDOM(``, { resources: "usable" });
    const image = new window.Image();
    const src = fs.readFileSync(path.resolve(__dirname, "files/image.txt"), { encoding: "utf-8" }).trim();
    image.onload = () => {
      assert.ok(true, "onload should be triggered when loading from data URL.");
      assert.strictEqual(image.width, 168, "after setting data URL, width should be 168");
      assert.strictEqual(image.height, 168, "after setting data URL, height should be 168");
      assert.strictEqual(image.complete, true, "after setting data URL, complete should be true");
      assert.strictEqual(image.src, src, "after setting data URL, src should be the data URL");
      assert.strictEqual(image.currentSrc, src, "after setting data URL, currentSrc should be the data URL");

      t.done();
    };
    image.onerror = () => {
      assert.ok(false, "onerror should not be triggered when loading from valid URL");
      t.done();
    };
    image.src = src;
  }, {
    async: true
  });

  specify("loading image from invalid external URL", t => {
    if (!isCanvasInstalled(assert, t.done)) {
      return;
    }
    const { window } = new JSDOM(``, { resources: "usable" });
    const image = new window.Image();
    const src = "file://" + path.resolve(__dirname, "files/invalid.png");
    image.onload = () => {
      assert.ok(false, "onload should not be triggered when loading from invalid URL.");
      t.done();
    };
    image.onerror = () => {
      assert.ok(true, "onerror should be triggered when loading from valid URL.");
      t.done();
    };
    image.src = src;
  }, {
    async: true
  });
});
