"use strict";
const documentBench = require("../document-bench");

// Build the DOM once per task to measure repeated getComputedStyle() calls for
// unchanged elements. These calls create computed-style objects without reading
// properties; property resolution has separate benchmarks.

const SIBLINGS = 20;
const DEPTH = 10;

let siblings = [];
let nested = [];

module.exports = () => {
  const { document, bench } = documentBench((doc) => {
    siblings = [];
    for (let i = 0; i < SIBLINGS; i++) {
      const div = doc.createElement("div");
      div.style.color = "blue";
      doc.body.appendChild(div);
      siblings.push(div);
    }

    nested = [];
    let parent = doc.body;
    for (let i = 0; i < DEPTH; i++) {
      const div = doc.createElement("div");
      div.style.color = "blue";
      parent.appendChild(div);
      nested.push(div);
      parent = div;
    }
  });
  const window = document.defaultView;

  bench.add("flat (20 siblings)", () => {
    for (const div of siblings) {
      window.getComputedStyle(div);
    }
  });

  bench.add("deep (10-level nesting)", () => {
    window.getComputedStyle(nested[nested.length - 1]);
  });

  bench.add("deep, all levels (10-level nesting)", () => {
    for (const el of nested) {
      window.getComputedStyle(el);
    }
  });

  return bench;
};
