"use strict";
const http = require("http");
const path = require("path");
const fs = require("fs");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");
const canvas = require("../../lib/jsdom/utils.js").Canvas;

const { JSDOM } = require("../..");

let pngBytes;

describe("API: resource loading configuration", { skipIfBrowser: true }, () => {
  // This has to be inside the { skipIfBrowser: true } block.
  pngBytes = fs.readFileSync(path.resolve(__dirname, "fixtures/resources/transparent.png"));

  describe("defaults", () => {
    it("should not download images", { slow: 500 }, () => {
      const url = imageServer();
      const dom = new JSDOM(``);

      const element = dom.window.document.createElement("img");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element);
    });

    it("should not download stylesheet links", { slow: 500 }, () => {
      const sourceString = `body { color: blue; }`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``);

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // I think this should actually be "rgb(0, 0, 0)" per spec. It's fine to change the test in the future if we
        // fix that.
        assert.strictEqual(dom.window.getComputedStyle(dom.window.document.body).color, "");
      });
    });

    it("should not download scripts (even with runScripts: \"dangerously\")", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, undefined, "The script must not have run");
      });
    });

    it("should not download iframes", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer({ "Content-Type": "text/html", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded");
      });
    });

    it("should not download frames", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer({ "Content-Type": "text/html", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(`<frameset></frameset>`, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // This may not be the optimal behavior for "not loading" frames: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded");
      });
    });
  });

  describe("set to \"usable\"", () => {
    it("should download images if and only if canvas is installed", { slow: 500 }, () => {
      const url = imageServer();
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("img");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return canvas ? assertLoaded(element) : assertNotLoaded(element);
    });

    it("should download stylesheet links", { slow: 500 }, () => {
      const sourceString = `body { color: blue; }`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        // I think this should actually be "rgb(0, 0, 255)" per spec. It's fine to change the test in the future if we
        // fix that.
        assert.strictEqual(dom.window.getComputedStyle(dom.window.document.body).color, "blue");
      });
    });

    it("should download and run scripts, if runScripts: \"dangerously\" is also set", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { resources: "usable", runScripts: "dangerously" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, 5, "The script must have run");
      });
    });

    it("should not download or run scripts, if runScripts: \"outside-only\" is set", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { resources: "usable", runScripts: "outside-only" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, undefined, "The script must not have run");
      });
    });

    it("should not download or run scripts, if runScripts is not set", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        assert.strictEqual(dom.window.x, undefined, "The script must not have run");
      });
    });

    it("should download iframes", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer({ "Content-Type": "text/html", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { resources: "usable" });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(dom.window.frames[0].document.body.textContent, "Hello",
          "The iframe must have been downloaded");
      });
    });

    it("should download frames", { slow: 500 }, () => {
      const sourceString = `Hello`;
      const url = resourceServer({ "Content-Type": "text/html", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(`<frameset></frameset>`, { resources: "usable" });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertLoaded(element).then(() => {
        assert.strictEqual(dom.window.frames[0].document.body.textContent, "Hello",
          "The frame must have been downloaded");
      });
    });
  });

  it("should disallow other values", () => {
    assert.throws(() => new JSDOM(``, { resources: null }), RangeError);
    assert.throws(() => new JSDOM(``, { resources: "asdf" }), RangeError);
    assert.throws(() => new JSDOM(``, { resources: true }), RangeError);
    assert.throws(() => new JSDOM(``, { resources: false }), RangeError);
  });
});

function resourceServer(headers, body) {
  const server = http.createServer((req, res) => {
    res.writeHead(200, headers);
    res.end(body);
    server.close();
  }).listen();

  return `http://127.0.0.1:${server.address().port}/`;
}

function imageServer() {
  return resourceServer({ "Content-Type": "image/png", "Content-Length": pngBytes.byteLength }, pngBytes);
}

function setUpLoadingAsserts(element) {
  element.loadFired = false;
  element.errorFired = false;

  element.loadPromise = new Promise(resolve => {
    element.addEventListener("load", () => {
      element.loadFired = true;
      resolve();
    });
    element.addEventListener("error", () => {
      element.errorFired = true;
    });
  });
}

function assertNotLoaded(element) {
  return delay(30).then(() => {
    assert.isFalse(element.loadFired, "The load event must not fire");
    assert.isFalse(element.errorFired, "The error event must not fire");
  });
}

function assertLoaded(element) {
  return element.loadPromise;
}
