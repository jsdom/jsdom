"use strict";
const documentBench = require("../document-bench");

const READ_COUNT = 100;
const SIZES = [10, 100, 500, 2000];
const NAME_PROFILES = ["none", "distinct", "duplicate"];

module.exports = () => {
  const { document, bench } = documentBench();
  const { namedItem } = document.defaultView.HTMLCollection.prototype;

  for (const count of SIZES) {
    for (const profile of NAME_PROFILES) {
      let container, collection, first, last, firstKey, lastKey, idKeys, generation;
      const prefix = `${count} elements, ${profile} names`;

      function createContainer() {
        generation = 0;
        container = document.createElement("div");
        idKeys = [];
        for (let i = 0; i < count; ++i) {
          const child = document.createElement("style");
          if (profile !== "none") {
            const suffix = profile === "distinct" ? i : "shared";
            child.id = `id-${suffix}`;
            child.setAttribute("name", `name-${suffix}`);
            idKeys.push(child.id);
          }
          container.appendChild(child);
        }
        document.body.appendChild(container);
        collection = container.children;
        first = container.firstElementChild;
        last = container.lastElementChild;
        firstKey = idKeys[0];
        lastKey = idKeys[count - 1];
        // Start unchanged-collection tasks with both the list and any named cache materialized.
        // Mutation tasks invalidate them inside the timed operation, including the rebuild cost.
        if (collection.length !== count) {
          throw new Error("Unexpected initial collection length");
        }
      }

      function addTask(name, run) {
        bench.add(`${prefix}: ${name}`, run, {
          beforeAll: createContainer,
          afterAll() {
            container.remove();
          }
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

      addTask("warm Array.from", () => Array.from(collection));
      addTask("warm Object.keys", () => Object.keys(collection));
      addTask("warm Object.getOwnPropertyNames", () => Object.getOwnPropertyNames(collection));

      addTask("warm namedItem miss x100", () => {
        for (let i = 0; i < READ_COUNT; ++i) {
          if (collection.namedItem("absent") !== null) {
            throw new Error("Unexpected named item");
          }
        }
      });

      addTask("append + one length read + remove", () => {
        const child = container.appendChild(document.createElement("style"));
        const { length } = collection;
        child.remove();
        if (length !== count + 1) {
          throw new Error("Unexpected collection length after append");
        }
      });

      addTask("append + Array.from + remove", () => {
        const child = container.appendChild(document.createElement("style"));
        const snapshot = Array.from(collection);
        child.remove();
        return snapshot;
      });

      addTask("irrelevant attribute change + one length read", () => {
        first.toggleAttribute("data-state");
        return collection.length;
      });

      addTask("rename id + namedItem", () => {
        const key = `renamed-${generation++ % 2}`;
        first.id = key;
        if (collection.namedItem(key) !== first) {
          throw new Error("Renamed id unexpectedly missing");
        }
      });

      addTask("rename name + namedItem", () => {
        const key = `renamed-${generation++ % 2}`;
        first.setAttribute("name", key);
        if (collection.namedItem(key) !== first) {
          throw new Error("Renamed name unexpectedly missing");
        }
      });

      addTask("fresh getElementsByTagName + namedItem miss", () => {
        // Invalidate query memoization so each operation constructs a new collection.
        // Include invalidation and collection construction in the measured operation.
        container.toggleAttribute("data-query");
        return container.getElementsByTagName("style").namedItem("absent");
      });

      if (profile !== "none") {
        addTask("warm namedItem first hit x100", () => {
          for (let i = 0; i < READ_COUNT; ++i) {
            if (collection.namedItem(firstKey) !== first) {
              throw new Error("First named item unexpectedly missing");
            }
          }
        });

        addTask("fresh collection + borrowed namedItem first hit", () => {
          container.toggleAttribute("data-query");
          const fresh = container.getElementsByTagName("style");
          // Avoid the separate named lookup caused by retrieving the method from the collection.
          if (namedItem.call(fresh, firstKey) !== first) {
            throw new Error("First named item unexpectedly missing");
          }
        });
      }

      if (profile === "distinct") {
        addTask("warm namedItem last hit x100", () => {
          for (let i = 0; i < READ_COUNT; ++i) {
            if (collection.namedItem(lastKey) !== last) {
              throw new Error("Last named item unexpectedly missing");
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
      }
    }
  }

  return bench;
};
