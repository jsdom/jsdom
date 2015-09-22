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
    assert.strictEqual(location.start, 0);
    assert.strictEqual(location.end, 12);
    assert.strictEqual(location.startTag.start, 0);
    assert.strictEqual(location.startTag.end, 3);
    assert.strictEqual(location.endTag.start, 8);
    assert.strictEqual(location.endTag.end, 12);
  });

  specify("jsdom.nodeLocation on a text node", () => {
    const document = jsdom.jsdom("<p>Hello</p>");
    const el = document.querySelector("p");

    const location = jsdom.nodeLocation(el.firstChild);
    assert.strictEqual(location.start, 3);
    assert.strictEqual(location.end, 8);
  });

  specify("jsdom.nodeLocation on a void element", () => {
    const document = jsdom.jsdom(`<p>Hello
      <img src="foo.jpg">
    </p>`);
    const el = document.querySelector("img");

    const location = jsdom.nodeLocation(el);
    assert.strictEqual(location.start, 13);
    assert.strictEqual(location.end, 32);
  });
});
