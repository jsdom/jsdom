"use strict";
const documentBench = require("../document-bench");

const NODES = 1000;

module.exports = () => {
  const { document, bench } = documentBench();

  let nodes, parent;

  function createSubtree() {
    parent = document.createElement("div");
    nodes = new Array(NODES);
    for (let i = 0; i < NODES; ++i) {
      const node = document.createElement("span");
      nodes[i] = node;
      parent.appendChild(node);
    }
  }

  bench.add("setAttribute(): Set irrelevant attributes on connected elements", () => {
    for (let i = 0; i < NODES; ++i) {
      const node = nodes[i];
      node.setAttribute("class", "item");
      node.setAttribute("data-state", "ready");
      node.setAttribute("aria-hidden", "false");
    }
  }, {
    beforeEach() {
      createSubtree();
      document.body.appendChild(parent);
    },
    afterEach() {
      parent.remove();
    }
  });

  bench.add("appendChild()/remove(): Attach and remove an irrelevant subtree", () => {
    document.body.appendChild(parent);
    parent.remove();
  }, {
    beforeEach() {
      createSubtree();
    }
  });

  bench.add("removeAttribute(): Remove named ids from connected elements", () => {
    for (let i = 0; i < NODES; ++i) {
      nodes[i].removeAttribute("id");
    }
  }, {
    beforeEach() {
      createSubtree();
      for (let i = 0; i < NODES; ++i) {
        nodes[i].setAttribute("id", "named" + i);
      }
      document.body.appendChild(parent);
    },
    afterEach() {
      parent.remove();
    }
  });

  return bench;
};
