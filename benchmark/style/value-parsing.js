"use strict";

const assert = require("node:assert/strict");
const documentBench = require("../document-bench.js");

module.exports = () => {
  const { document, bench } = documentBench();
  const { CSS } = document.defaultView;

  const values = [
    ["width", (index) => `${index}.5px`],
    ["color", (index) => `rgb(${index / 1000} 20 30)`],
    ["background", (index) => `linear-gradient(${index}deg, red, blue) center / cover no-repeat`],
    ["box-shadow", (index) => `${index}px 2px 3px 4px red, inset 1px 2px blue`],
  ];
  for (const [property, value] of values) {
    let counter = 0;
    assert(CSS.supports(property, value(1)));
    bench.add(`Parse a new ${property} value`, () => {
      CSS.supports(property, value(++counter));
    });
  }

  let counter = 0;
  const { style } = document.createElement("div");
  bench.add("Assign a new declaration block", () => {
    style.cssText = `margin: ${++counter}px; color: red; border: 1px solid black; padding: 2px 4px;`;
  });

  return bench;
};
