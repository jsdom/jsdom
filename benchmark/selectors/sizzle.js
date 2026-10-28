"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const htmlFile = path.resolve(__dirname, "sizzle-speed/selector.html");
const domstr = fs.readFileSync(htmlFile, { encoding: "utf8" });

const validFile = path.resolve(__dirname, "sizzle-speed/selectors.valid.txt");
const validSelectors = fs.readFileSync(validFile, "utf8").split("\n").filter(Boolean);
const invalidFile = path.resolve(__dirname, "sizzle-speed/selectors.invalid.txt");
const invalidSelectors = fs.readFileSync(invalidFile, "utf8").split("\n").filter(Boolean);

module.exports = () => {
  const { document } = new JSDOM(domstr).window;
  const bench = new Bench();

  // Check the fixed corpus outside timing, including the exception type for rejected selectors.
  for (const method of ["querySelectorAll", "querySelector"]) {
    for (const selector of validSelectors) {
      assert.doesNotThrow(
        () => document[method](selector),
        `${method}: ${JSON.stringify(selector)}`,
      );
    }
    for (const selector of invalidSelectors) {
      assert.throws(
        () => document[method](selector),
        {
          name: "SyntaxError",
        },
        `${method}: ${JSON.stringify(selector)}`,
      );
    }
  }

  bench.add("querySelectorAll (valid selectors)", () => {
    for (const selector of validSelectors) {
      document.querySelectorAll(selector);
    }
  });

  bench.add("querySelectorAll (invalid selectors)", () => {
    for (const selector of invalidSelectors) {
      try {
        document.querySelectorAll(selector);
      } catch {
        // Syntax rejection and exception construction are part of this workload.
      }
    }
  });

  bench.add("querySelector (valid selectors)", () => {
    for (const selector of validSelectors) {
      document.querySelector(selector);
    }
  });

  bench.add("querySelector (invalid selectors)", () => {
    for (const selector of invalidSelectors) {
      try {
        document.querySelector(selector);
      } catch {
        // Syntax rejection and exception construction are part of this workload.
      }
    }
  });

  return bench;
};
