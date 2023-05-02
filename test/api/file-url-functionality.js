"use strict";
const fs = require("fs");
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

const { JSDOM } = require("../..");

require("chai").use(require("../chai-helpers.js"));

const thisFileURL = toFileUrl(__filename);

describe("Test cases for the interaction with file: URLs", () => {
  describe("XMLHttpRequest", () => {
    it("should retrieve the same file: URL's contents, as both response and responseText", { async: true }, t => {
      const { window } = new JSDOM(``, { url: thisFileURL });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        const thisFileContents = fs.readFileSync(__filename, { encoding: "utf-8" });
        assert.strictEqual(xhr.responseText, thisFileContents);
        assert.strictEqual(xhr.response, thisFileContents);
        t.done();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
    });

    it("should return no headers", { async: true }, t => {
      const { window } = new JSDOM(``, { url: thisFileURL });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.doesNotThrow(() => {
          assert.strictEqual(xhr.getResponseHeader("Content-Type"), null);
        });
        assert.strictEqual(xhr.getAllResponseHeaders(), "");
        t.done();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
    });

    it("should not crash or set cookies when requesting a file: URL (GH-1180)", { async: true }, t => {
      const { window } = new JSDOM(``, { url: thisFileURL });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.strictEqual(window.document.cookie, "");
        t.done();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
    });
  });

  describe("loading file: URL resources", () => {
    it("should load scripts from file: URLs from about:blank", { async: true }, t => {
      const { window } = new JSDOM(
        `<span id="test"></span><script src="${toFileUrl("fixtures/hello.js")}"></script>`,
        { resources: "usable", runScripts: "dangerously" }
      );

      window.doCheck = () => {
        assert.strictEqual(window.document.getElementById("test").textContent, "hello from javascript");
        t.done();
      };
    });

    it("should load scripts via relative URL from file: URLs, despite hrefless <base>", { async: true }, t => {
      const { window } = new JSDOM(
        `
          <base target="whatever"></base>
          <span id="test"></span>
          <script src="./fixtures/hello.js"></script>
        `,
        { url: thisFileURL, resources: "usable", runScripts: "dangerously" }
      );

      window.doCheck = () => {
        assert.strictEqual(window.document.getElementById("test").textContent, "hello from javascript");
        t.done();
      };
    });
  });
});
