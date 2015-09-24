"use strict";

const jsdom = require("../..");

var globalPool = {maxSockets: 6};

function createJsdom(urlPrefix, testPath, t) {
  const reporterHref = urlPrefix + "resources/testharnessreport.js";

  jsdom.env({
    url: urlPrefix + testPath,
    pool: globalPool,
    features: {
      FetchExternalResources: ["script", "frame", "iframe", "link"],
      ProcessExternalResources: ["script"]
    },
    virtualConsole: jsdom.createVirtualConsole().sendTo(console),
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

      window.shimTest = function () {
        /* jshint -W106 */
        window.add_result_callback(function (test) {
          if (test.status === 1) {
            t.ok(false, "Failed in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else if (test.status === 2) {
            t.ok(false, "Timout in \"" + test.name + "\": \n" + test.message + "\n\n" + test.stack);
          } else {
            t.ok(true, test.name);
          }
        });

        window.add_completion_callback(function (tests, harnessStatus) {
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

var childProcess = require("child_process");
var EventEmitter = require("events");
var dns = require("dns");

module.exports = function (exports) {
  var server = new EventEmitter();
  server.started = false;

  dns.lookup("web-platform.test", function (err) {
    if (err) {
      console.log("Error : you should add these lines to you hosts file :");
      console.log("127.0.0.1   web-platform.test");
      console.log("127.0.0.1   www.web-platform.test");
      console.log("127.0.0.1   www1.web-platform.test");
      console.log("127.0.0.1   www2.web-platform.test");
      console.log("127.0.0.1   xn--n8j6ds53lwwkrqhv28a.web-platform.test");
      console.log("127.0.0.1   xn--lve-6lad.web-platform.test");
      process.exit(1);
    }

    var python = childProcess.spawn("python", ["./serve", "--config", "../config.jsdom.json"], {
      cwd: __dirname + "/tests"
    });

    var current = "";

    var lines = [];

    function readLine(line) {
      lines.push(line);
      if (line === "INFO:web-platform-tests:Starting http server on web-platform.test:9000") {
        server.started = true;
        server.emit("start");
      }
    }

    function readData(data) {
      current += data.toString();
      var lines = current.split(/(\r?\n)/g);
      for (var i = 0; i < lines.length - 1; i++) {
        readLine(lines[i]);
      }
      current = lines[lines.length - 1];
    }

    python.stderr.on("data", readData);

    python.stderr.on("end", function () {
      readLine(current);
      if (!server.started) {
        console.error(lines.join(""));
      }
    });

    process.on("exit", function () {
      python.kill();
    });
  });

  const urlPrefix = "http://web-platform.test:9000/";

  return function (testPath) {
    exports[testPath] = function (t) {
      if (server.started) {
        createJsdom(urlPrefix, testPath, t);
      } else {
        server.on("start", function () {
          createJsdom(urlPrefix, testPath, t);
        });
      }
    };
  };
};
