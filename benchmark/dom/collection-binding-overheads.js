"use strict";
const documentBench = require("../document-bench");

const READ_COUNT = 100;
const SIZES = [0, 1, 1000];
const COLLECTION_TYPES = [
  ["children", "div", "span"],
  ["elements", "form", "input"],
  ["options", "select", "option"],
  ["attributes", "div"]
];

module.exports = () => {
  const { document, bench } = documentBench();

  for (const [kind, containerName, childName] of COLLECTION_TYPES) {
    for (const count of SIZES) {
      let container, collection;

      function createCollection() {
        container = document.createElement(containerName);
        for (let i = 0; i < count; ++i) {
          if (kind === "attributes") {
            container.setAttribute(`data-value-${i}`, String(i));
          } else {
            const child = document.createElement(childName);
            child.id = `id-${i}`;
            child.setAttribute("name", `name-${i}`);
            container.appendChild(child);
          }
        }
        document.body.appendChild(container);
        collection = container[kind];
        if (collection.length !== count) {
          throw new Error("Unexpected initial collection length");
        }
      }

      const options = {
        beforeAll: createCollection,
        afterAll() {
          container.remove();
        }
      };

      bench.add(`${kind}, ${count} items: warm length x100`, () => {
        let total = 0;
        for (let i = 0; i < READ_COUNT; ++i) {
          total += collection.length;
        }
        if (total !== count * READ_COUNT) {
          throw new Error("Unexpected collection length");
        }
      }, options);

      bench.add(`${kind}, ${count} items: warm Array.from`, () => {
        const snapshot = Array.from(collection);
        if (snapshot.length !== count) {
          throw new Error("Unexpected snapshot length");
        }
        return snapshot;
      }, options);
    }
  }

  return bench;
};
