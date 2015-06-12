"use strict";

const consoleReporter = require("./console-reporter");
const pathToSuites = require("./path-to-suites");
const benchmarks = require(".");

module.exports = function (suites, documentImplementation) {
  if (typeof suites === "string") {
    suites = suites.trim().split(/,/);
  }

  let suitesToRun = pathToSuites(benchmarks, suites);
  suitesToRun.forEach(consoleReporter);

  suitesToRun = suitesToRun.map(function (suite) {
    let runSuite = suite;
    if (documentImplementation) {
      runSuite = suite.filter(function (benchmark) {
        return benchmark.jsdomDocumentImplementation === documentImplementation;
      });
      runSuite.name = suite.name;
      consoleReporter(runSuite);
    }

    return runSuite;
  });

  function runNext() {
    /* jshint -W040 */
    if (this && this.off) {
      // there is no .once()
      this.off("complete", runNext);
    }

    const suite = suitesToRun.shift();
    if (!suite) {
      console.log("Done!");
      return;
    }

    suite.off("complete", runNext);
    suite.on("complete", runNext);
    suite.run({async: true});
  }

  runNext();

};
