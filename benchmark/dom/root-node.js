"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  // Repeated getRootNode() on the deepest node of a static deep tree.
  // Best case for caching: many reads, no mutations.
  // Real-world: framework checking node.getRootNode() === document during a rendering cycle.
  {
    const DEPTH = 200;
    const { document } = new JSDOM().window;
    let deepest = document.body;
    for (let i = 0; i < DEPTH; i++) {
      const child = document.createElement("div");
      deepest.appendChild(child);
      deepest = child;
    }

    bench.add(`getRootNode: depth ${DEPTH}`, () => {
      deepest.getRootNode();
    });
  }

  // isConnected on a deep static tree.
  // isConnected uses shadowIncludingRoot -> nodeRoot internally.
  // Common in frameworks to check if an element is still in the DOM.
  {
    const DEPTH = 200;
    const { document } = new JSDOM().window;
    let deepest = document.body;
    for (let i = 0; i < DEPTH; i++) {
      const child = document.createElement("div");
      deepest.appendChild(child);
      deepest = child;
    }

    bench.add(`isConnected: depth ${DEPTH}`, () => {
      deepest.isConnected; // eslint-disable-line no-unused-expressions
    });
  }

  // Append + remove at depth.
  // Tests nodeRoot calls during tree mutation operations (slot checks, etc.).
  // The parent's root doesn't change, so caching should help.
  {
    const DEPTH = 200;
    const { document } = new JSDOM().window;
    let parent = document.body;
    for (let i = 0; i < DEPTH; i++) {
      const child = document.createElement("div");
      parent.appendChild(child);
      parent = child;
    }

    bench.add(`appendChild+removeChild: at depth ${DEPTH}`, () => {
      const child = document.createElement("div");
      parent.appendChild(child);
      parent.removeChild(child);
    });
  }

  // Build a detached tree from the leaves up, then connect it.
  // Each append inserts a whole subtree, and insertion checks every node in it for connectedness.
  // Real-world: frameworks that assemble a subtree before attaching it to the document.
  for (const DEPTH of [10, 40]) {
    const { document } = new JSDOM().window;

    bench.add(`bottom-up build and connect: depth ${DEPTH}`, () => {
      let subtree = document.createElement("div");
      for (let i = 1; i < DEPTH; i++) {
        const parent = document.createElement("div");
        parent.appendChild(subtree);
        subtree = parent;
      }
      document.body.appendChild(subtree);
      document.body.removeChild(subtree);
    });
  }

  // isConnected on a deep detached tree, whose root cannot be cached.
  {
    const DEPTH = 200;
    const { document } = new JSDOM().window;
    let deepest = document.createElement("div");
    for (let i = 0; i < DEPTH; i++) {
      const child = document.createElement("div");
      deepest.appendChild(child);
      deepest = child;
    }

    bench.add(`isConnected: detached, depth ${DEPTH}`, () => {
      deepest.isConnected; // eslint-disable-line no-unused-expressions
    });
  }

  return bench;
};
