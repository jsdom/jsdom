"use strict";
const path = require("node:path");
const fs = require("node:fs");
const { specify } = require("mocha-sugar-free");
const jsYAML = require("js-yaml");
const { Minimatch } = require("minimatch");
const { Canvas } = require("../../lib/jsdom/utils.js");

const hasCanvas = Boolean(Canvas);
const nodeMajorVersion = Number.parseInt(process.versions.node.split(".")[0]);

const validInnerReasons = new Set([
  "fail",
  "fail-with-canvas",
  "fail-lt-node22",
  "fail-lt-node24"
]);

const validReasons = new Set([
  "fail",
  "fail-slow",
  "fail-with-canvas",
  "fail-lt-node24",
  "timeout",
  "flaky",
  "needs-canvas",
  "pass-slow"
]);

exports.checkToUpstreamExpectations = (toUpstreamExpectationsFilename, possibleTestFilePaths) => {
  const toRunString = fs.readFileSync(toUpstreamExpectationsFilename, { encoding: "utf-8" });
  let expectations = jsYAML.load(toRunString, null, {
    filename: toUpstreamExpectationsFilename,
    schema: jsYAML.DEFAULT_SAFE_SCHEMA
  });

  if (expectations === undefined) {
    expectations = {};
  }

  const minimatchers = checkExpectations(expectations, possibleTestFilePaths);

  return { minimatchers, expectations };
};

exports.checkToRunFile = (toRunFilename, possibleTestFilePaths) => {
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
      const toRunBasename = path.basename(toRunFilename);
      throw new Error(
        `Bad lexicographical directory sorting in ${toRunBasename}: ${doc.DIR} should come before ${lastDir}`
      );
    }
    lastDir = doc.DIR;

    const theseMinimatchers = checkExpectations(exports.expectationsInToRunDoc(doc), possibleTestFilePaths, {
      prefix: doc.DIR + "/"
    });

    for (const [key, minimatcher] of theseMinimatchers.entries()) {
      minimatchers.set(key, minimatcher);
    }
  }

  return { minimatchers, toRunDocs };
};

exports.runTestWithExpectations = (testFilePath, expectations, minimatchers, { runSingleWPT, prefix = "" } = {}) => {
  const matchingPattern = Object.keys(expectations).find(pattern => {
    const matcher = minimatchers.get(prefix + pattern);
    return matcher.match(testFilePath);
  });

  const testFile = testFilePath.slice(prefix.length);
  let reason, data;

  if (matchingPattern) {
    // The array case is when the failure affects the whole test file
    // (ex.: testharness timeout or error, uncaught exception, etc.)
    reason = expectations[matchingPattern][0];
    if (!Array.isArray(expectations[matchingPattern])) {
      // The non-array case is when some subtests in the test file pass,
      // but others fail, and testharness status is OK.
      data = expectations[matchingPattern];
    }
  } else if (prefix.startsWith("html/canvas/")) {
    reason = "needs-canvas";
  }

  switch (resolveReason(reason)) {
    case "skip": {
      specify.skip(`[${reason}] ${testFile}`);
      break;
    }

    case "expect-fail": {
      const failReason = reason !== "fail" ? `: ${reason}` : "";
      runSingleWPT(testFilePath, `[expected fail${failReason}] ${testFile}`, true);
      break;
    }

    default: {
      let failCount = 0;
      let expectFail = false;
      if (data) {
        expectFail = {};
        for (const [subtestName, subtestReason] of Object.entries(data)) {
          expectFail[subtestName] = resolveReason(subtestReason[0]);
          if (expectFail[subtestName] === "expect-fail") {
            ++failCount;
          }
        }
      }

      let outputPrefix = "";
      if (failCount > 0) {
        outputPrefix = `[expected ${failCount} failure${failCount > 1 ? "s" : ""}] `;
      }

      runSingleWPT(testFilePath, `${outputPrefix}${testFile}`, expectFail);
    }
  }
};

exports.expectationsInToRunDoc = doc => {
  const expectations = structuredClone(doc);
  delete expectations.DIR;
  return expectations;
};

function checkExpectations(expectations, possibleTestFilePaths, { prefix = "" } = {}) {
  const minimatchers = new Map();

  let lastPattern = "";
  for (const [pattern, data] of Object.entries(expectations)) {
    if (pattern.startsWith("/")) {
      throw new Error(`Expectation patterns must not start with a slash: saw "${pattern}"`);
    }

    if (pattern < lastPattern) {
      throw new Error("Bad lexicographical expectation pattern sorting in WPT expectations: " + pattern +
                      " should come before " + lastPattern);
    }
    lastPattern = pattern;

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

    const matcher = new Minimatch(prefix + pattern);
    if (!possibleTestFilePaths.some(filename => matcher.match(filename))) {
      throw new Error(`Expectation pattern "${pattern}" does not match any test files`);
    }
    minimatchers.set(prefix + pattern, matcher);
  }

  return minimatchers;
}


function resolveReason(reason) {
  if (["fail-slow", "pass-slow", "timeout", "flaky"].includes(reason)) {
    return "skip";
  }

  if (["fail-with-canvas", "needs-canvas"].includes(reason) && !hasCanvas) {
    return "skip";
  }

  if (reason === "fail-lt-node22" && nodeMajorVersion < 22) {
    return "expect-fail";
  }

  if (reason === "fail-lt-node24" && nodeMajorVersion < 24) {
    return "expect-fail";
  }

  if (reason === "fail" ||
    (reason === "fail-with-canvas" && hasCanvas)) {
    return "expect-fail";
  }

  return "run";
}
