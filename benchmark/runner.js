#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */

const consoleReporter = require("./console-reporter");
const pathToSuites = require("./path-to-suites");
const benchmarks = require(".");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const { argv } = yargs(hideBin(process.argv))
  .usage("Run the jsdom benchmark suite")
  .option("suites", {
    type: "array",
    alias: "s",
    describe: "suites that you want to run, e.g.: dom/construction/createElement dom/foo"
  })
  .help();

let suitesToRun;
if (argv.suites) {
  suitesToRun = pathToSuites(benchmarks, argv.suites);
} else {
  suitesToRun = pathToSuites(benchmarks);
}

suitesToRun.forEach(consoleReporter);

function runNext() {
  /* eslint-disable no-invalid-this */
  if (this && this.off) {
    // there is no .once()
    this.off("complete", runNext);
  }
  /* eslint-enable no-invalid-this */

  const suite = suitesToRun.shift();
  if (!suite) {
    console.log("Done!");
    return;
  }

  suite.off("complete", runNext);
  suite.on("complete", runNext);
  suite.run({ async: true });
}

runNext();
