"use strict";
const assert = require("node:assert/strict");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  function addCase(elementCount, ruleCount, mutate) {
    let window, changing, computed, changingComputed, revision;
    const name =
      `${mutate ? "mutate independent region and reread" : "reread cached"} styles ` +
      `(${elementCount} elements, ${ruleCount} rules)`;
    bench.add(
      name,
      () => {
        if (mutate) {
          changing.className = ++revision % 2 ? "changing active" : "changing";
        }
        let totalLength = changingComputed.color.length;
        for (const style of computed) {
          totalLength += style.color.length + style.marginTop.length;
        }
        return totalLength;
      },
      {
        beforeAll() {
          ({ window } = new JSDOM());
          const { document } = window;
          const sheet = document.createElement("style");
          const rules = [];
          for (let layer = 0; layer < 4; layer++) {
            rules.push(`@layer layer-${layer} {
            @property --accent { syntax: "<color>"; inherits: false; initial-value: green; }
            ${Array.from({ length: ruleCount / 4 }, (_, i) => {
              return `.item-${(layer * ruleCount) / 4 + i} { color: var(--accent); margin-top: 2px; }`;
            }).join("\n")}
          }`);
          }
          sheet.textContent =
            rules.join("\n") + ".changing { color: red; } .changing.active { color: blue; }";
          document.head.append(sheet);
          changing = document.createElement("div");
          changing.className = "changing";
          const container = document.createElement("section");
          const elements = Array.from({ length: elementCount }, (_, i) => {
            const element = document.createElement("div");
            element.className = `item-${i % ruleCount}`;
            container.append(element);
            return element;
          });
          document.body.append(changing, container);
          changingComputed = window.getComputedStyle(changing);
          computed = elements.map((element) => window.getComputedStyle(element));
          // Warm the public computed declarations, checking that the mutation changes only its own region.
          for (const active of [false, true, false]) {
            changing.className = active ? "changing active" : "changing";
            assert.equal(changingComputed.color, active ? "rgb(0, 0, 255)" : "rgb(255, 0, 0)");
            for (const style of computed) {
              assert.equal(style.color, "rgb(0, 128, 0)");
              assert.equal(style.marginTop, "2px");
            }
          }
          revision = 0;
        },
        afterAll() {
          window.close();
        },
      },
    );
  }

  for (const elements of [1, 32, 256]) {
    addCase(elements, 128, false);
    addCase(elements, 128, true);
  }
  for (const rules of [16, 1024]) {
    addCase(32, rules, true);
  }

  return bench;
};
