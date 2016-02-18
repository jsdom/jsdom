"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

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
