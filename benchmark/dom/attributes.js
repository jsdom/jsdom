"use strict";
const documentBench = require("../document-bench");

const ELEMENTS_PER_RUN = 100;

module.exports = () => {
  const { document, bench } = documentBench();

  bench.add("create 100 elements with attributes", () => {
    for (let i = 0; i < ELEMENTS_PER_RUN; ++i) {
      const element = document.createElement("div");
      element.setAttribute("id", "row-1");
      element.setAttribute("class", "row selected");
      element.setAttribute("data-index", "1");
      element.setAttribute("aria-label", "Row 1");
      element.setAttribute("title", "Row 1");
    }
  });

  return bench;
};
