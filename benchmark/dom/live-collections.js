"use strict";
const documentBench = require("../document-bench");

const ITEM_COUNT = 100;
const REPLACEMENT_COUNT = 25;

module.exports = () => {
  const { document, bench } = documentBench();

  function addUpdateTask(name, property, readAfterEveryMutation) {
    bench.add(name, () => {
      const parent = document.createElement("div");
      for (let i = 0; i < ITEM_COUNT; ++i) {
        parent.appendChild(document.createElement("span"));
      }
      const collection = parent[property];

      for (let i = 0; i < REPLACEMENT_COUNT; ++i) {
        parent.removeChild(parent.firstChild);
        if (readAfterEveryMutation) {
          collection.item(0);
        }
        parent.appendChild(document.createElement("span"));
        if (readAfterEveryMutation) {
          collection.item(0);
        }
      }

      return collection.length;
    });
  }

  addUpdateTask("childNodes: read after updating list", "childNodes", false);
  addUpdateTask("childNodes: read after every mutation", "childNodes", true);
  addUpdateTask("children: read after updating list", "children", false);
  addUpdateTask("children: read after every mutation", "children", true);

  return bench;
};
