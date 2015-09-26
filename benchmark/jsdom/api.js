"use strict";
const Benchmark = require("benchmark");
const jsdomBenchmark = require("../jsdom-benchmark");
const jsdom = require("../..");

exports["env() defaults"] = function () {
  const suite = new Benchmark.Suite({ async: true });

  suite.push(jsdomBenchmark({
    defer: true,
    fn(deferred) {
      jsdom.env({
        html: "",
        done: deferred.resolve.bind(deferred)
      });
    }
  }));

  return suite;
};

exports["jsdom() defaults"] = function () {
  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    fn() {
      jsdom.jsdom();
    }
  }));

  return suite;
};

exports["jsdom() no resources"] = function () {
  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    fn() {
      jsdom.jsdom("", {
        features: {
          FetchExternalResources: false,
          ProcessExternalResources: false
        }
      });
    }
  }));

  return suite;
};
