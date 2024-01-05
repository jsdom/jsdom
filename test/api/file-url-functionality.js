"use strict";
const fs = require("node:fs");
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

const { JSDOM } = require("../..");

const thisFileURL = toFileUrl(__filename);

describe("Test cases for the interaction with file: URLs", () => {
  describe("XMLHttpRequest", () => {
    it("should retrieve the same file: URL's contents, as both response and responseText", (t, done) => {
      const { window } = new JSDOM(``, { url: thisFileURL });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        const thisFileContents = fs.readFileSync(__filename, { encoding: "utf-8" });
        assert.equal(xhr.responseText, thisFileContents);
        assert.equal(xhr.response, thisFileContents);
        done();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
    });

    it("should return no headers", (t, done) => {
      const { window } = new JSDOM(``, { url: thisFileURL });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.doesNotThrow(() => {
          assert.equal(xhr.getResponseHeader("Content-Type"), null);
        });
        assert.equal(xhr.getAllResponseHeaders(), "");
        done();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
    });

    it("should not crash or set cookies when requesting a file: URL (GH-1180)", (t, done) => {
      const { window } = new JSDOM(``, { url: thisFileURL });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.equal(window.document.cookie, "");
        done();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
    });
  });

  describe("loading file: URL resources", () => {
    it("should load scripts from file: URLs from about:blank", (t, done) => {
      const { window } = new JSDOM(
        `<span id="test"></span><script src="${toFileUrl("fixtures/hello.js")}"></script>`,
        { resources: "usable", runScripts: "dangerously" }
      );

      window.doCheck = () => {
        assert.equal(window.document.getElementById("test").textContent, "hello from javascript");
        done();
      };
    });

    it("should load scripts via relative URL from file: URLs, despite hrefless <base>", (t, done) => {
      const { window } = new JSDOM(
        `
          <base target="whatever"></base>
          <span id="test"></span>
          <script src="./fixtures/hello.js"></script>
        `,
        { url: thisFileURL, resources: "usable", runScripts: "dangerously" }
      );

      window.doCheck = () => {
        assert.equal(window.document.getElementById("test").textContent, "hello from javascript");
        done();
      };
    });
  });
});
