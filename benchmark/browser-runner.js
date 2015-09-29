"use strict";
/* eslint no-console: 0 */

const consoleReporter = require("./console-reporter");
const pathToSuites = require("./path-to-suites");
const benchmarks = require(".");

module.exports = function (suites, documentImplementation) {
  if (typeof suites === "string") {
    suites = suites.trim().split(/,/);
  }

  let suitesToRun = pathToSuites(benchmarks, suites);
  suitesToRun.forEach(consoleReporter);

  suitesToRun = suitesToRun.map(suite => {
    let runSuite = suite;
    if (documentImplementation) {
      runSuite = suite.filter(benchmark => benchmark.jsdomDocumentImplementation === documentImplementation);
      runSuite.name = suite.name;
      consoleReporter(runSuite);
    }

    return runSuite;
  });

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
};
