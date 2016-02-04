"use strict";

const nodePath = require('path');

module.exports = config => {
  const options = {
    basePath: nodePath.resolve(__dirname, ".."),
    frameworks: ["mocha", "browserify"],

    files: [
      {pattern: "lib/*"        , watched: true , served: false, included: false},
      {pattern: "test/*"       , watched: true , served: false, included: false},
      {pattern: "test/index.js", watched: true , served: true , included: true }
    ],
    preprocessors: {
      "test/index.js": ["browserify"]
    },

    browserify: {
      debug: true
    },

    reporters: ["progress"],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,

    browsers: ['Chrome'],
    singleRun: true
  };

  if (process.env.TEST_SUITE === 'browser') {
    // running as a CI job
    // SAUCE_USERNAME and SAUCE_ACCESS_KEY should also be set as environment variables
    // TRAVIS_BUILD_NUMBER will also be read by https://npmjs.com/karma-sauce-launcher

    console.info('Using SauceLabs username:', process.env.SAUCE_USERNAME);

    options.reporters.push('saucelabs');
    options.sauceLabs = {
      testName: 'jsdom regular'
    };
    options.captureTimeout = 5 * 60 * 1000; // 5 minutes
    options.customLaunchers = {
      SL_Chrome: {
        base: 'SauceLabs',
        browserName: 'chrome'
        //version: '48'
      }
    };
    options.browsers = ['SL_Chrome'];
  }

  config.set(options);
};
