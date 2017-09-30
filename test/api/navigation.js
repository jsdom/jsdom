"use strict";
const http = require("http");
const zlib = require("zlib");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { delay } = require("../util");
const jsdom = require("../..");
const { JSDOM } = require("../..");
const { version: packageVersion } = require("../../package.json");

require("chai").use(require("../chai-helpers.js"));

describe("Multi-Page Navigation", { skipIfBrowser: true }, () => {
  it("should support navigation via location.replace", () => {
    const [url1, url2] = twoPageServer("<p>Page 1</p>", "<p>Page 2</p>", 3);

    return JSDOM.fromURL(url1).then(dom => {
      assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 1</p></body></html>");
      dom.window.location.assign(url2);
      // TODO: replace with waiting for a "navigated" event
      return delay(200).then(() => {
        assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 2</p></body></html>");
        dom.window.history.back();
        // TODO: replace with waiting for a "navigated" event
        return delay(200);
      }).then(() => {
        assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 1</p></body></html>");
      });
    });
  });
});

function twoPageServer(body1, body2, expectedRequests) {
  const server = http.createServer((req, res) => {
    if (req.url.endsWith("/1")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(body1);
      if (0 === --expectedRequests) {
        server.close();
      }
    } else if (req.url.endsWith("/2")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(body2);
      if (0 === --expectedRequests) {
        server.close();
      }
    } else {
      throw new Error("Unexpected route hit in redirect test server");
    }
  }).listen();

  const base = `http://127.0.0.1:${server.address().port}/`;

  return [base + "1", base + "2"];
}
