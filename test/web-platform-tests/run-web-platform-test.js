"use strict";

const logger = console;

const jsdom = require("../..");

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
    virtualConsole: jsdom.createVirtualConsole().sendTo(logger, { omitJsdomErrors: true }),
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
  server.started = false;

  dns.lookup("web-platform.test", err => {
    if (err) {
      logger.error("Error : you should add these lines to you hosts file :");
      logger.error("127.0.0.1   web-platform.test");
      logger.error("127.0.0.1   www.web-platform.test");
      logger.error("127.0.0.1   www1.web-platform.test");
      logger.error("127.0.0.1   www2.web-platform.test");
      logger.error("127.0.0.1   xn--n8j6ds53lwwkrqhv28a.web-platform.test");
      logger.error("127.0.0.1   xn--lve-6lad.web-platform.test");
      process.exit(1);
    }

    const python = childProcess.spawn("python", ["./serve", "--config", "../config.jsdom.json"], {
      cwd: testDir
    });

    let current = "";

    const lines = [];

    function readLine(line) {
      lines.push(line);
      if (line === "INFO:web-platform-tests:Starting http server on web-platform.test:9000") {
        server.started = true;
        server.emit("start");
      } else if (!server.error && /^err/i.test(line)) {
        server.error = true;
      }
      if (server.error) {
        logger.error(line);
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
      if (!server.started) {
        logger.error(lines.join("\n"));
      }
    });

    process.on("exit", () => {
      python.kill();
    });
  });

  const urlPrefix = "http://web-platform.test:9000/";

  return testPath => {
    exports[testPath] = t => {
      if (server.started) {
        createJsdom(urlPrefix, testPath, t);
      } else {
        server.on("start", () => {
          createJsdom(urlPrefix, testPath, t);
        });
      }
    };
  };
};
