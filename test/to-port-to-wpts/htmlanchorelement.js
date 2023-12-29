"use strict";

const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("htmlanchorelement", () => {
  specify("relative URLs resolved relative to file base URLs (GH-1141)", () => {
    const { window } = new JSDOM(`<a href="/foo.pdf" id="one">one</a><a href="foo.pdf" id="two">two</a>`, {
      url: "file:///base/path.html"
    });

    assert.equal(window.document.querySelector("#one").href, "file:///foo.pdf");
    assert.equal(window.document.querySelector("#two").href, "file:///base/foo.pdf");
  });
});
