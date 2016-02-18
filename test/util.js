"use strict";
const path = require("path");
const jsdom = require("../lib/jsdom");
const fs = require("fs");
const exceptionTable = require("../lib/jsdom/web-idl/dom-exception-table.json");
const request = require("request");

function toPathname(dirname, relativePath) {
  let pathname = path.resolve(dirname, relativePath).replace(/\\/g, "/");
  if (pathname[0] !== "/") {
    pathname = "/" + pathname;
  }
  return pathname;
}

function toFileUrl(dirname, relativePath) {
  return "file://" + toPathname(dirname, relativePath);
}

exports.toFileUrl = dirname => {
  return function (relativePath) {
    return toFileUrl(dirname, relativePath);
  };
};

exports.toPathname = dirname => {
  return function (relativePath) {
    return toPathname(dirname, relativePath);
  };
};

exports.load = dirname => {
  const fileCache = Object.create(null);

  return function (name, options) {
    options = options || {};

    const file = path.resolve(dirname, "files/" + name + ".html");

    if (!options.url) {
      options.url = toFileUrl(dirname, file);
    }

    const contents = fileCache[file] || fs.readFileSync(file, "utf8");
    const doc = jsdom.jsdom(null, options);
    const window = doc.defaultView;

    doc.parent = window;
    window.loadComplete = function () {};

    doc.write(contents);
    doc.close();

    fileCache[file] = contents;
    return doc;
  };
};

/**
 * @param {Document} document
 * @param {String} name
 * @return {Function} A function that tests if the given
 *         exception is a `DOMException` of the specified `code`
 *
 * @example t.throws(function () {
 *   // ...
 * }, domExceptionPredicate(doc, "NoModificationAllowedError"));
 */
exports.domExceptionPredicate = (document, name) => {
  return function (error) {
    return error instanceof document.defaultView.DOMException &&
           error.name === name &&
           error.code === exceptionTable[name].legacyCodeValue;
  };
};

exports.todo = (test, fn) => {
  fn({
    ok(value, message) {
      test.ok(!value, "Marked as TODO: " + message);
    }
    // add more as needed
  });
};

exports.injectIFrame = document => {
  return exports.injectIFrameWithScript(document);
};

exports.injectIFrameWithScript = (document, scriptStr) => {
  scriptStr = scriptStr || "";
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const scriptTag = iframe.contentWindow.document.createElement("script");
  scriptTag.textContent = scriptStr;
  iframe.contentWindow.document.body.appendChild(scriptTag);

  return iframe;
};

/**
 * Create a new Promise and call the given function with a resolver function which can be passed as a node
 * style callback.
 *
 * Node style callbacks expect their first argument to be an Error object or null. The returned promise will
 * be rejected if this first argument is set. Otherwise the promise will be resolved with the second argument of
 * the callback, or with an array of arguments if there are more arguments.
 *
 * @example nodeResolverPromise(nodeResolver => fs.readFile('foo.png', nodeResolver)).then(content => {});
 * @param {Function} fn
 * @returns {Promise}
 */
exports.nodeResolverPromise = fn => {
  return new Promise((resolve, reject) => {
    fn(function (error, result) {
      if (error) {
        reject(error);
      } else if (arguments.length > 2) {
        // pass all the arguments as an array,
        // skipping the error param
        const arrayResult = new Array(arguments.length - 1);
        for (let i = 1; i < arguments.length; ++i) {
          arrayResult[i - 1] = arguments[i];
        }
        resolve(arrayResult);
      } else {
        resolve(result);
      }
    });
  });
};

/**
 * Is this script currently running within a Web Worker context?
 * @returns {boolean}
 */
exports.inWebWorkerContext = () => {
  /* globals WorkerGlobalScope, self */
  return typeof WorkerGlobalScope !== "undefined" && self instanceof WorkerGlobalScope;
};

/**
 * Is this script currently running within a browser context?
 * Note: also returns true within a Web Worker context
 * @returns {boolean}
 */
exports.inBrowserContext = () => {
  /* globals window */
  return (typeof window === "object" && window === window.self) || exports.inWebWorkerContext();
};

/**
 * Resolves a path to a static fixture file to a file or http URL.
 * If running tests from node, a valid file url will be returned.
 * If running tests using karma, a http url to the file be returned (this file is served by karma)
 * @param {string} relativePath Relative path within the test directory. For example "jsdom/files/reddit.html"
 * @returns {string} URL
 */
exports.getTestFixtureUrl = relativePath => {
  /* globals location */
  if (exports.inBrowserContext()) {
    // location is a Location or WorkerLocation
    return location.origin + "/base/test" + (relativePath[0] === "/" ? "" : "/") + relativePath;
  }

  return toFileUrl(__dirname, relativePath);
};

/**
 * Reads a static fixture file as utf8.
 * If running tests from node, the file will be read from the file system
 * If running tests using karma, a http request will be performed to retrieve the file using karma's server.
 * @param {string} relativePath Relative path within the test directory. For example "jsdom/files/reddit.html"
 */
exports.readTestFixture = relativePath => {
  const useRequest = exports.inBrowserContext();

  return exports.nodeResolverPromise(nodeResolver => {
    if (useRequest) {
      request.get(exports.getTestFixtureUrl(relativePath), { timeout: 5000 }, nodeResolver);
    } else {
      fs.readFile(path.resolve(__dirname, relativePath), { encoding: "utf8" }, nodeResolver);
    }
  })
  // request passes (error, response, content) to the callback
  // we are only interested in the `content`
  .then(result => useRequest ? result[1] : result);
};
