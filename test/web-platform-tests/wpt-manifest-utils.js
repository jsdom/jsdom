"use strict";
const fs = require("fs");

const EXPECTED_MANIFEST_VERSION = 4;

exports.getPossibleTestFilePaths = manifest => {
  const testharnessTests = manifest.items.testharness;

  const allPaths = [];
  for (const containerPath of Object.keys(testharnessTests)) {
    const testFilePaths = testharnessTests[containerPath].map(value => value[[0]]);
    for (const testFilePath of testFilePaths) {
      // Globally disable worker tests
      if (testFilePath.endsWith(".worker.html") ||
          testFilePath.endsWith(".serviceworker.html") ||
          testFilePath.endsWith(".sharedworker.html")) {
        continue;
      }

      // We don't have support for .svg documents in general, much less running scripts in them.
      // See https://github.com/w3c/web-platform-tests/issues/7313 for confirmation this is our bug, not WPT's.
      if (testFilePath.endsWith(".svg")) {
        continue;
      }

      allPaths.push(exports.stripPrefix(testFilePath, "/"));
    }
  }

  return allPaths;
};

exports.stripPrefix = (string, prefix) => string.substring(prefix.length);

exports.readManifest = filename => {
  const manifestString = fs.readFileSync(filename, { encoding: "utf-8" });
  const manifest = JSON.parse(manifestString);

  if (manifest.version !== EXPECTED_MANIFEST_VERSION) {
    throw new Error(`WPT manifest format mismatch; expected ${EXPECTED_MANIFEST_VERSION} but got ${manifest.version}`);
  }

  return manifest;
};
