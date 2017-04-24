/* eslint no-process-env:0 no-console:0 */
"use strict";
// For: Mocha

module.exports = options => {
  // running as a CI job, start chrome using SauceLabs
  // SAUCE_USERNAME and SAUCE_ACCESS_KEY should also be set as environment variables
  // TRAVIS_BUILD_NUMBER will also be read by https://npmjs.com/karma-sauce-launcher

  console.info("Using SauceLabs username:", process.env.SAUCE_USERNAME);

  options.reporters.push("saucelabs");
  options.sauceLabs = {
    testName: "jsdom regular"
  };
  options.captureTimeout = 5 * 60 * 1000; // 5 minutes
  options.customLaunchers = {
    SLChrome: {
      base: "SauceLabs",
      browserName: "chrome",
      version: "56"
    }
  };
  options.browsers = ["SLChrome"];

  if (process.env.TRAVIS_JOB_NUMBER) {
    // This is a travis job
    options.sauceLabs.startConnect = false;
    options.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    options.sauceLabs.build = process.env.TRAVIS_BUILD_NUMBER;
    options.sauceLabs.tags = [process.env.TRAVIS_BRANCH, process.env.TRAVIS_PULL_REQUEST];
  }
};
