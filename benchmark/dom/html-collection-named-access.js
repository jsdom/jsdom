"use strict";
const documentBench = require("../document-bench");

const ITEM_COUNT = 500;

module.exports = () => {
  const { document, bench } = documentBench();

  let container;

  function createContainer() {
    container = document.createElement("div");
    for (let i = 0; i < ITEM_COUNT; ++i) {
      const child = document.createElement("style");
      child.setAttribute("data-index", String(i));
      container.appendChild(child);
    }
    document.body.appendChild(container);
  }

  function removeContainer() {
    container.remove();
  }

  bench.add("HTMLCollection: read .length repeatedly", () => {
    const collection = container.children;
    let total = 0;
    for (let i = 0; i < 100; ++i) {
      total += collection.length;
    }
    return total;
  }, { beforeEach: createContainer, afterEach: removeContainer });

  bench.add("HTMLCollection: Array.from() an unchanged collection", () => {
    return Array.from(container.children).length;
  }, { beforeEach: createContainer, afterEach: removeContainer });

  bench.add("HTMLCollection: namedItem() miss", () => {
    const collection = container.children;
    for (let i = 0; i < 100; ++i) {
      if (collection.namedItem("absent") !== null) {
        throw new Error("Unexpected named item");
      }
    }
  }, { beforeEach: createContainer, afterEach: removeContainer });

  bench.add("HTMLCollection: namedItem() hit on the last element", () => {
    const collection = container.children;
    for (let i = 0; i < 100; ++i) {
      if (collection.namedItem("last") === null) {
        throw new Error("Named item unexpectedly missing");
      }
    }
  }, {
    beforeEach() {
      createContainer();
      container.lastElementChild.id = "last";
    },
    afterEach: removeContainer
  });

  bench.add("HTMLCollection: append an element then re-read the collection", () => {
    const child = document.createElement("style");
    container.appendChild(child);
    const { length } = Array.from(container.children);
    child.remove();
    return length;
  }, { beforeEach: createContainer, afterEach: removeContainer });

  bench.add("HTMLCollection: single named read of a fresh collection", () => {
    return container.children.namedItem("absent");
  }, { beforeEach: createContainer, afterEach: removeContainer });

  return bench;
};
