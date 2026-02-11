"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  // Based on the hard part of
  // https://github.com/web-platform-tests/wpt/blob/3b19057653a313f4ee7d6ff90c01456962d87d12/html/semantics/tabular-data/processing-model-1/span-limits.html
  // which was noticed to be slow.
  bench.add("tables", () => {
    document.body.innerHTML = "<table border=1><tr><td rowspan=65534 id=c1>a</td></table>";

    let s = "";
    for (let i = 0; i < 65532; i++) {
      s += "<tr><td>";
    }
    s += "<tr><td id=d2><tr><td>a<td>";
    document.querySelector("table").firstElementChild.innerHTML += s;
  });

  // Measures the time spent parsing and creating a large text node
  // https://github.com/jsdom/jsdom/pull/2419
  bench.add("text", () => {
    document.body.innerHTML = `
  <p>
    ${"Some methods have unexpected implications for performance. ".repeat(5000)}
  </p>`;
  });

  return bench;
};
