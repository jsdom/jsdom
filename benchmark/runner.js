#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */

const { parseArgs } = require("node:util");
const { discoverSuites, filterSuites, runSuite, renderSuiteResults } = require("./lib");

const { values } = parseArgs({
  options: {
    suite: {
      type: "string",
      multiple: true,
      short: "s"
    },
    format: {
      type: "string",
      short: "f",
      default: "terminal"
    }
  },
  strict: false
});

if (values.format !== "terminal" && values.format !== "markdown") {
  console.error(`Unknown format: ${values.format}. Expected "terminal" or "markdown".`);
  process.exit(1);
}

const suites = discoverSuites();
const suitesToRun = filterSuites(suites, values.suite);

if (values.suite && suitesToRun.length === 0) {
  console.error(`No suites matched: ${values.suite.join(", ")}`);
  console.error(`Available suites: ${suites.join(", ")}`);
  process.exit(1);
}

(async () => {
  for (const suiteName of suitesToRun) {
    const result = await runSuite(suiteName);
    console.log(`\n# ${suiteName}\n`);
    console.log(renderSuiteResults(values.format, result));
  }
})();
