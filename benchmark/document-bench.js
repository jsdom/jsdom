"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("..");

module.exports = function documentBench(setup) {
  const { document } = (new JSDOM()).window;
  const bench = new Bench({
    setup() {
      document.body.innerHTML = "";
      if (setup) {
        setup(document);
      }
    }
  });
  return { document, bench };
};
