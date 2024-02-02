"use strict";

const fs = require("node:fs");
const path = require("node:path");
const suite = require("../document-suite");
const { JSDOM } = require("../..");

exports.querySelectorAll = function () {
  let document, selectors, total;
  let count = 0;
  let cycle = 0;

  return suite({
    setup() {
      const htmlFile = path.resolve(__dirname, "sizzle-speed/selector.html");
      const domstr = fs.readFileSync(htmlFile, {
        encoding: "utf8",
        flag: "r"
      });
      const { window } = new JSDOM(domstr);
      document = window.document;
      const cssFile = path.resolve(__dirname, "sizzle-speed/selectors.large.css");
      const css = fs.readFileSync(cssFile, {
        encoding: "utf8",
        flag: "r"
      });
      selectors = css.split("\n");
      total = selectors.length;
    },
    fn() {
      for (const selector of selectors) {
        try {
          document.querySelectorAll(selector);
        } catch (e) {
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

exports.querySelector = function () {
  let document, selectors, total;
  let count = 0;
  let cycle = 0;

  return suite({
    setup() {
      const htmlFile = path.resolve(__dirname, "sizzle-speed/selector.html");
      const domstr = fs.readFileSync(htmlFile, {
        encoding: "utf8",
        flag: "r"
      });
      const { window } = new JSDOM(domstr);
      document = window.document;
      const cssFile = path.resolve(__dirname, "sizzle-speed/selectors.large.css");
      const css = fs.readFileSync(cssFile, {
        encoding: "utf8",
        flag: "r"
      });
      selectors = css.split("\n");
      total = selectors.length;
    },
    fn() {
      for (const selector of selectors) {
        try {
          document.querySelector(selector);
        } catch (e) {
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
