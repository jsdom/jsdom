"use strict";
const Benchmark = require("benchmark");
const jsdomBenchmark = require("./jsdom-benchmark");

// jsdom might be an empty object if omitted by browserify
const jsdom = require("..");

const nativeDoc = global.document;
const jsdomDoc = jsdom.JSDOM && (new jsdom.JSDOM()).window.document;

function noop() {
  // intentional no-op function
}

function addBenchmark(suite, benchmark) {
  const event = new Benchmark.Event({ type: "add", target: benchmark });
  suite.emit(event);
  if (!event.cancelled) {
    suite.push(benchmark);
  }
}

function benchmarkFunctions(document, { setup = noop, fn, teardown = noop, defer }) {
  return {
    setup() {
      setup.call(this, document);
    },
    fn: defer ?
        function (deferred) {
          fn.call(this, deferred, document);
        } :
        function () {
          fn.call(this, document);
        },
    teardown() {
      teardown.call(this, document);
    }
  };
}

/**
 * Create a Benchmark.js Suite which runs your benchmark in
 * different document implementations.
 * @param {Object|function} optionsArg Options to pass to `Benchmark`. A function
 *                          can also be given if you do not want to set any options.
 * @param {Benchmark.Suite} [optionsArg.suite=new Benchmark.Suite()] The suite to add the benchmarks to
 * @param {function|string}   optionsArg.fn                           Benchmark test function
 * @param {function|string}  [optionsArg.setup]                       Compiled/called before the test loop
 * @param {function|string}  [optionsArg.teardown]                    Compiled/called after the test loop
 * @param {boolean}          [optionsArg.defer=false]                 A flag to indicate the benchmark is deferred
 * @returns {Benchmark.Suite}
 */
module.exports = function documentSuite(optionsArg) {
  const options = typeof optionsArg === "function" ?
                  { fn: optionsArg } :
                  Object.assign({}, optionsArg);

  // default to async because that is required for defer:true
  const suite = options.suite || new Benchmark.Suite({ async: true });
  delete options.suite; // do not pass to `Benchmark`

  if (nativeDoc) {
    const newOptions = Object.assign(
      {},
      options,
      benchmarkFunctions(nativeDoc, options),
      { jsdomDocumentImplementation: "native" }
    );
    const benchmark = jsdomBenchmark(newOptions);
    benchmark.name = benchmark.name ? benchmark.name + " :: native" : "native";
    addBenchmark(suite, benchmark);
  }

  if (jsdomDoc) {
    const newOptions = Object.assign(
      {},
      options,
      benchmarkFunctions(jsdomDoc, options),
      { jsdomDocumentImplementation: "jsdom" }
    );
    const benchmark = jsdomBenchmark(newOptions);

    // extra space in "jsdom " so that it aligns with "native"
    benchmark.name = benchmark.name ? benchmark.name + " :: jsdom " : "jsdom ";
    addBenchmark(suite, benchmark);
  }

  return suite;
};
