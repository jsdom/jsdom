"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

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
