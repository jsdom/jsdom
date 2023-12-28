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
      const htmlFile = path.resolve(__dirname, "sizzle-speed/data/selector.html");
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

// This is only for comparison. Can remove later.
/* eslint-disable quotes, max-len */
exports["querySelectorAll only nwsapi supported"] = function () {
  let document, selectors;

  return suite({
    setup() {
      const htmlFile = path.resolve(__dirname, "sizzle-speed/data/selector.html");
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
    },
    fn() {
      const nwsapiFailures = new Map([
        [
          'h1[id]:contains(Selectors)',
          "unknown pseudo-class selector ':contains(Selectors)'"
        ],
        [
          'div[class!=made_up]',
          "'div[class!=made_up]' is not a valid selector"
        ],
        [
          'p:contains(selectors)',
          "unknown pseudo-class selector ':contains(selectors)'"
        ],
        [
          '.red p:not(:nth-of-type(3)) dl > *:not(:nth-of-type(3n+1)) ',
          "':nth-of-type(3)) dl>*:not(:nth-of-type(3n+1)' is not a valid selector"
        ],
        [
          '.green p:not(:nth-of-type(3)) dl > *:not(:nth-of-type(3n+1)) ',
          "':nth-of-type(3)) dl>*:not(:nth-of-type(3n+1)' is not a valid selector"
        ],
        [
          '.red p:not(:nth-last-of-type(3)) dl > *:not(:nth-last-of-type(3n+1)) ',
          "':nth-last-of-type(3)) dl>*:not(:nth-last-of-type(3n+1)' is not a valid selector"
        ],
        [
          '.green p:not(:nth-last-of-type(3)) dl > *:not(:nth-last-of-type(3n+1)) ',
          "':nth-last-of-type(3)) dl>*:not(:nth-last-of-type(3n+1)' is not a valid selector"
        ],
        [
          'p   p, ',
          ' is not a valid selector'
        ],
        [
          'p   .5cm ',
          "'p   .5cm ' is not a valid selector"
        ],
        [
          'p   foo & address, p ',
          "'p   foo & address, p ' is not a valid selector"
        ],
        [
          'foo & address, p   p ',
          "'foo & address, p   p ' is not a valid selector"
        ],
        [
          'p   [*=test] ',
          "'p   [*=test] ' is not a valid selector"
        ],
        [
          'p   p:subject',
          "unknown pseudo-class selector ':subject'"
        ],
        [
          'p  .13 ',
          "'p  .13 ' is not a valid selector"
        ],
        [
          'div  p::first-child ',
          "unknown pseudo-class selector '::first-child'"
        ],
        [
          'p ..test .foo..quux .bar. ',
          "'p ..test .foo..quux .bar. ' is not a valid selector"
        ],
        [
          '[test]    stub ~ [|attribute^=start]:not([|attribute~=mid])[|attribute*=dle][|attribute$=end] ~ t ',
          "'[test]    stub ~ [|attribute^=start]:not([|attribute~=mid])[|attribute*=dle][|attribute$=end] ~ t ' is not a valid selector"
        ]
      ]);
      for (const selector of selectors) {
        if (!nwsapiFailures.has(selector)) {
          document.querySelectorAll(selector);
        }
      }
    }
  });
};
