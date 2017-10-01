"use strict";
/* eslint-disable no-console, no-process-exit, global-require */
const fs = require("fs");
const path = require("path");
const dns = require("dns");
const childProcess = require("child_process");
const { EventEmitter } = require("events");
const q = require("q");
const { specify } = require("mocha-sugar-free");
const { inBrowserContext, nodeResolverPromise } = require("../util.js");
const requestHead = require("request-promise-native").head;
const jsdom = require("../../lib/old-api.js");

const wptDir = path.resolve(__dirname, "tests");

const configPaths = {
  default: path.resolve(__dirname, "wpt-config.json"),
  toUpstream: path.resolve(__dirname, "tuwpt-config.json")
};

const configs = {
  default: require(configPaths.default),
  toUpstream: require(configPaths.toUpstream)
};

const globalPool = { maxSockets: 6 };

module.exports = ({ toUpstream = false } = {}) => {
  if (inBrowserContext()) {
    return () => {
      // TODO: browser support for running WPT
    };
  }

  const configType = toUpstream ? "toUpstream" : "default";
  const configPath = configPaths[configType];
  const config = configs[configType];

  const server = new EventEmitter();

  let serverHasStarted;
  server.started = new Promise(resolve => {
    serverHasStarted = resolve;
  });
  server.isStarted = false;

  let urlPrefix = `http://${config.host}:${config.ports.http[0]}/`;

  dns.lookup("web-platform.test", err => {
    if (err) {
      console.warn();
      console.warn("Host entries not present for web platform tests.");
      console.warn("See https://github.com/w3c/web-platform-tests#running-the-tests");

      if (!toUpstream) {
        console.warn("Falling back to hosted versions at w3c-test.org");
        urlPrefix = "http://w3c-test.org/";
      }
      serverHasStarted();
      return;
    }

    const configArg = path.relative(path.resolve(wptDir), configPath);
    const args = ["./wpt.py", "serve", "--config", configArg];
    const python = childProcess.spawn("python", args, {
      cwd: wptDir,
      stdio: "inherit"
    });

    python.on("error", e => {
      console.warn();
      console.warn("Error starting python server process:", e.message);

      if (toUpstream) {
        console.error("Cannot proceed with running the tests.");
        process.exit(1);
      } else {
        console.warn("Falling back to hosted versions at w3ctest.org");
        urlPrefix = "http://w3c-test.org/";
        serverHasStarted();
      }
    });

    pollForServer(() => urlPrefix).then(serverHasStarted);

    process.on("exit", () => {
      // Python doesn't register a default handler for SIGTERM and it doesn't run __exit__() methods of context managers
      // when it gets that signal. Using SIGINT avoids this problem
      python.kill("SIGINT");
    });
  });

  return (testPath, title = testPath) => {
    specify({
      title,
      expectPromise: true,
      // WPT also takes care of timeouts (maximum 60 seconds), this is an extra failsafe:
      timeout: 70000,
      slow: 10000,
      skipIfBrowser: true,
      fn() {
        return server.started.then(() => createJSDOM(urlPrefix, testPath));
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

function createJSDOM(urlPrefix, testPath) {
  const reporterPathname = "/resources/testharnessreport.js";
  const unhandledExceptions = [];
  const doneErrors = [];

  let allowUnhandledExceptions = false;

  const created = nodeResolverPromise(createdResolver => {
    const virtualConsole = jsdom.createVirtualConsole().sendTo(console, { omitJSDOMErrors: true });
    virtualConsole.on("jsdomError", e => {
      if (e.type === "unhandled exception" && !allowUnhandledExceptions) {
        unhandledExceptions.push(e);
        console.error(e.detail.stack);
      }
    });

    jsdom.env({
      url: urlPrefix + testPath,
      pool: globalPool,
      strictSSL: false,
      features: {
        FetchExternalResources: ["script", "frame", "iframe", "link"],
        ProcessExternalResources: ["script"]
      },
      virtualConsole,
      resourceLoader(resource, callback) {
        if (resource.url.pathname === reporterPathname) {
          callback(null, "window.shimTest();");
        } else if (resource.url.pathname.startsWith("/resources/")) {
          // When running to-upstream tests, the server doesn't have a /resources/ directory.
          // So, always go to the one in ./tests.
          const filePath = path.resolve(__dirname, "tests" + resource.url.pathname);
          fs.readFile(filePath, { encoding: "utf-8" }, callback);
        } else {
          resource.defaultFetch(callback);
        }
      },
      created: createdResolver, // error, window
      done(error) { // error, window
        if (error) {
          doneErrors.push(error);
        }
      },
      pretendToBeVisual: true
    });
  });


  return created.then(window => {
    return new Promise((resolve, reject) => {
      const errors = [];

      window.shimTest = () => {
        const oldSetup = window.setup;
        window.setup = options => {
          if (options.allow_uncaught_exception) {
            allowUnhandledExceptions = true;
          }
          oldSetup(options);
        };

        window.add_result_callback(test => {
          if (test.status === 1) {
            errors.push(`Failed in "${test.name}": \n${test.message}\n\n${test.stack}`);
          } else if (test.status === 2) {
            errors.push(`Timeout in "${test.name}": \n${test.message}\n\n${test.stack}`);
          } else if (test.status === 3) {
            errors.push(`Uncompleted test "${test.name}": \n${test.message}\n\n${test.stack}`);
          }
        });

        window.add_completion_callback((tests, harnessStatus) => {
          // This needs to be delayed since some tests do things even after calling done().
          process.nextTick(() => {
            window.close();
          });

          if (harnessStatus.status === 2) {
            errors.push(new Error(`test harness should not timeout: ${testPath}`));
          }

          errors.push(...doneErrors);
          errors.push(...unhandledExceptions);

          if (errors.length === 1) {
            reject(new Error(errors[0]));
          } else if (errors.length) {
            reject(new Error(`${errors.length} errors in test:\n\n${errors.join("\n")}`));
          } else {
            resolve();
          }
        });
      };
    });
  });
}
