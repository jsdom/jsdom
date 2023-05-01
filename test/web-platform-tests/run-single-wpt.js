"use strict";
/* eslint-disable no-console */
const path = require("path");
const { URL } = require("url");
const { specify } = require("mocha-sugar-free");
const { JSDOM, VirtualConsole } = require("../../lib/api.js");
const ResourceLoader = require("../../lib/jsdom/browser/resources/resource-loader");
const { resolveReason } = require("./utils.js");

const reporterPathname = "/resources/testharnessreport.js";
const unexpectedPassingTestMessage = `
            Hey, did you fix a bug? This test used to be failing, but during
            this run there were no errors. If you have fixed the issue covered
            by this test, you can edit the "to-run.yaml" file and remove the line
            containing this test. Thanks!
            `;

module.exports = urlPrefixFactory => {
  return (testPath, title = testPath, expectFail = false) => {
    specify({
      title,
      expectPromise: true,
      // WPT also takes care of timeouts (maximum 60 seconds), this is an extra failsafe:
      timeout: 70_000,
      slow: 10_000,
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
      // https://github.com/web-platform-tests/wpt/blob/master/tools/serve/serve.py#L271
      const filePath = path.resolve(__dirname, "tests" + url.pathname)
        .replace("/resources/WebIDLParser.js", "/resources/webidl2/lib/webidl2.js");

      return super.fetch(`file://${filePath}`, options);
    }

    return super.fetch(urlString, options);
  }
}

function formatFailedTest(test) {
  switch (test.status) {
    case test.PASS:
      return `Unexpected passing test: ${JSON.stringify(test.name)}${unexpectedPassingTestMessage}`;
    case test.FAIL:
    case test.PRECONDITION_FAILED:
      return `Failed in ${JSON.stringify(test.name)}:\n${test.message}\n\n${test.stack}`;
    case test.TIMEOUT:
      return `Timeout in ${JSON.stringify(test.name)}:\n${test.message}\n\n${test.stack}`;
    case test.NOTRUN:
      return `Uncompleted test ${JSON.stringify(test.name)}:\n${test.message}\n\n${test.stack}`;
    default:
      throw new RangeError(`Unexpected test status: ${test.status} (test: ${JSON.stringify(test.name)})`);
  }
}

function createJSDOM(urlPrefix, testPath, expectFail) {
  const unhandledExceptions = [];

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

          // Overriding assert_throws_js and friends in order to allow us to throw exceptions from another realm. See
          // https://github.com/jsdom/jsdom/issues/2727 for more information.

          function assertThrowsJSImpl(constructor, func, description, assertionType) {
            try {
              func.call(this);
              window.assert_true(false, `${assertionType}: ${description}: ${func} did not throw`);
            } catch (e) {
              if (e instanceof window.AssertionError) {
                throw e;
              }

              // Basic sanity-checks on the thrown exception.
              window.assert_true(
                typeof e === "object",
                `${assertionType}: ${description}: ${func} threw ${e} with type ${typeof e}, not an object`
              );

              window.assert_true(
                e !== null,
                `${assertionType}: ${description}: ${func} threw null, not an object`
              );

              // Basic sanity-check on the passed-in constructor
              window.assert_true(
                typeof constructor === "function",
                `${assertionType}: ${description}: ${constructor} is not a constructor`
              );
              let obj = constructor;
              while (obj) {
                if (typeof obj === "function" &&
                          obj.name === "Error") {
                  break;
                }
                obj = Object.getPrototypeOf(obj);
              }
              window.assert_true(
                obj !== null && obj !== undefined,
                `${assertionType}: ${description}: ${constructor} is not an Error subtype`
              );

              // And checking that our exception is reasonable
              window.assert_equals(
                e.name,
                constructor.name,
                `${assertionType}: ${description}: ${func} threw ${e} (${e.name}) ` +
                `expected instance of ${constructor.name}`
              );
            }
          }

          // eslint-disable-next-line camelcase
          window.assert_throws_js = (constructor, func, description) => {
            assertThrowsJSImpl(constructor, func, description, "assert_throws_js");
          };
          // eslint-disable-next-line camelcase
          window.promise_rejects_js = (test, expected, promise, description) => {
            return promise.then(test.unreached_func("Should have rejected: " + description)).catch(e => {
              assertThrowsJSImpl(expected, () => {
                throw e;
              }, description, "promise_reject_js");
            });
          };

          window.add_result_callback(test => {
            if (test.status === test.FAIL || test.status === test.TIMEOUT || test.status === test.NOTRUN) {
              errors.push(formatFailedTest(test));
            }
          });

          window.add_completion_callback((tests, harnessStatus) => {
            // This needs to be delayed since some tests do things even after calling done().
            process.nextTick(() => {
              window.close();
            });

            let harnessFail = false;
            if (harnessStatus.status === harnessStatus.ERROR) {
              harnessFail = true;
              errors.push(new Error(`test harness should not error: ${testPath}\n${harnessStatus.message}`));
            } else if (harnessStatus.status === harnessStatus.TIMEOUT) {
              harnessFail = true;
              errors.push(new Error(`test harness should not timeout: ${testPath}`));
            }

            errors.push(...unhandledExceptions);

            if (typeof expectFail === "object" && (harnessFail || unhandledExceptions.length)) {
              expectFail = false;
            }

            if (errors.length === 0 && expectFail) {
              reject(new Error(unexpectedPassingTestMessage));
            } else if ((errors.length === 1 && (tests.length === 1 || harnessFail)) && !expectFail) {
              reject(new Error(errors[0]));
            } else if (errors.length && !expectFail) {
              reject(new Error(`${errors.length}/${tests.length} errors in test:\n\n${errors.join("\n\n")}`));
            } else if (typeof expectFail !== "object") {
              resolve();
            } else {
              const unexpectedErrors = [];
              for (const test of tests) {
                const data = expectFail[test.name];
                const reason = data && data[0];

                const innerExpectFail = resolveReason(reason) === "expect-fail";
                if (innerExpectFail ? test.status === test.PASS : test.status !== test.PASS) {
                  unexpectedErrors.push(formatFailedTest(test));
                }
              }

              if (unexpectedErrors.length) {
                reject(new Error(`${unexpectedErrors.length}/${tests.length} errors in test:\n\n${
                  unexpectedErrors.join("\n\n")}`));
              } else {
                resolve();
              }
            }
          });
        };
      });
    });
}
