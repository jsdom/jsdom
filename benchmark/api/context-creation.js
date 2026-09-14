"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  bench.add("new JSDOM() and close with runScripts: outside-only", () => {
    const dom = new JSDOM("", { runScripts: "outside-only" });
    dom.window.close();
  });

  return bench;
};
