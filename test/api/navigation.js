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

describe("API: JSDOM.fromURL()", { skipIfBrowser: true }, () => {
  it("should support navigation via location.replace", () => {
    const [url1, url2] = twoPageServer("<p>Page 1</p>", "<p>Page 2</p>", 3);

    return JSDOM.fromURL(url1).then(dom => {
      assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 1</p></body></html>");
      dom.window.location.assign(url2);
      return delay(200).then(() => {
        assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 2</p></body></html>");
        dom.window.history.back();
        return delay(200);
      }).then(() => {
        assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 1</p></body></html>");
      });
    });
  });
  it("should support navigation via form submit", () => {
    const [url1, url2] = twoPageServer(`<form id="f" action="/2"><input name="foo" value="bar"></form>`, "<p>Page 2</p>", 2);

    return JSDOM.fromURL(url1).then(dom => {
      assert.strictEqual(dom.serialize(), `<html><head></head><body><form id="f" action="/2"><input name="foo" value="bar"></form></body></html>`);
      dom.window.document.getElementById('f').submit();
      return delay(500).then(() => {
        assert.strictEqual(dom.serialize(), "<html><head></head><body><p>Page 2</p></body></html>");
        assert.strictEqual(dom.window.location.search, "?foo=bar");

      });
    });
  });
});

function twoPageServer(body1, body2, expectedRequests) {
  const server = http.createServer((req, res) => {
    const path = req.url.split('?')[0];
    if (path.endsWith("/1")) {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(body1);
      if (0 === --expectedRequests) {
        server.close();
      }
    } else if (path.endsWith("/2")) {
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