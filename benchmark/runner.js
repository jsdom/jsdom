#!/usr/bin/env node
"use strict";
/* eslint-disable no-console */

const consoleReporter = require("./console-reporter");
const pathToSuites = require("./path-to-suites");
const benchmarks = require(".");
const fs = require("fs");
const path = require("path");
const toFileUrl = require("../lib/jsdom/utils").toFileUrl;

const optimist = require("optimist")
  .usage("Run the jsdom benchmark suite")
  .alias("s", "suites")
  .string("s")
  .describe("s", "suites that you want to run. ie: -s dom/construction/createElement,dom/foo")
  .describe("bundle", "generate the JavaScript bundle required to run benchmarks in a browser")
  .alias("h", "help")
  .describe("h", "show the help");

if (optimist.argv.help) {
  optimist.showHelp();
  return;
}

if (optimist.argv.bundle) {
  const bundle = require("browserify")({ debug: true });
  bundle.require(path.resolve(__dirname, ".."), { expose: "jsdom" });
  bundle.require(path.resolve(__dirname, "browser-runner.js"), { expose: "jsdom-browser-runner" });

  bundle.bundle()
    .pipe(fs.createWriteStream(path.resolve(__dirname, "browser-bundle.js")))
    .on("finish", () => {
      console.info("Open the following page in Chrome to begin benchmarking:",
                   toFileUrl(path.resolve(__dirname, "browser-runner.html")));
    });
  return;
}

let suitesToRun;
if (optimist.argv.suites) {
  suitesToRun = pathToSuites(benchmarks, optimist.argv.suites.trim().split(/,/));
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
