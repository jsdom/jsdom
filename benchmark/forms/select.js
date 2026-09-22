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

  bench.add("append and remove an optgroup with 2,000 options", () => {
    const select = document.createElement("select");
    const group = document.createElement("optgroup");
    for (let i = 0; i < 2000; i++) {
      group.append(document.createElement("option"));
    }
    select.append(group);
    group.remove();
  });

  bench.add("append and remove a select with 2,000 options", () => {
    const select = document.createElement("select");
    for (let i = 0; i < 2000; i++) {
      select.append(document.createElement("option"));
    }
    document.body.append(select);
    select.remove();
  });

  return bench;
};
