"use strict";
const { JSDOM } = require(".");
const parse5 = require("parse5");

const input = "<p test=foo>Hello world!</p>";

const adapter = parse5.treeAdapters.default;
for (const method of Object.getOwnPropertyNames(adapter)) {
  const orig = adapter[method];
  adapter[method] = function (...args) {
    console.log(method, args.map(formatArg));
    return orig.call(this, ...args);
  };
}

function formatArg(arg) {
  if (typeof arg === "object" && arg !== null) {
    return arg.tagName;
  }
  return arg;
}


// const raw = parse5.parse(input);

const dom = new JSDOM("");
console.log("about to serialize");
dom.window.document.write("<p>Hello</p>");
dom.window.document.close();
console.log(dom.serialize());
