"use strict";
const documentBench = require("../document-bench");

const READ_COUNT = 100;
const COLLECTIONS = [
  ["children", "div", "style", 0, false],
  ["children", "div", "style", 1, false],
  ["children", "div", "style", 100, false],
  ["children", "div", "style", 1000, false],
  ["children", "div", "style", 1000, true],
  ["elements", "form", "input", 0, true],
  ["elements", "form", "input", 1000, true],
  ["options", "select", "option", 0, true],
  ["options", "select", "option", 1000, true]
];

module.exports = () => {
  const { document, bench } = documentBench();

  for (const [kind, containerName, childName, count, named] of COLLECTIONS) {
    let container, collection;
    const prefix = `${kind}, ${count} items, ${named ? "distinct" : "no"} names`;

    function createContainer() {
      container = document.createElement(containerName);
      for (let i = 0; i < count; ++i) {
        const child = document.createElement(childName);
        if (named) {
          child.id = `id-${i}`;
          child.setAttribute("name", `name-${i}`);
        }
        container.appendChild(child);
      }
      document.body.appendChild(container);
    }

    function removeContainer() {
      container.remove();
    }

    function addTask(name, run) {
      bench.add(`${prefix}: ${name}`, run, {
        beforeAll() {
          createContainer();
          collection = container[kind];
          // Reuse a materialized collection; mutation tasks include the subsequent refresh.
          if (collection.length !== count) {
            throw new Error("Unexpected initial collection length");
          }
        },
        afterAll: removeContainer
      });
    }

    addTask("warm length x100", () => {
      let total = 0;
      for (let i = 0; i < READ_COUNT; ++i) {
        total += collection.length;
      }
      if (total !== count * READ_COUNT) {
        throw new Error("Unexpected collection length");
      }
    });

    addTask("warm Array.from", () => {
      const snapshot = Array.from(collection);
      if (snapshot.length !== count) {
        throw new Error("Unexpected snapshot length");
      }
      return snapshot;
    });

    if (kind !== "children" || !named) {
      continue;
    }

    const idKeys = Array.from({ length: count }, (_, i) => `id-${i}`);
    const lastKey = idKeys[count - 1];

    addTask("warm namedItem last hit x100", () => {
      const last = container.lastElementChild;
      for (let i = 0; i < READ_COUNT; ++i) {
        if (collection.namedItem(lastKey) !== last) {
          throw new Error("Last named item unexpectedly missing");
        }
      }
    });

    addTask("warm namedItem miss x100", () => {
      for (let i = 0; i < READ_COUNT; ++i) {
        if (collection.namedItem("absent") !== null) {
          throw new Error("Unexpected named item");
        }
      }
    });

    addTask("warm bracket lookup of every id", () => {
      let matched = 0;
      for (const key of idKeys) {
        if (collection[key] !== undefined) {
          ++matched;
        }
      }
      if (matched !== count) {
        throw new Error("Named item unexpectedly missing");
      }
    });

    addTask("warm Object.keys", () => Object.keys(collection));

    addTask("append + one length read + remove", () => {
      const child = container.appendChild(document.createElement(childName));
      const { length } = collection;
      child.remove();
      if (length !== count + 1) {
        throw new Error("Unexpected collection length after append");
      }
    });

    addTask("append + Array.from + remove", () => {
      const child = container.appendChild(document.createElement(childName));
      const snapshot = Array.from(collection);
      child.remove();
      if (snapshot.length !== count + 1) {
        throw new Error("Unexpected snapshot length after append");
      }
      return snapshot;
    });

    bench.add(`${prefix}: single namedItem miss on a fresh collection`, () => {
      if (container.children.namedItem("absent") !== null) {
        throw new Error("Unexpected named item");
      }
    }, {
      // Exclude DOM construction, but include the first collection access in each sample.
      beforeEach: createContainer,
      afterEach: removeContainer
    });
  }

  return bench;
};
