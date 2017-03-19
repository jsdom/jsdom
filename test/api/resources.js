"use strict";
const http = require("http");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");

const { JSDOM } = require("../..");

describe("API: resources loading", { skipIfBrowser: true }, () => {
  describe("defaults", () => {
    it("should not download images", { slow: 500 }, () => {
      const url = resourceServer({ "Content-Type": "image/png", "Content-Length": 0 });
      const dom = new JSDOM(``);

      const element = dom.window.document.createElement("img");
      setUpAssertNotLoaded(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element);
    });

    it("should not download stylesheet links", { slow: 500 }, () => {
      const url = resourceServer({ "Content-Type": "text/css", "Content-Length": 0 });
      const dom = new JSDOM(``);

      const element = dom.window.document.createElement("link");
      setUpAssertNotLoaded(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element);
    });

    it("should not download scripts (even with runScripts: \"dangerously\")", { slow: 500 }, () => {
      const sourceString = `window.x = 5;`;
      const url = resourceServer({ "Content-Type": "text/javascript", "Content-Length": sourceString.length },
                                 sourceString);
      const dom = new JSDOM(``, { runScripts: "dangerously" });

      const element = dom.window.document.createElement("script");
      setUpAssertNotLoaded(element);
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
      setUpAssertNotLoaded(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      return assertNotLoaded(element).then(() => {
        // This may not be the optimal behavior for "not loading" iframes: it's fine to change this test in the future
        // if we have better semantics. (E.g., perhaps we should treat all URLs as about:blank.)
        assert.strictEqual(dom.window.frames[0].document.documentElement, null,
          "The iframe must not have been downloaded");
      });
    });
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

function setUpAssertNotLoaded(element) {
  element.loadFired = false;
  element.errorFired = false;

  element.addEventListener("load", () => {
    element.loadFired = true;
  });
  element.addEventListener("error", () => {
    element.errorFired = true;
  });
}

function assertNotLoaded(element) {
  return delay(100).then(() => {
    assert.isFalse(element.loadFired, "The load event must not fire");
    assert.isFalse(element.errorFired, "The error event must not fire");
  });
}
