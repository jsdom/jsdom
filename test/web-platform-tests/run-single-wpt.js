"use strict";
/* eslint-disable no-console */
const fs = require("fs");
const path = require("path");
const { specify } = require("mocha-sugar-free");
const { inBrowserContext, nodeResolverPromise } = require("../util.js");
const jsdom = require("../../lib/old-api.js");

const globalPool = { maxSockets: 6 };

module.exports = urlPrefixFactory => {
  if (inBrowserContext()) {
    return () => {
      // TODO: browser support for running WPT
    };
  }

  return (testPath, title = testPath) => {
    specify({
      title,
      expectPromise: true,
      // WPT also takes care of timeouts (maximum 60 seconds), this is an extra failsafe:
      timeout: 70000,
      slow: 10000,
      skipIfBrowser: true,
      fn() {
        return createJSDOM(urlPrefixFactory(), testPath);
      }
    });
  };
};

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
        FetchExternalResources: ["script", "frame", "iframe", "link", "img"],
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
