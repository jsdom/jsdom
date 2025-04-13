"use strict";
const path = require("path");
const Benchmark = require("benchmark");
const jsdomBenchmark = require("../jsdom-benchmark");
const { JSDOM } = require("../..");

const domStandardFilepath = path.resolve(__dirname, "fixtures/dom-standard.html");

exports["JSDOM.fromFile() of the DOM Standard, default settings"] = function () {
  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    defer: true,
    fn(deferred) {
      JSDOM.fromFile(domStandardFilepath).then(() => deferred.resolve(), () => deferred.reject());
    }
  }));

  return suite;
};

exports["JSDOM.fromFile() of the DOM Standard, with disableCSS"] = function () {
  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    defer: true,
    fn(deferred) {
      JSDOM.fromFile(domStandardFilepath, { disableCSS: true })
        .then(() => deferred.resolve(), () => deferred.reject());
    }
  }));

  return suite;
};
