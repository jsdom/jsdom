#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */

const fs = require("node:fs");
const path = require("node:path");
const { parseArgs } = require("node:util");

const benchmarkDir = __dirname;
const suites = [];
for (const category of fs.readdirSync(benchmarkDir, { withFileTypes: true })) {
  if (!category.isDirectory()) {
    continue;
  }
  for (const file of fs.readdirSync(path.join(benchmarkDir, category.name), { withFileTypes: true })) {
    if (file.isFile() && file.name.endsWith(".js")) {
      suites.push(`${category.name}/${path.basename(file.name, ".js")}`);
    }
  }
}
suites.sort();

const { values } = parseArgs({
  options: {
    suite: {
      type: "string",
      multiple: true,
      short: "s"
    }
  },
  strict: false
});

let suitesToRun = suites;
if (values.suite) {
  suitesToRun = suites.filter(s => values.suite.some(f => s.startsWith(f)));

  if (suitesToRun.length === 0) {
    console.error(`No suites matched: ${values.suite.join(", ")}`);
    console.error(`Available suites: ${suites.join(", ")}`);
    process.exitCode = 1;
  }
}

(async () => {
  for (const suite of suitesToRun) {
    const bench = require(`./${suite}`)();

    console.log(`\n# ${suite}\n`);
    await bench.run();
    console.table(bench.table());
  }
})();
