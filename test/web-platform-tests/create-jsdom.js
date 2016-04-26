"use strict";
const jsdom = require("../..");
const nodeResolverPromise = require("../util").nodeResolverPromise;

const globalPool = { maxSockets: 6 };

module.exports = (urlPrefix, testPath) => {
  const reporterPathname = "/resources/testharnessreport.js";
  let doneError = null;

  const created = nodeResolverPromise(createdResolver => {
    jsdom.env({
      url: urlPrefix + testPath,
      pool: globalPool,
      strictSSL: false,
      features: {
        FetchExternalResources: ["script", "frame", "iframe", "link"],
        ProcessExternalResources: ["script"]
      },
      virtualConsole: jsdom.createVirtualConsole().sendTo(console, { omitJsdomErrors: true }),
      resourceLoader(resource, callback) {
        if (resource.url.pathname === reporterPathname) {
          callback(null, "window.shimTest();");
        } else {
          resource.defaultFetch(callback);
        }
      },
      created: createdResolver, // error, window
      done(error) { // error, window
        doneError = error;
      }
    });
  });


  return created
  .then(window => {
    return new Promise((resolve, reject) => {
      const errors = [];

      window.shimTest = () => {
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

          if (doneError) {
            errors.push(doneError);
          }

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
};
