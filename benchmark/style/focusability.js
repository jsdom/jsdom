"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

// Focusing reads `display` on every flat-tree ancestor. Component stylesheets give those
// ancestors many matching rules that never declare `display`.
module.exports = () => {
  const bench = new Bench();

  for (const count of [16, 128]) {
    for (const cssom of [false, true]) {
      let window, input, version;
      const label = `${count} matching rules per ancestor${cssom ? ", inserted through CSSOM" : ""}`;
      const options = {
        beforeAll() {
          ({ window } = new JSDOM());
          const { document } = window;
          const rules = [
            ".level { display: block; }",
            ...Array.from({ length: count }, (_, i) => {
              return `div.level:not(.unused-${i}) { color: blue; margin-top: ${i}px; }`;
            }),
          ];
          const style = document.createElement("style");
          document.head.append(style);
          if (cssom) {
            for (const rule of rules) {
              style.sheet.insertRule(rule, style.sheet.cssRules.length);
            }
          } else {
            style.textContent = rules.join("\n");
          }
          let parent = document.body;
          for (let i = 0; i < 20; i++) {
            const child = document.createElement("div");
            child.className = "level";
            parent.append(child);
            parent = child;
          }
          input = document.createElement("input");
          parent.append(input);
          version = 0;
        },
        afterAll() {
          window.close();
        },
      };

      bench.add(
        `focus after attribute mutation (${label})`,
        () => {
          input.setAttribute("data-version", String(version++));
          input.focus();
          input.blur();
        },
        options,
      );
    }
  }

  return bench;
};
