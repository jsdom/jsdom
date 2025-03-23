"use strict";
const path = require("path");
const fs = require("fs");
const jsYAML = require("js-yaml");
const { Minimatch } = require("minimatch");

const validInnerReasons = new Set([
  "fail",
  "fail-with-canvas",
  "fail-lt-node22"
]);

const validReasons = new Set([
  "fail",
  "fail-slow",
  "fail-with-canvas",
  "timeout",
  "flaky",
  "needs-canvas",
  // Node 18 has a bug in its vm module that causes certain property redefinition tests to fail.
  // They start passing again on Node 19.
  "fail-node18"
]);

exports.checkToRun = (toRunFilename, possibleTestFilePaths) => {
  const minimatchers = new Map();

  const toRunString = fs.readFileSync(toRunFilename, { encoding: "utf-8" });
  const toRunDocs = jsYAML.loadAll(toRunString, null, { filename: toRunFilename, schema: jsYAML.DEFAULT_SAFE_SCHEMA });

  let lastDir = "";
  for (const doc of toRunDocs) {
    if (doc.DIR.startsWith("/")) {
      throw new Error(`DIR entries must not start with a slash: saw "${doc.DIR}"`);
    }
    if (doc.DIR.endsWith("/")) {
      throw new Error(`DIR entries must not end with a slash: saw "${doc.DIR}"`);
    }

    if (!fs.existsSync(path.resolve(__dirname, "tests", doc.DIR))) {
      throw new Error(`The directory "${doc.DIR}" does not exist`);
    }

    if (doc.DIR < lastDir) {
      throw new Error(`Bad lexicographical directory sorting in to-run.yaml: ${doc.DIR} should come before ${lastDir}`);
    }
    lastDir = doc.DIR;

    let lastPattern = "";
    for (const pattern of exports.expectationsInDoc(doc)) {
      if (pattern.startsWith("/")) {
        throw new Error(`Expectation patterns must not start with a slash: saw "${pattern}"`);
      }

      if (pattern < lastPattern) {
        throw new Error("Bad lexicographical expectation pattern sorting in to-run.yaml: " + pattern +
                        " should come before " + lastPattern);
      }
      lastPattern = pattern;

      const data = doc[pattern];
      if (Array.isArray(data)) {
        const reason = data[0];
        if (!validReasons.has(reason)) {
          throw new Error(`Bad reason "${reason}" for expectation "${pattern}"`);
        }
      } else {
        for (const [subtest, [innerReason]] of Object.entries(data)) {
          if (!validInnerReasons.has(innerReason)) {
            if (!validReasons.has(innerReason)) {
              throw new Error(`Bad reason "${innerReason}" for expectation "${pattern}" and subtest "${subtest}"`);
            } else {
              throw new Error(`Reason "${innerReason}" is only supported for files, not subtests (expectation "${
                pattern}", subtest "${subtest}")`);
            }
          }
        }
      }

      const matcher = new Minimatch(doc.DIR + "/" + pattern);
      if (!possibleTestFilePaths.some(filename => matcher.match(filename))) {
        throw new Error(`Expectation pattern "${pattern}" does not match any test files`);
      }
      minimatchers.set(doc.DIR + "/" + pattern, matcher);
    }
  }

  return { minimatchers, toRunDocs };
};

exports.expectationsInDoc = doc => {
  const keys = Object.keys(doc);
  keys.shift(); // get rid of the DIR key
  return keys;
};
