"use strict";
const http = require("http");
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");

describe("jsdom/resource-loading", () => {
  specify("<script/> loading errors show up as jsdomErrors in the virtual console", { async: true }, t => {
    const virtualConsole = jsdom.createVirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, `Could not load script: "http://0.0.0.0:12345/script.js"`);
      assert.ok(error.detail);

      t.done();
    });

    const doc = jsdom.jsdom(undefined, { virtualConsole });
    const el = doc.createElement("script");
    // Use 0.0.0.0 because it will always fail, and without a timeout
    // (which would slow down the test suite)
    el.src = "http://0.0.0.0:12345/script.js";

    doc.body.appendChild(el);
  });

  specify("<link rel=\"stylesheet\"> loading errors show up as jsdomErrors in the virtual console",
    { async: true },
    testCase => {
      const virtualConsole = jsdom.createVirtualConsole();
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, `Could not load link: "http://0.0.0.0:12345/style.css"`);
        assert.ok(error.detail);

        testCase.done();
      });

      const doc = jsdom.jsdom(undefined, { virtualConsole, features: { FetchExternalResources: ["link"] } });
      const el = doc.createElement("link");
      el.rel = "stylesheet";
      el.href = "http://0.0.0.0:12345/style.css";

      doc.head.appendChild(el);
    }
  );

  specify("<link rel=\"stylesheet\"> loads relative to the document base URL",
    { skipIfBrowser: true, async: true },
    testCase => {
      let port;
      const server = http.createServer((req, res) => {
        switch (req.url) {
          case "/s.css": {
            const css = "p { font-weight: bold; }";
            res.writeHead(200, { "Content-Length": css.length });
            res.end(css);
            break;
          }
        }
      });

      server.listen(0, "127.0.0.1", () => {
        port = server.address().port;

        const virtualConsole = jsdom.createVirtualConsole();
        virtualConsole.on("jsdomError", assert.ifError);

        const html = `<!DOCTYPE html><base href="http://localhost:${port}">` +
                     `<link rel="stylesheet" href="s.css"><p>x</p>`;
        const window = jsdom.jsdom(html, { virtualConsole }).defaultView;

        window.addEventListener("load", () => {
          const el = window.document.querySelector("p");
          assert.equal(window.getComputedStyle(el).fontWeight, "bold");

          testCase.done();
        });
      });
    }
  );

  specify("<iframe> loading errors show up as jsdomErrors in the virtual console", { async: true }, testCase => {
    const virtualConsole = jsdom.createVirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, `Could not load iframe: "http://0.0.0.0:12345/foo.html"`);
      assert.ok(error.detail);

      testCase.done();
    });

    jsdom.jsdom(`<iframe src="http://0.0.0.0:12345/foo.html"></iframe>`,
      { virtualConsole, features: { FetchExternalResources: ["iframe"] } });
  });

  specify("<frame> loading errors show up as jsdomErrors in the virtual console", { async: true }, testCase => {
    const virtualConsole = jsdom.createVirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, `Could not load frame: "http://0.0.0.0:12345/foo.html"`);
      assert.ok(error.detail);

      testCase.done();
    });

    jsdom.jsdom(`<frameset><frame src="http://0.0.0.0:12345/foo.html"></frameset>`,
      { virtualConsole, features: { FetchExternalResources: ["frame"] } });
  });

  specify("empty base64 data urls should be blank", () => {
    jsdom.jsdom(`<link rel="stylesheet" href="data:text/css;base64,">`);
  });
});
