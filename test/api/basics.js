"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("JSDOM instances: basics", () => {
  it("should have a window and a document", () => {
    const dom = new JSDOM();

    assert.ok(dom.window);
    assert.ok(dom.window.document);
  });

  it("should have a document with documentElement <html> when no arguments are passed", () => {
    const { document } = (new JSDOM()).window;

    assert.equal(document.documentElement.localName, "html");
  });
});

describe("JSDOM() constructor first argument", () => {
  it("should populate the resulting document with the given HTML", () => {
    const { document } = (new JSDOM(`<a id="test" href="#test">`)).window;

    assert.equal(document.getElementById("test").getAttribute("href"), "#test");
  });

  it("should give the same document innerHTML for empty and whitespace and omitted strings", () => {
    const document1 = (new JSDOM()).window.document;
    const document2 = (new JSDOM(undefined)).window.document;
    const document3 = (new JSDOM(``)).window.document;
    const document4 = (new JSDOM(` `)).window.document;

    assert.equal(document1.innerHTML, document2.innerHTML);
    assert.equal(document2.innerHTML, document3.innerHTML);
    assert.equal(document3.innerHTML, document4.innerHTML);
  });

  it("should coerce null to a string", () => {
    const document1 = (new JSDOM(null)).window.document;
    const document2 = (new JSDOM("null")).window.document;

    assert.equal(document1.innerHTML, document2.innerHTML);
  });

  describe("error reporting", () => {
    it("should include the URL when reporting an XML parse error", () => {
      assert.throws(() => new JSDOM("<doc><!-- ... ---></doc>", {
        url: "https://example.com/",
        contentType: "text/xml"
      }), Error, "https://example.com/:1:17: malformed comment.");
    });
  });
});
