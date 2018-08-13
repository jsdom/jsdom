"use strict";
/* eslint-disable no-console */
const path = require("path");
const { URL } = require("url");
const { specify } = require("mocha-sugar-free");
const { inBrowserContext } = require("../util.js");
const { JSDOM, VirtualConsole } = require("../../lib/api.js");
const ResourceLoader = require("../../lib/jsdom/browser/resources/resource-loader");

const reporterPathname = "/resources/testharnessreport.js";

module.exports = urlPrefixFactory => {
  if (inBrowserContext()) {
    return () => {
      // TODO: browser support for running WPT
    };
  }

  return (testPath, title = testPath, expectFail) => {
    specify({
      title,
      expectPromise: true,
      // WPT also takes care of timeouts (maximum 60 seconds), this is an extra failsafe:
      timeout: 70000,
      slow: 10000,
      skipIfBrowser: true,
      fn() {
        return createJSDOM(urlPrefixFactory(), testPath, expectFail);
      }
    });
  };
};

class CustomResourceLoader extends ResourceLoader {
  constructor() {
    super({ strictSSL: false });
  }
  fetch(urlString, options) {
    const url = new URL(urlString);

    if (url.pathname === reporterPathname) {
      return Promise.resolve(Buffer.from("window.shimTest();", "utf-8"));
    } else if (url.pathname.startsWith("/resources/")) {
      // When running to-upstream tests, the server doesn't have a /resources/ directory.
      // So, always go to the one in ./tests.
      // The path replacement accounts for a rewrite performed by the WPT server:
      // https://github.com/w3c/web-platform-tests/blob/master/tools/serve/serve.py#L271
      const filePath = path.resolve(__dirname, "tests" + url.pathname)
        .replace("/resources/WebIDLParser.js", "/resources/webidl2/lib/webidl2.js");

      return super.fetch(`file://${filePath}`, options);
    }

    return super.fetch(urlString, options);
  }
}

function createJSDOM(urlPrefix, testPath, expectFail) {
  const unhandledExceptions = [];
  const doneErrors = [];

  let allowUnhandledExceptions = false;

  const virtualConsole = new VirtualConsole().sendTo(console, { omitJSDOMErrors: true });
  virtualConsole.on("jsdomError", e => {
    if (e.type === "unhandled exception" && !allowUnhandledExceptions) {
      unhandledExceptions.push(e);

      // Some failing tests make a lot of noise.
      // There's no need to log these messages
      // for errors we're already aware of.
      if (!expectFail) {
        console.error(e.detail.stack);
      }
    }
  });

  return JSDOM.fromURL(urlPrefix + testPath, {
    runScripts: "dangerously",
    virtualConsole,
    resources: new CustomResourceLoader(),
    pretendToBeVisual: true,
    storageQuota: 100000 // Filling the default quota takes about a minute between two WPTs
  })
    .then(dom => {
      const { window } = dom;

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

            if (errors.length === 0 && expectFail) {
              reject(new Error(`
            Hey, did you fix a bug? This test used to be failing, but during
            this run there were no errors. If you have fixed the issue covered
            by this test, you can edit the "to-run.yaml" file and remove the line
            containing this test. Thanks!
            `));
            } else if (errors.length === 1 && !expectFail) {
              reject(new Error(errors[0]));
            } else if (errors.length && !expectFail) {
              reject(new Error(`${errors.length} errors in test:\n\n${errors.join("\n")}`));
            } else {
              resolve();
            }
          });
        };
      });
    });
}
