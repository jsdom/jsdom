"use strict";
const path = require("path");
const { describe, specify, before, after } = require("mocha-sugar-free");
const { readManifest, getPossibleTestFilePaths } = require("./wpt-manifest-utils.js");
const wptServer = require("./wpt-server.js");
const { resolveReason, killSubprocess } = require("./utils.js");
const { checkToRun, expectationsInDoc } = require("./expectations-utils.js");

const manifestFilename = path.resolve(__dirname, "wpt-manifest.json");
const manifest = readManifest(manifestFilename);
const possibleTestFilePaths = getPossibleTestFilePaths(manifest);

const { minimatchers, toRunDocs } = checkToRun(path.resolve(__dirname, "to-run.yaml"), possibleTestFilePaths);

let wptServerURL, serverProcess;
const runSingleWPT = require("./run-single-wpt.js")(() => wptServerURL);
before({ timeout: 30_000 }, async () => {
  const { urls, subprocess } = await wptServer.start({ toUpstream: false });
  wptServerURL = urls[0];
  serverProcess = subprocess;
});

after(() => {
  killSubprocess(serverProcess);
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

          const testFile = testFilePath.slice((toRunDoc.DIR + "/").length);
          let reason, data;

          if (matchingPattern) {
            // The array case is when the failure affects the whole test file
            // (ex.: testharness timeout or error, uncaught exception, etc.)
            reason = toRunDoc[matchingPattern][0];
            if (!Array.isArray(toRunDoc[matchingPattern])) {
              // The non-array case is when some subtests in the test file pass,
              // but others fail, and testharness status is OK.
              data = toRunDoc[matchingPattern];
            }
          } else if (toRunDoc.DIR.startsWith("html/canvas/")) {
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
              if (data) {
                failCount = Object.values(data)
                  .filter(([innerReason]) => resolveReason(innerReason) === "expect-fail").length;
              }

              let prefix = "";
              if (failCount > 0) {
                prefix = `[expected ${failCount} failure${failCount > 1 ? "s" : ""}] `;
              }

              runSingleWPT(testFilePath, `${prefix}${testFile}`, data || false);
            }
          }
        }
      }
    });
  }
});
