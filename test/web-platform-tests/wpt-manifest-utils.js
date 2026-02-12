"use strict";
const fs = require("fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const EXPECTED_MANIFEST_VERSION = 9;

const wptPath = path.resolve(__dirname, "tests");

exports.getPossibleTestFilePaths = manifest => {
  const testharnessTests = manifest.items.testharness;

  // Do a DFS to gather all test paths.
  const allPaths = [];
  function addTests(test, prefix) {
    for (const key of Object.keys(test)) {
      if (Array.isArray(test[key])) {
        const fallbackPath = prefix === "" ? key : `${prefix}/${key}`;

        for (const [curPath] of test[key].slice(1)) {
          const testPath = curPath === null ? fallbackPath : curPath;

          // Globally disable worker tests
          if (/\.(?:shared|service)?worker\.html(?:\?.*)?$/.test(testPath)) {
            continue;
          }
          // Globally disable testdriver tests
          if (test[key][1][1].testdriver) {
            continue;
          }
          // Globally disable shadowrealm tests
          if (/[a-z\d.-]+\.any\.shadowrealm-in-[a-z]+/.test(testPath)) {
            continue;
          }

          allPaths.push(testPath);
        }
      } else {
        const curPath = prefix === "" ? key : `${prefix}/${key}`;
        addTests(test[key], curPath);
      }
    }
  }
  addTests(testharnessTests, "");

  return allPaths;
};

exports.readManifest = filename => {
  const manifestString = fs.readFileSync(filename, { encoding: "utf-8" });
  const manifest = JSON.parse(manifestString);

  if (manifest.version !== EXPECTED_MANIFEST_VERSION) {
    throw new Error(`WPT manifest format mismatch; expected ${EXPECTED_MANIFEST_VERSION} but got ${manifest.version}`);
  }

  return manifest;
};

// Regenerates a WPT manifest for the given tests root directory and manifest output path,
// then reads and returns the parsed manifest.
exports.regenerateManifest = (testsRoot, manifestFilename) => {
  const result = spawnSync(
    "python",
    [
      "./wpt.py", "manifest",
      "--tests-root", path.relative(wptPath, testsRoot),
      "--path", path.relative(wptPath, manifestFilename)
    ],
    { cwd: wptPath, stdio: "inherit" }
  );
  if (result.status !== 0) {
    throw new Error("Manifest generation failed");
  }

  return exports.readManifest(manifestFilename);
};
