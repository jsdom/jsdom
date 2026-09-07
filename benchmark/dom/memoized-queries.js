"use strict";
const documentBench = require("../document-bench");

const DEPTH = 12;
const READS = 100;
const TAG_NAMES = ["a", "abbr", "address", "article", "aside", "b", "blockquote", "button"];

module.exports = () => {
  const { document, bench } = documentBench();
  const root = document.createElement("div");
  let target = root;

  for (let i = 1; i < DEPTH; ++i) {
    const child = document.createElement("div");
    target.append(child);
    target = child;
  }

  const queryRoot = document.createElement("div");
  for (const tagName of TAG_NAMES) {
    queryRoot.append(document.createElement(tagName));
  }
  for (const tagName of TAG_NAMES) {
    queryRoot.getElementsByTagName(tagName);
  }
  queryRoot.getElementsByTagNameNS(null, "a");

  bench.add(`toggleAttribute(): depth ${DEPTH} without query reads`, () => {
    target.toggleAttribute("data-mutated");
  });

  bench.add(`getElementsByTagName(): ${READS} cached reads`, () => {
    for (let i = 0; i < READS; ++i) {
      queryRoot.getElementsByTagName("a");
    }
  });

  let tagNameIndex = 0;
  bench.add(`getElementsByTagName(): ${READS} cached reads across eight names`, () => {
    for (let i = 0; i < READS; ++i) {
      queryRoot.getElementsByTagName(TAG_NAMES[tagNameIndex++ & 7]);
    }
  });

  bench.add(`getElementsByTagNameNS(): ${READS} cached null-namespace reads`, () => {
    for (let i = 0; i < READS; ++i) {
      queryRoot.getElementsByTagNameNS(null, "a");
    }
  });

  bench.add("getElementsByTagName(): mutation followed by a read", () => {
    queryRoot.firstChild.toggleAttribute("data-mutated");
    queryRoot.getElementsByTagName("a");
  });

  for (const size of [20, 250]) {
    const container = document.createElement("div");
    container.innerHTML = Array.from({ length: size }, (_, i) => {
      return `<div data-testid="row-${i}"><span></span></div>`;
    }).join("");
    const last = container.lastElementChild;
    const selectors = ["[data-testid]", `[data-testid="row-${size - 1}"]`, '[data-testid="missing"]'];
    const options = {
      beforeAll() {
        document.body.append(container);
        for (const selector of selectors) {
          container.querySelectorAll(selector);
        }
      }
    };

    for (const selector of selectors) {
      bench.add(`querySelectorAll(${selector}): ${size} rows, warm`, () => {
        return container.querySelectorAll(selector).length;
      }, options);
    }

    for (const reads of [1, 5, 20]) {
      for (const mutation of ["attribute", "subtree"]) {
        bench.add(`querySelectorAll(): ${size} rows, ${mutation} mutation then ${reads} query pairs`, () => {
          if (mutation === "attribute") {
            last.toggleAttribute("data-dirty");
          } else {
            last.replaceChildren(document.createElement("span"));
          }
          let matches = 0;
          for (let i = 0; i < reads; ++i) {
            matches += container.querySelectorAll(selectors[0]).length;
            matches += container.querySelectorAll(selectors[1]).length;
          }
          return matches;
        }, options);
      }
    }

    let selectorIndex = 0;
    bench.add(`querySelectorAll(): ${size} rows, cycle through 32 selectors`, () => {
      return container.querySelectorAll(`[data-testid="row-${selectorIndex++ % 32}"]`).length;
    }, options);
  }

  return bench;
};
