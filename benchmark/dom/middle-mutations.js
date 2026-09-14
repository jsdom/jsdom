"use strict";

const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  for (const liveRange of [false, true]) {
    for (const pattern of ["fixed middle", "random reordering"]) {
      const parent = document.createElement("div");
      const children = Array.from({ length: 1000 }, () => document.createElement("span"));
      const extra = document.createElement("span");
      const range = liveRange ? document.createRange() : null;
      const suffix = liveRange ? "with a live Range" : "without live Ranges";

      bench.add(`${pattern}: 200 moves among 1000 siblings, ${suffix}`, () => {
        for (let i = 0; i < 200; ++i) {
          if (pattern === "fixed middle") {
            parent.insertBefore(extra, children[500]);
            parent.removeChild(extra);
          } else {
            parent.insertBefore(children[(i * 397) % 1000], children[(i * 173 + 501) % 1000]);
          }
        }
      }, {
        beforeEach() {
          parent.replaceChildren(...children);
          if (liveRange) {
            range.selectNodeContents(parent);
          }
        }
      });
    }
  }

  return bench;
};
