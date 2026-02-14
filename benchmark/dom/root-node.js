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
    const { document } = (new JSDOM()).window;
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

  // Event dispatch (bubbling) on a deep tree.
  // Event dispatch calls nodeRoot internally multiple times per ancestor
  // in the event path, making it O(depth^2) without caching.
  {
    const DEPTH = 100;
    const { document, Event } = (new JSDOM()).window;
    let deepest = document.body;
    for (let i = 0; i < DEPTH; i++) {
      const child = document.createElement("div");
      deepest.appendChild(child);
      deepest = child;
    }
    const event = new Event("test", { bubbles: true });

    bench.add(`dispatchEvent (bubbling): depth ${DEPTH}`, () => {
      deepest.dispatchEvent(event);
    });
  }

  // isConnected on a deep static tree.
  // isConnected uses shadowIncludingRoot -> nodeRoot internally.
  // Common in frameworks to check if an element is still in the DOM.
  {
    const DEPTH = 200;
    const { document } = (new JSDOM()).window;
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
    const { document } = (new JSDOM()).window;
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

  return bench;
};
