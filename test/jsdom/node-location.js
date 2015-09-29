"use strict";
const jsdom = require("../..");

exports["jsdom.nodeLocation on an element"] = t => {
  const document = jsdom.jsdom("<p>Hello</p>");
  const el = document.querySelector("p");

  t.deepEqual(jsdom.nodeLocation(el), {
    start: 0,
    end: 12,
    startTag: { start: 0, end: 3 },
    endTag: { start: 8, end: 12 }
  });
  t.done();
};

exports["jsdom.nodeLocation on a text node"] = t => {
  const document = jsdom.jsdom("<p>Hello</p>");
  const el = document.querySelector("p");

  t.deepEqual(jsdom.nodeLocation(el.firstChild), { start: 3, end: 8 });
  t.done();
};

exports["jsdom.nodeLocation on a void element"] = t => {
  const document = jsdom.jsdom(`<p>Hello
    <img src="foo.jpg">
  </p>`);
  const el = document.querySelector("img");

  t.deepEqual(jsdom.nodeLocation(el), { start: 13, end: 32 });
  t.done();
};
