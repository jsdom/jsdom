"use strict";
const jsdom = require("../..");

exports["jsdom.nodeLocation on an element"] = t => {
  const document = jsdom.jsdom("<p>Hello</p>");
  const el = document.querySelector("p");

  const location = jsdom.nodeLocation(el);
  t.strictEqual(location.start, 0);
  t.strictEqual(location.end, 12);
  t.strictEqual(location.startTag.start, 0);
  t.strictEqual(location.startTag.end, 3);
  t.strictEqual(location.endTag.start, 8);
  t.strictEqual(location.endTag.end, 12);
  t.done();
};

exports["jsdom.nodeLocation on a text node"] = t => {
  const document = jsdom.jsdom("<p>Hello</p>");
  const el = document.querySelector("p");

  const location = jsdom.nodeLocation(el.firstChild);
  t.strictEqual(location.start, 3);
  t.strictEqual(location.end, 8);
  t.done();
};

exports["jsdom.nodeLocation on a void element"] = t => {
  const document = jsdom.jsdom(`<p>Hello
    <img src="foo.jpg">
  </p>`);
  const el = document.querySelector("img");

  const location = jsdom.nodeLocation(el);
  t.strictEqual(location.start, 13);
  t.strictEqual(location.end, 32);
  t.done();
};
