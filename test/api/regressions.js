"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");

const { JSDOM, VirtualConsole } = require("../..");

describe("API regression tests", () => {
  it("should work fine even when the body element has an onload handler (GH-1848)", () => {
    const virtualConsole = new VirtualConsole();
    const jsdomErrors = [];
    virtualConsole.on("jsdomError", e => {
      jsdomErrors.push(e);
    });

    const dom = new JSDOM(`<html><body onload="foobar()"><p>It works</p></body></html>`, { virtualConsole });
    const document = dom.window.document;

    assert.strictEqual(document.body.innerHTML, "<p>It works</p>");

    // The error shows up asynchronously!
    return delay().then(() => {
      assert.deepEqual(jsdomErrors, []);
    });
  });
});
