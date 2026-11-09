"use strict";

const assert = require("node:assert/strict");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  for (const property of ["margin", "all"]) {
    for (const count of [0, 128]) {
      const customProperties = Array.from(
        { length: count },
        (_, index) => `--property-${index}: value-${index};`,
      ).join(" ");
      for (const replace of [false, true]) {
        let window, style;
        const cssText = customProperties + (replace ? `${property}: initial;` : "");
        bench.add(
          `${replace ? "replace" : "insert"} ${property} shorthand (${count} custom properties)`,
          () => {
            style.setProperty(property, "inherit");
          },
          {
            beforeAll() {
              ({ window } = new JSDOM());
              style = window.document.createElement("div").style;
            },
            beforeEach() {
              style.cssText = cssText;
            },
            afterAll() {
              assert.equal(style.getPropertyValue(property), "inherit");
              window.close();
            },
          },
        );
      }
    }
  }
  return bench;
};
