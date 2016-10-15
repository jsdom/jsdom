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

exports["jsdom() with many elements"] = function () {
  let html = `<!doctype html><html><head><meta charset="UTF-8"><title></title></head><body>\n\n`;
  for (let i = 0; i < 1000; ++i) {
    html += `<a href='${i}.html'>${i}</a>\n`;
  }
  html += `\n</body></html>\n`;

  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    fn() {
      jsdom.jsdom(html);
    }
  }));

  return suite;
};
