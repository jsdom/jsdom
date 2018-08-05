"use strict";
const Benchmark = require("benchmark");
const jsdomBenchmark = require("../jsdom-benchmark");
const { JSDOM } = require("../..");

exports["new JSDOM() defaults"] = function () {
  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    fn() {
      // eslint-disable-next-line no-new
      new JSDOM();
    }
  }));

  return suite;
};

exports["new JSDOM() with many elements"] = function () {
  let html = `<!doctype html><html><head><meta charset="UTF-8"><title></title></head><body>\n\n`;
  for (let i = 0; i < 1000; ++i) {
    html += `<a href='${i}.html'>${i}</a>\n`;
  }
  html += `\n</body></html>\n`;

  const suite = new Benchmark.Suite();

  suite.push(jsdomBenchmark({
    fn() {
      // eslint-disable-next-line no-new
      new JSDOM(html);
    }
  }));

  return suite;
};
