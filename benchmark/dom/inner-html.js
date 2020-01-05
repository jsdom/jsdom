"use strict";
const suite = require("../document-suite");

// Based on the hard part of
// https://github.com/web-platform-tests/wpt/blob/3b19057653a313f4ee7d6ff90c01456962d87d12/html/semantics/tabular-data/processing-model-1/span-limits.html
// which was noticed to be slow.

exports.tables = suite(document => {
  document.body.innerHTML = "<table border=1><tr><td rowspan=65534 id=c1>a</td></table>";

  let s = "";
  for (let i = 0; i < 65532; i++) {
    s += "<tr><td>";
  }
  s += "<tr><td id=d2><tr><td>a<td>";
  document.querySelector("table").firstElementChild.innerHTML += s;
});
