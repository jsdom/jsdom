"use strict";

const fs = require("node:fs");
const path = require("node:path");
const suite = require("../document-suite");
const { JSDOM } = require("../..");

const htmlFile = path.resolve(__dirname, "sizzle-speed/selector.html");
const domstr = fs.readFileSync(htmlFile, {
  encoding: "utf8",
  flag: "r"
});
const { window: { document } } = new JSDOM(domstr);

const cssFile = path.resolve(__dirname, "sizzle-speed/selectors.large.css");
const css = fs.readFileSync(cssFile, {
  encoding: "utf8",
  flag: "r"
});
const selectors = css.split("\n");
const total = selectors.length;

exports.querySelector = function () {
  let count = 0;
  let cycle = 0;

  return suite({
    fn() {
      for (const selector of selectors) {
        try {
          document.querySelector(selector);
        } catch {
          count++;
        }
      }
    },
    teardown() {
      cycle++;
    },
    onComplete() {
      // eslint-disable-next-line no-console
      console.log(`${(count / cycle).toFixed(0)}/${total} fails.`);
    }
  });
};

exports.querySelectorAll = function () {
  let count = 0;
  let cycle = 0;

  return suite({
    fn() {
      for (const selector of selectors) {
        try {
          document.querySelectorAll(selector);
        } catch {
          count++;
        }
      }
    },
    teardown() {
      cycle++;
    },
    onComplete() {
      // eslint-disable-next-line no-console
      console.log(`${(count / cycle).toFixed(0)}/${total} fails.`);
    }
  });
};
