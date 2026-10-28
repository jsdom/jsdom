"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  for (const count of [16, 128, 1024]) {
    let window, element, version;
    const options = {
      beforeAll() {
        ({ window } = new JSDOM());
        const { document } = window;
        const style = document.createElement("style");
        style.textContent = Array.from({ length: count }, (_, i) => {
          return `.rule-${i} { color: blue; display: block; margin-top: 2px; }`;
        }).join("\n");
        document.head.append(style);
        element = document.createElement("div");
        element.className = `rule-${count - 1}`;
        document.body.append(element);
        version = 0;
      },
      afterAll() {
        window.close();
      },
    };

    bench.add(
      `attribute mutation and computed properties (${count} rules)`,
      () => {
        element.setAttribute("data-version", String(version++));
        const computed = window.getComputedStyle(element);
        return [computed.color, computed.display, computed.marginTop];
      },
      options,
    );

    bench.add(
      `cached computed properties (${count} rules)`,
      () => {
        const computed = window.getComputedStyle(element);
        return [computed.color, computed.display, computed.marginTop];
      },
      options,
    );
  }

  for (const depth of [10, 100, 500]) {
    let window, ancestor, leaf, version;
    bench.add(
      `inherited color after ancestor mutation (${depth} levels)`,
      () => {
        ancestor.style.color = version++ % 2 ? "red" : "blue";
        return window.getComputedStyle(leaf).color;
      },
      {
        beforeAll() {
          ({ window } = new JSDOM());
          const { document } = window;
          ancestor = document.createElement("div");
          document.body.append(ancestor);
          leaf = ancestor;
          for (let i = 1; i < depth; i++) {
            const child = document.createElement("div");
            leaf.append(child);
            leaf = child;
          }
          version = 0;
        },
        afterAll() {
          window.close();
        },
      },
    );
  }

  for (const matching of [false, true]) {
    let window, style, target, revision;
    bench.add(
      `fresh stylesheet with ${matching ? "matching" : "unmatched"} ancestor selectors (128 rules)`,
      () => {
        revision++;
        style.textContent = Array.from({ length: 128 }, (_, index) => {
          return (
            `.ancestor-${index} .target { box-shadow: ${revision * 128 + index}px 2px 3px 4px red, ` +
            "inset 1px 2px blue; }"
          );
        }).join("\n");
        return window.getComputedStyle(target).boxShadow;
      },
      {
        beforeAll() {
          ({ window } = new JSDOM());
          const { document } = window;
          style = document.createElement("style");
          document.head.append(style);
          target = document.createElement("div");
          target.className = "target";
          document.body.append(target);
          document.body.className = matching ? "ancestor-127" : "never-matches";
          revision = 0;
        },
        afterAll() {
          window.close();
        },
      },
    );
  }

  return bench;
};
