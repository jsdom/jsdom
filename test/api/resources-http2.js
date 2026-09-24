"use strict";
const assert = require("node:assert/strict");
const { once } = require("node:events");
const fs = require("node:fs");
const http2 = require("node:http2");
const path = require("node:path");
const { promisify } = require("node:util");
const { describe, it, beforeEach, afterEach } = require("mocha-sugar-free");
const { Agent } = require("undici");
const { JSDOM } = require("../..");
const { serverURL } = require("./helpers/servers.js");

const key = fs.readFileSync(path.resolve(__dirname, "fixtures/http2/key.pem"));
const cert = fs.readFileSync(path.resolve(__dirname, "fixtures/http2/cert.pem"));

describe("API: HTTP/2 resource loading", () => {
  let server, dispatcher, requests;

  beforeEach(async () => {
    requests = [];
    server = http2.createSecureServer({ key, cert, allowHTTP1: false });
    server.on("request", (req, res) => {
      requests.push({ path: req.url, version: req.httpVersion });
      switch (req.url) {
        case "/document.html":
          res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
          res.end("<p>Héllo</p>");
          break;
        case "/page/index.html":
          res.writeHead(200, { "Content-Type": "text/html" });
          res.end(`<!DOCTYPE html><link rel="stylesheet" href="style.css"><script src="script.js"></script>`);
          break;
        case "/page/style.css":
          res.writeHead(200, { "Content-Type": "text/css" });
          res.end("body { color: rgb(1 2 3); }");
          break;
        case "/page/script.js":
          res.writeHead(200, { "Content-Type": "text/javascript" });
          res.end("window.scriptRan = true;");
          break;
        default:
          res.writeHead(404);
          res.end();
      }
    });
    server.listen(0, "127.0.0.1");
    await once(server, "listening");

    // Trust the fixture certificate, leaving HTTP/2 negotiation at its default.
    dispatcher = new Agent({ connect: { ca: cert } });
  });

  afterEach(async () => {
    await dispatcher.destroy();
    await promisify(server.close).call(server);
  });

  it("should load and serialize a document from an HTTP/2-only server (GH-2899)", async () => {
    const url = serverURL(server, { scheme: "https" }) + "/document.html";
    const dom = await JSDOM.fromURL(url, { resources: { dispatcher } });

    assert.equal(dom.serialize(), "<html><head></head><body><p>Héllo</p></body></html>");
    assert.equal(dom.window.document.characterSet, "UTF-8");
    assert.equal(dom.window.document.URL, url);
    assert.deepEqual(requests, [{ path: "/document.html", version: "2.0" }]);
  });

  it("should load relative scripts and stylesheets from an HTTP/2-only server", async () => {
    const dom = await JSDOM.fromURL(serverURL(server, { scheme: "https" }) + "/page/index.html", {
      resources: { dispatcher },
      runScripts: "dangerously"
    });
    await once(dom.window, "load");

    assert.equal(dom.window.scriptRan, true);
    assert.equal(dom.window.getComputedStyle(dom.window.document.body).color, "rgb(1, 2, 3)");
    assert.deepEqual(requests.toSorted((a, b) => a.path.localeCompare(b.path)), [
      { path: "/page/index.html", version: "2.0" },
      { path: "/page/script.js", version: "2.0" },
      { path: "/page/style.css", version: "2.0" }
    ]);
  });
});
