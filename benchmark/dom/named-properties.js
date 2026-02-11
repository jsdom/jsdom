"use strict";
const documentBench = require("../document-bench");

const NODES = 1000;

module.exports = () => {
  const { document, bench } = documentBench();

  bench.add("setAttribute(): Remove a named property from window", () => {
    const parent = document.createElement("div");
    const nodes = new Array(NODES);
    for (let i = 0; i < NODES; ++i) {
      const node = document.createElement("span");
      nodes[i] = node;
      node.setAttribute("id", "named" + i);
      parent.appendChild(node);
    }
    document.body.appendChild(parent);

    for (let i = 0; i < NODES; ++i) {
      nodes[i].removeAttribute("id");
    }

    document.body.removeChild(parent);
  });

  return bench;
};
