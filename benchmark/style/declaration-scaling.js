"use strict";

const assert = require("node:assert/strict");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  for (const count of [16, 128, 1024]) {
    const names = Array.from({ length: count }, (_, index) => `--property-${index}`);
    const cssText = `.target { ${names.map((name, index) => `${name}: value-${index};`).join(" ")} }`;
    const expectedLength = names.reduce(
      (length, name, index) => length + `value-${index}`.length,
      0,
    );
    for (const all of [false, true]) {
      let window, element, style;
      bench.add(
        `read ${all ? "all properties" : "one property"} from a fresh rule (${count} declarations)`,
        () => {
          if (!all) {
            assert.equal(style.getPropertyValue(names[count - 1]), `value-${count - 1}`);
            return;
          }
          let length = 0;
          for (const name of names) {
            length += style.getPropertyValue(name).length;
          }
          assert.equal(length, expectedLength);
        },
        {
          beforeAll() {
            ({ window } = new JSDOM());
            element = window.document.createElement("style");
            window.document.head.append(element);
          },
          beforeEach() {
            // Reuse parsed stylesheet syntax, but give every iteration unread declaration caches.
            element.textContent = cssText;
            style = element.sheet.cssRules[0].style;
          },
          afterAll() {
            window.close();
          },
        },
      );
    }
  }
  return bench;
};
