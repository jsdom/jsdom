"use strict";
const jsdom = require("../..");
/* eslint-disable no-console */

const globalPool = { maxSockets: 6 };

function createJsdom(urlPrefix, testPath, t) {
  const reporterHref = urlPrefix + "resources/testharnessreport.js";

  jsdom.env({
    url: urlPrefix + testPath,
    pool: globalPool,
    features: {
      FetchExternalResources: ["script", "frame", "iframe", "link"],
      ProcessExternalResources: ["script"]
    },
    virtualConsole: jsdom.createVirtualConsole().sendTo(console, { omitJsdomErrors: true }),
    resourceLoader(resource, callback) {
      if (resource.url.href === reporterHref) {
        callback(null, "window.shimTest();");
      } else {
        resource.defaultFetch(callback);
      }
    },
    created(err, window) {
      if (err) {
        t.ifError(err, "window should be created without error");
        t.done();
        return;
      }

      window.shimTest = () => {
        window.add_result_callback(test => {
          if (test.status === 1) {
            t.ok(false, "Failed in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else if (test.status === 2) {
            t.ok(false, "Timout in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else {
            t.ok(true, test.name);
          }
        });

        window.add_completion_callback((tests, harnessStatus) => {
          t.ok(harnessStatus.status !== 2, "test harness should not timeout");
          window.close();
          t.done();
        });
      };
    },

    loaded(err) {
      t.ifError(err);
    }
  });
}

const childProcess = require("child_process");
const EventEmitter = require("events");
const dns = require("dns");

module.exports = function (exports, testDir) {
  const server = new EventEmitter();

  let serverHasStarted;
  server.started = new Promise(resolve => serverHasStarted = resolve);
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
      cwd: testDir
    });

    python.on("error", e => {
      console.warn();
      console.warn("Error starting python server process:", e.message);
      console.warn("Falling back to hosted versions at w3ctest.org");

      urlPrefix = "http://w3c-test.org/";
      serverHasStarted();
    });

    let current = "";

    const lines = [];

    function readLine(line) {
      lines.push(line);
      if (line === "INFO:web-platform-tests:Starting http server on web-platform.test:9000") {
        server.isStarted = true;
        serverHasStarted();
      } else if (!server.error && /^err/i.test(line)) {
        server.error = true;
      }

      if (server.error) {
        console.error(line);
      }
    }

    function readData(data) {
      current += data.toString();
      const newlines = current.split(/(?:\r?\n)/g);
      for (let i = 0; i < newlines.length - 1; i++) {
        if (newlines[i]) {
          readLine(newlines[i]);
        }
      }
      current = newlines[newlines.length - 1];
    }

    python.stderr.on("data", readData);

    python.stderr.on("end", () => {
      readLine(current);
      if (!server.isStarted) {
        console.error(lines.join("\n"));
      }
    });

    process.on("exit", () => {
      python.kill();
    });
  });

  return testPath => {
    exports[testPath] = t => {
      server.started.then(() => createJsdom(urlPrefix, testPath, t));
    };
  };
};
