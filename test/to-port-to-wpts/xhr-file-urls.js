"use strict";

const fs = require("fs");

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("xhr-file-urls", { skipIfBrowser: true }, () => {
  specify("Getting a file URL should work (from the same file URL)", t => {
    // From https://github.com/jsdom/jsdom/pull/1180
    const { window } = new JSDOM(``, { url: toFileUrl(__filename) });

    const xhr = new window.XMLHttpRequest();
    xhr.onload = () => {
      assert.strictEqual(xhr.responseText, fs.readFileSync(__filename, { encoding: "utf-8" }));
      t.done();
    };

    xhr.open("GET", toFileUrl(__filename), true);
    xhr.send();
  }, {
    async: true
  });

  specify(
    "Getting a file URL should have valid default response without setting responseType",
    t => {
      // From https://github.com/jsdom/jsdom/pull/1183
      const { window } = new JSDOM(``, { url: toFileUrl(__filename) });

      const xhr = new window.XMLHttpRequest();
      xhr.onload = () => {
        assert.strictEqual(xhr.response, fs.readFileSync(__filename, { encoding: "utf-8" }));
        t.done();
      };

      xhr.open("GET", toFileUrl(__filename), true);
      xhr.send();
    },
    {
      async: true
    }
  );

  specify("Getting a file URL should not throw for getResponseHeader", t => {
    // From https://github.com/jsdom/jsdom/pull/1180
    const { window } = new JSDOM(``, { url: toFileUrl(__filename) });

    const xhr = new window.XMLHttpRequest();
    xhr.onload = () => {
      assert.doesNotThrow(() => {
        assert.strictEqual(xhr.getResponseHeader("Blahblahblah"), null);
      });
      t.done();
    };

    xhr.open("GET", toFileUrl(__filename), true);
    xhr.send();
  }, {
    async: true
  });

  specify("Getting a file URL should not throw for getAllResponseHeaders", t => {
    // From https://github.com/jsdom/jsdom/pull/1183
    const { window } = new JSDOM(``, { url: toFileUrl(__filename) });

    const xhr = new window.XMLHttpRequest();
    xhr.onload = () => {
      assert.doesNotThrow(() => {
        assert.strictEqual(xhr.getAllResponseHeaders(), "");
      });
      t.done();
    };

    xhr.open("GET", toFileUrl(__filename), true);
    xhr.send();
  }, {
    async: true
  });
});
