"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("API: JSDOM.fragment()", () => {
  it("should return a DocumentFragment", () => {
    const frag = JSDOM.fragment(``);

    assert.strictEqual(frag.constructor.name, "DocumentFragment");
  });

  it("should return fragments with unique owner documents each time", () => {
    const frag1 = JSDOM.fragment(``);
    const frag2 = JSDOM.fragment(``);

    assert.notStrictEqual(frag1.ownerDocument, frag2.ownerDocument);
  });

  it("should allow basic DOM querying", () => {
    const frag = JSDOM.fragment(`<p>Hello</p><p>Hi</p>`);

    assert.strictEqual(frag.childNodes.length, 2);
    assert.strictEqual(frag.firstChild.localName, "p");
    assert.strictEqual(frag.querySelector("p").textContent, "Hello");
    assert.strictEqual(frag.querySelectorAll("p")[1].textContent, "Hi");
  });

  it("should allow basic DOM manipulation", () => {
    const frag = JSDOM.fragment(`<p>Hello</p>`);

    assert.strictEqual(frag.firstChild.textContent, "Hello");

    frag.firstChild.outerHTML = "<b>Hi</b>";

    assert.strictEqual(frag.firstChild.localName, "b");
    assert.strictEqual(frag.firstChild.textContent, "Hi");
  });

  it("should respect basic options passed in", () => {
    const frag = JSDOM.fragment(``, {
      url: "https://example.org",
      referrer: "https://example.com",
      contentType: "application/xhtml+xml",
      userAgent: "Mellblomenator/9000"
    });

    assert.strictEqual(frag.ownerDocument.URL, "https://example.org/");
    assert.strictEqual(frag.ownerDocument.referrer, "https://example.com/");
    assert.strictEqual(frag.ownerDocument.contentType, "application/xhtml+xml");
    assert.strictEqual(frag.ownerDocument.defaultView.navigator.userAgent, "Mellblomenator/9000");
  });
});
