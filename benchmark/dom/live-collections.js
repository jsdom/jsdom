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

  for (const [name, query] of [
    ["tag name", parent => parent.getElementsByTagName("span")],
    ["all elements", parent => parent.getElementsByTagName("*")],
    ["class name", parent => parent.getElementsByClassName("match")]
  ]) {
    const parent = document.createElement("div");
    parent.innerHTML = '<span class="match"><b>text</b></span><!-- comment -->'.repeat(ITEM_COUNT);
    const collection = query(parent);
    let version = 0;
    bench.add(`${name}: refresh descendants after mutation`, () => {
      parent.setAttribute("data-version", String(++version));
      return collection.length;
    });
  }

  return bench;
};
