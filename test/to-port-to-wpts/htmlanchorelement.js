"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");

describe("htmlanchorelement", () => {
  specify("relative URLs resolved relative to file base URLs (GH-1141)", () => {
    const document = jsdom.jsdom(`<a href="/foo.pdf" id="one">one</a><a href="foo.pdf" id="two">two</a>`, {
      url: "file:///base/path.html"
    });

    assert.strictEqual(document.querySelector("#one").href, "file:///foo.pdf");
    assert.strictEqual(document.querySelector("#two").href, "file:///base/foo.pdf");
  });
});
