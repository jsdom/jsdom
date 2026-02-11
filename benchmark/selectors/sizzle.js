"use strict";
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const htmlFile = path.resolve(__dirname, "sizzle-speed/selector.html");
const domstr = fs.readFileSync(htmlFile, { encoding: "utf8" });

const cssFile = path.resolve(__dirname, "sizzle-speed/selectors.large.css");
const selectors = fs.readFileSync(cssFile, { encoding: "utf8" }).split("\n");
const total = selectors.length;

module.exports = () => {
  const { document } = (new JSDOM(domstr)).window;
  const bench = new Bench();

  let qsaFails = 0;
  let qsaCycles = 0;
  let qsFails = 0;
  let qsCycles = 0;

  bench.add("querySelectorAll", () => {
    for (const selector of selectors) {
      try {
        document.querySelectorAll(selector);
      } catch {
        qsaFails++;
      }
    }
    qsaCycles++;
  }, {
    afterAll() {
      console.log(`${(qsaFails / qsaCycles).toFixed(0)}/${total} fails.`);
    }
  });

  bench.add("querySelector", () => {
    for (const selector of selectors) {
      try {
        document.querySelector(selector);
      } catch {
        qsFails++;
      }
    }
    qsCycles++;
  }, {
    afterAll() {
      console.log(`${(qsFails / qsCycles).toFixed(0)}/${total} fails.`);
    }
  });

  return bench;
};
