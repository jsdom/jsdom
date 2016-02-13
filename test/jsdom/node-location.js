"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const jsdom = require("../..");

describe("jsdom/node-location", () => {
  specify("jsdom.nodeLocation on an element", () => {
    const document = jsdom.jsdom("<p>Hello</p>");
    const el = document.querySelector("p");

    assert.deepEqual(jsdom.nodeLocation(el), {
      start: 0,
      end: 12,
      startTag: { start: 0, end: 3 },
      endTag: { start: 8, end: 12 }
    });
  });

  specify("jsdom.nodeLocation on a text node", () => {
    const document = jsdom.jsdom("<p>Hello</p>");
    const el = document.querySelector("p");

    assert.deepEqual(jsdom.nodeLocation(el.firstChild), { start: 3, end: 8 });
  });

  specify("jsdom.nodeLocation on a void element", () => {
    const document = jsdom.jsdom(`<p>Hello
      <img src="foo.jpg">
    </p>`);
    const el = document.querySelector("img");

    assert.deepEqual(jsdom.nodeLocation(el), { start: 15, end: 34 });
  });
});
