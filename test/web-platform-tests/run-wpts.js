"use strict";
const path = require("path");
const fs = require("fs");
const jsYAML = require("js-yaml");
const { Minimatch } = require("minimatch");
const { describe, specify, before } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths, stripPrefix } = require("./wpt-manifest-utils.js");
const startWPTServer = require("./start-wpt-server.js");

const validReasons = new Set(["fail", "timeout", "needs-await", "needs-node8"]);

let supportsAwait = true;
try {
  eval("async () => { await 0; }"); // eslint-disable-line no-eval
} catch (e) {
  supportsAwait = false;
}

const hasNode8 = Number(process.versions.node.split(".")[0]) >= 8;

const manifestFilename = path.resolve(__dirname, "wpt-manifest.json");
const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);

const toRunFilename = path.resolve(__dirname, "to-run.yaml");
const toRunString = fs.readFileSync(toRunFilename, { encoding: "utf-8" });
const toRunDocs = jsYAML.safeLoadAll(toRunString, { filename: toRunFilename });

const minimatchers = new Map();

checkToRun();

let wptServerURL;
const runSingleWPT = require("./run-single-wpt.js")(() => wptServerURL);
before({ timeout: 30 * 1000 }, () => {
  return startWPTServer({ toUpstream: false }).then(url => {
    wptServerURL = url;
  });
});

describe("web-platform-tests", () => {
  for (const toRunDoc of toRunDocs) {
    describe(toRunDoc.DIR, () => {
      for (const testFilePath of possibleTestFilePaths) {
        if (testFilePath.startsWith(toRunDoc.DIR + "/")) {
          const matchingPattern = expectationsInDoc(toRunDoc).find(pattern => {
            const matcher = minimatchers.get(toRunDoc.DIR + "/" + pattern);
            return matcher.match(testFilePath);
          });

          const testFile = stripPrefix(testFilePath, toRunDoc.DIR + "/");
          const reason = matchingPattern && toRunDoc[matchingPattern][0];
          const shouldRunAnyway = (reason === "needs-await" && supportsAwait) ||
                                  (reason === "needs-node8" && hasNode8);
          if (matchingPattern && !shouldRunAnyway) {
            specify.skip(`[${reason}] ${testFile}`);
          } else {
            runSingleWPT(testFilePath, testFile);
          }
        }
      }
    });
  }
});

function checkToRun() {
  let lastDir = "";
  for (const doc of toRunDocs) {
    if (doc.DIR.startsWith("/")) {
      throw new Error(`DIR entries must not start with a slash: saw "${doc.DIR}"`);
    }
    if (doc.DIR.endsWith("/")) {
      throw new Error(`DIR entries must not end with a slash: saw "${doc.DIR}"`);
    }

    if (doc.DIR < lastDir) {
      throw new Error(`Bad lexicographical directory sorting in to-run.yaml: ${doc.DIR} should come before ${lastDir}`);
    }
    lastDir = doc.DIR;

    let lastPattern = "";
    for (const pattern of expectationsInDoc(doc)) {
      if (pattern.startsWith("/")) {
        throw new Error(`Expectation patterns must not start with a slash: saw "${pattern}"`);
      }

      if (pattern < lastPattern) {
        throw new Error("Bad lexicographical expectation pattern sorting in to-run.yaml: " + pattern +
                        " should come before " + lastPattern);
      }
      lastPattern = pattern;

      const reason = doc[pattern][0];
      if (!validReasons.has(reason)) {
        throw new Error(`Bad reason "${reason}" for expectation ${pattern}`);
      }

      const matcher = new Minimatch(doc.DIR + "/" + pattern);
      if (!possibleTestFilePaths.some(filename => matcher.match(filename))) {
        throw new Error(`Expectation pattern "${pattern}" does not match any test files`);
      }
      minimatchers.set(doc.DIR + "/" + pattern, matcher);
    }
  }
}

function expectationsInDoc(doc) {
  const keys = Object.keys(doc);
  keys.shift(); // get rid of the DIR key
  return keys;
}
