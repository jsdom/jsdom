"use strict";
const q = require("q");
const childProcess = require("child_process");
const { EventEmitter } = require("events");
const dns = require("dns");
const { specify } = require("mocha-sugar-free");
const { inBrowserContext } = require("../util.js");
const requestHead = q.denodeify(require("request").head);
const createJsdom = require("./create-jsdom.js");

/* eslint-disable no-console */

module.exports = function (testDir) {
  if (inBrowserContext()) {
    return () => {
      // TODO: browser support for running WPT
    };
  }

  const server = new EventEmitter();

  let serverHasStarted;
  server.started = new Promise(resolve => {
    serverHasStarted = resolve;
  });
  server.isStarted = false;

  let urlPrefix = "http://web-platform.test:9000/";

  dns.lookup("web-platform.test", err => {
    if (err) {
      console.warn();
      console.warn("Host entries not present for web platform tests.");
      console.warn("See https://github.com/w3c/web-platform-tests#running-the-tests");
      console.warn("Falling back to hosted versions at w3c-test.org");

      urlPrefix = "http://w3c-test.org/";
      serverHasStarted();
      return;
    }

    const python = childProcess.spawn("python", ["./serve", "--config", "../config.jsdom.json"], {
      cwd: testDir,
      stdio: "inherit"
    });

    python.on("error", e => {
      console.warn();
      console.warn("Error starting python server process:", e.message);
      console.warn("Falling back to hosted versions at w3ctest.org");

      urlPrefix = "http://w3c-test.org/";
      serverHasStarted();
    });

    pollForServer(() => urlPrefix).then(serverHasStarted);

    process.on("exit", () => {
      // Python doesn't register a default handler for SIGTERM and it doesn't run __exit__() methods of context managers
      // when it gets that signal. Using SIGINT avoids this problem
      python.kill("SIGINT");
    });
  });

  return testPath => {
    specify({
      title: testPath,
      expectPromise: true,
      // WPT also takes care of timeouts, this is an extra failsafe:
      timeout: 60000,
      slow: 10000,
      skipIfBrowser: true,
      fn() {
        return server.started.then(() => createJsdom(urlPrefix, testPath));
      }
    });
  };
};

function pollForServer(urlGetter) {
  console.log("Checking if the web platform tests server is up");
  return requestHead(urlGetter())
    .then(() => console.log("Server is up!"))
    .catch(err => {
      console.log(`Server is not up yet (${err.message}); trying again`);
      return q.delay(500).then(() => pollForServer(urlGetter));
    });
}
