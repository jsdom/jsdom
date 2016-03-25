"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

describe("jsdom/node-location", () => {
  specify("jsdom.nodeLocation on an element", () => {
    const document = jsdom.jsdom("<p>Hello</p>");
    const el = document.querySelector("p");

    const location = jsdom.nodeLocation(el);
    assert.strictEqual(location.startOffset, 0);
    assert.strictEqual(location.endOffset, 12);
    assert.strictEqual(location.startTag.startOffset, 0);
    assert.strictEqual(location.startTag.endOffset, 3);
    assert.strictEqual(location.endTag.startOffset, 8);
    assert.strictEqual(location.endTag.endOffset, 12);
  });

  specify("jsdom.nodeLocation on a text node", () => {
    const document = jsdom.jsdom("<p>Hello</p>");
    const el = document.querySelector("p");

    const location = jsdom.nodeLocation(el.firstChild);
    assert.strictEqual(location.startOffset, 3);
    assert.strictEqual(location.endOffset, 8);
  });

  specify("jsdom.nodeLocation on a void element", () => {
    const document = jsdom.jsdom(`<p>Hello
      <img src="foo.jpg">
    </p>`);
    const el = document.querySelector("img");

    const location = jsdom.nodeLocation(el);
    assert.strictEqual(location.startOffset, 15);
    assert.strictEqual(location.endOffset, 34);
  });
});
