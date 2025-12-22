"use strict";
const fs = require("fs");
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

const { JSDOM } = require("../..");

function withResolvers() {
  if (Promise.withResolvers) {
    return Promise.withResolvers();
  }
  const r = {};
  // eslint-disable-next-line no-promise-executor-return
  r.promise = new Promise((resolve, reject) => Object.assign(r, { resolve, reject }));
  return r;
}

const thisFileURL = toFileUrl(__filename);

describe("Test cases for the interaction with file: URLs", () => {
  describe("XMLHttpRequest", () => {
    it("should retrieve the same file: URL's contents, as both response and responseText", () => {
      const { window } = new JSDOM(``, { url: thisFileURL });
      const { promise, resolve } = withResolvers();

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        const thisFileContents = fs.readFileSync(__filename, { encoding: "utf-8" });
        assert.equal(xhr.responseText, thisFileContents);
        assert.equal(xhr.response, thisFileContents);
        resolve();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
      return promise;
    });

    it("should return no headers", () => {
      const { window } = new JSDOM(``, { url: thisFileURL });
      const { promise, resolve } = withResolvers();

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.doesNotThrow(() => {
          assert.equal(xhr.getResponseHeader("Content-Type"), null);
        });
        assert.equal(xhr.getAllResponseHeaders(), "");
        resolve();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
      return promise;
    });

    it("should not crash or set cookies when requesting a file: URL (GH-1180)", () => {
      const { window } = new JSDOM(``, { url: thisFileURL });
      const { promise, resolve } = withResolvers();

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.equal(window.document.cookie, "");
        resolve();
      };

      xhr.open("GET", thisFileURL, true);
      xhr.send();
      return promise;
    });
  });

  describe("loading file: URL resources", () => {
    it("should load scripts from file: URLs from about:blank", () => {
      const { promise, resolve } = withResolvers();
      const { window } = new JSDOM(
        `<span id="test"></span><script src="${toFileUrl("fixtures/hello.js")}"></script>`,
        { resources: "usable", runScripts: "dangerously" }
      );

      window.doCheck = () => {
        assert.equal(window.document.getElementById("test").textContent, "hello from javascript");
        resolve();
      };
      return promise;
    });

    it("should load scripts via relative URL from file: URLs, despite hrefless <base>", () => {
      const { promise, resolve } = withResolvers();
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
        resolve();
      };
      return promise;
    });
  });
});
