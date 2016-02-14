"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

// These tests are regression tests, not systematic serialization tests. They are compiled from the bug tracker.

describe("jsdom/serialization", () => {
  specify("style attribute should not appear when accessing style property (GH-1109)", () => {
    const document = jsdom.jsdom("<p>hello</p>");
    const p = document.querySelector("p");

    assert.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear before");

    /* eslint-disable no-unused-expressions */
    p.style;
    /* eslint-enable no-unused-expressions */

    assert.equal(p.outerHTML, "<p>hello</p>", "style attribute should not appear after");
  });

  specify("void elements should serialize correctly", () => {
    const html = "<html><head></head><body><div><br><hr><audio><source></audio></div></body></html>";
    const document = jsdom.jsdom(html);

    assert.strictEqual(jsdom.serializeDocument(document), html);
  });

  specify("the case of html/body, or their omission, should not effect serialization", () => {
    const inputs = [
      "<HTML><BODY></BODY></HTML>",
      "<html><BODY></Body></HTML>",
      "<html><body></body></html>",
      "<body></body>",
      ""
    ];

    const outputs = inputs.map(input => jsdom.serializeDocument(jsdom.jsdom(input)));

    for (const output of outputs) {
      assert.strictEqual(output, "<html><head></head><body></body></html>");
    }
  });

  specify("outerHTML should not format the HTML (GH-371)", () => {
    const originalHTML = "<li><span>A</span><span>B</span></li>";
    const document = jsdom.jsdom(originalHTML);
    const outerHTML = document.body.firstChild.outerHTML;

    assert.strictEqual(outerHTML, originalHTML);
  });
});
