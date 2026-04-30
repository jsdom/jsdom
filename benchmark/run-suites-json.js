#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */

// Internal entry point used by `benchmark/compare.js`. Runs the requested suites
// and writes one JSON object per suite to stdout (one per line). All progress
// messages go to stderr so stdout stays parseable.

const { parseArgs } = require("node:util");
const { discoverSuites, filterSuites, runSuite } = require("./lib");

const { values } = parseArgs({
  options: {
    suite: { type: "string", multiple: true, short: "s" }
  },
  strict: false
});

const suitesToRun = filterSuites(discoverSuites(), values.suite);

(async () => {
  for (const suiteName of suitesToRun) {
    process.stderr.write(`  running ${suiteName}\n`);
    const result = await runSuite(suiteName);
    process.stdout.write(`${JSON.stringify(result)}\n`);
  }
})().catch(err => {
  console.error(err);
  process.exit(1);
});
