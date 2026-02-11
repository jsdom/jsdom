"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

let html = `<!doctype html><html><head><meta charset="UTF-8"><title></title></head><body>\n\n`;
for (let i = 0; i < 1000; ++i) {
  html += `<a href='${i}.html'>${i}</a>\n`;
}
html += `\n</body></html>\n`;

module.exports = () => {
  const bench = new Bench();

  bench.add("new JSDOM() defaults", () => {
    // eslint-disable-next-line no-new
    new JSDOM();
  });

  bench.add("new JSDOM() with many elements", () => {
    // eslint-disable-next-line no-new
    new JSDOM(html);
  });

  return bench;
};
