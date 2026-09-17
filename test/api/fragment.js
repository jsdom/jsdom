"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("node:test");

const { JSDOM } = require("../..");

describe("API: JSDOM.fragment()", () => {
  it("should return a DocumentFragment", () => {
    const frag = JSDOM.fragment(``);

    assert.equal(frag.constructor.name, "DocumentFragment");
  });

  it("should return fragments with shared owner documents each time", () => {
    const frag1 = JSDOM.fragment(``);
    const frag2 = JSDOM.fragment(``);

    assert.equal(frag1.ownerDocument, frag2.ownerDocument);
  });

  it("should return a fragment with no associated browsing context", () => {
    const frag = JSDOM.fragment(``);

    assert.equal(frag.ownerDocument.defaultView, null);
  });

  it("should allow basic DOM querying", () => {
    const frag = JSDOM.fragment(`<p>Hello</p><p>Hi</p>`);

    assert.equal(frag.childNodes.length, 2);
    assert.equal(frag.firstChild.localName, "p");
    assert.equal(frag.querySelector("p").textContent, "Hello");
    assert.equal(frag.querySelectorAll("p")[1].textContent, "Hi");
  });

  it("should allow basic DOM manipulation", () => {
    const frag = JSDOM.fragment(`<p>Hello</p>`);

    assert.equal(frag.firstChild.textContent, "Hello");

    frag.firstChild.outerHTML = "<b>Hi</b>";

    assert.equal(frag.firstChild.localName, "b");
    assert.equal(frag.firstChild.textContent, "Hi");
  });

  it("should ignore any options passed in", () => {
    const frag = JSDOM.fragment(``, {
      url: "https://example.org",
      referrer: "https://example.com",
      contentType: "application/xhtml+xml",
      userAgent: "Mellblomenator/9000"
    });

    assert.equal(frag.ownerDocument.URL, "about:blank");
    assert.equal(frag.ownerDocument.referrer, "");
    assert.equal(frag.ownerDocument.contentType, "text/html");
  });

  it("should default to no nodes", () => {
    const frag = JSDOM.fragment();
    assert.equal(frag.childNodes.length, 0);
  });
});
