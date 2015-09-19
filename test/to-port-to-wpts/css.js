"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");

describe("browser/css", () => {
  specify("should not give CSS parsing errors upon encountering @-moz-document (GH-687)", { async: true }, t => {
    const css = ".x @-moz-document url-prefix() { .y { color: blue; } }";
    const html = `<!DOCTYPE html><html><head><style>${css}</style></head><body><p>Hi</p></body></html>`;

    jsdom.env({
      html,
      done(err) {
        assert.strictEqual(err, null);
        t.done();
      }
    });
  });
});
