"use strict";
const suite = require("../document-suite");

exports["setAttribute(): Remove a named property from window"] = function () {
  const NODES = 1000;
  let nodes;
  let parent;

  return suite({
    setup(document) {
      parent = document.createElement("div");

      nodes = new Array(NODES);
      for (let i = 0; i < NODES; ++i) {
        const node = document.createElement("span");
        nodes[i] = node;
        node.setAttribute("id", "named" + i);
        parent.appendChild(node);
      }

      document.body.appendChild(parent);
    },
    tearDown(document) {
      document.body.removeChild(parent);
      nodes = null;
      parent = null;
    },
    fn() {
      for (let i = 0; i < NODES; ++i) {
        nodes[i].removeAttribute("id");
      }
    }
  });
};
