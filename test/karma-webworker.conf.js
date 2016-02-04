/* eslint no-process-env:0 no-console:0 */
"use strict";

const nodePath = require("path");
const applyCIOptions = require("./karma-ci");

module.exports = config => {
  const options = {
    basePath: nodePath.resolve(__dirname, ".."),
    frameworks: ["mocha-webworker", "browserify"],

    files: [
      {
        pattern: "lib/**",
        watched: true,
        served: false,
        included: false
      },
      {
        // this directory is served so that we can test fetching fixtures
        // make sure that this pattern does not match the entry point test/index.js
        // otherwise we hit node-browserify#1003
        pattern: "test/!(w3c|web-platform-tests)/**",
        served: true,
        watched: true,
        included: false
      },
      {
        pattern: "test/index.js",
        watched: false,
        served: true,
        included: false
      }
    ],

    preprocessors: {
      "test/index.js": ["browserify"]
    },

    browserify: {
      debug: true,
      configure(bundle) {
        bundle.ignore("fs");
      }
    },

    client: {
      mochaWebWorker: {
        pattern: [
          // karma-browserify injects a script which contains the generated bundle.
          // it then replaces our script (test/index.js) with a single `require()` call.
          // Currently, chrome can not display a stack for errors that occur during importScripts():
          // https://code.google.com/p/chromium/issues/detail?id=580862
          // So we use eval() within the worker to run the browserify bundle instead.
          "*browserify*"
        ],
        evaluate: {
          beforeRun:
            "require(" +
            JSON.stringify(nodePath.join(__dirname, "index.js")) +
            ")"
        }
      }
    },

    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    browsers: ["Chrome"],
    singleRun: true
  };

  if (process.env.TEST_SUITE === "browser") {
    applyCIOptions(options);
  }

  config.set(options);
};
