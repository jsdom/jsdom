"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const depths = [10, 50, 100];
const listenerPatterns = ["none", "delegated", "every tree node"];

// Build each tree and its listeners once, then time dispatch alone. Varying both depth and listener density separates
// the event-path target lookup from the work of invoking callbacks.
module.exports = () => {
  const bench = new Bench();

  for (const depth of depths) {
    for (const listenerPattern of listenerPatterns) {
      addDispatchBenchmark(bench, depth, listenerPattern);
    }
  }

  return bench;
};

function addDispatchBenchmark(bench, depth, listenerPattern) {
  const { document, Event } = (new JSDOM()).window;
  const root = document.createElement("div");
  document.body.append(root);

  const elements = [root];
  let target = root;
  for (let i = 0; i < depth; i++) {
    const child = document.createElement("div");
    target.appendChild(child);
    elements.push(child);
    target = child;
  }

  function listener() {}
  if (listenerPattern === "delegated") {
    root.addEventListener("test", listener, true);
    root.addEventListener("test", listener);
  } else if (listenerPattern === "every tree node") {
    for (const element of elements) {
      element.addEventListener("test", listener, true);
      element.addEventListener("test", listener);
    }
  }

  const event = new Event("test", { bubbles: true });
  bench.add(`dispatchEvent: depth ${depth}, listeners ${listenerPattern}`, () => {
    target.dispatchEvent(event);
  });
}
