"use strict";
const Benchmark = require("benchmark");

function noop() {}

module.exports = function jsdomBenchmark(optionsArg) {
  const options = Object.assign(
    {},
    typeof optionsArg === "function" ? { fn: optionsArg } : optionsArg,
    {
      jsdomSetup: optionsArg.setup || noop,
      jsdomFn: optionsArg.fn,
      jsdomTeardown: optionsArg.teardown || noop
    }
  );

  if (options.defer) {
    // `this` refers to a Benchmark.Deferred
    options.setup = "this.benchmark.jsdomSetup();";
    options.fn = "this.benchmark.jsdomFn(deferred);";
    options.teardown = "this.benchmark.jsdomTeardown();";
  } else {
    // `this` refers to a Benchmark
    options.setup = "this.jsdomSetup();";
    options.fn = "this.jsdomFn();";
    options.teardown = "this.jsdomTeardown();";
  }

  return new Benchmark(options);
};
