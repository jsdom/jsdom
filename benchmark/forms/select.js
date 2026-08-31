"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  bench.add("append 2,000 options", () => {
    const select = document.createElement("select");
    for (let i = 0; i < 2000; i++) {
      select.append(document.createElement("option"));
    }
  });

  return bench;
};
