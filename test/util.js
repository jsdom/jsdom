"use strict";
const path = require("path");
const fs = require("fs");
const http = require("http");
const https = require("https");
const enableDestroy = require("server-destroy");
const AbortController = require("abort-controller");
const fetch = require("node-fetch");
const { JSDOM } = require("..");
const { Canvas } = require("../lib/jsdom/utils");

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
    const { window } = new JSDOM(contents, options);

    // some of the loaded files expect these to exist
    window.document.parent = window;
    window.loadComplete = () => { };

    fileCache[file] = contents;
    return window.document;
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
 * @param {string} relativePath Relative path within the test directory. For example "jsdom/files/test.html"
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
 * @param {string} relativePath Relative path within the test directory. For example "jsdom/files/test.html"
 */
exports.readTestFixture = relativePath => {
  if (exports.inBrowserContext()) {
    const abortController = new AbortController();
    const { signal } = abortController;
    const timeout = setTimeout(() => {
      abortController.abort();
    }, 5000);
    function res(response) {
      if (!response.ok) {
        throw new Error(`Unexpected status ${response.status} fetching ${response.location}`);
      }
      clearTimeout(timeout);
      return response.text();
    }
    function fail(e) {
      clearTimeout(timeout);
      throw e;
    }
    return fetch(exports.getTestFixtureUrl(relativePath), { method: "GET", signal }).then(res).catch(fail);
  }
  return fs.promises.readFile(path.resolve(__dirname, relativePath), { encoding: "utf8" });
};

exports.isCanvasInstalled = (t, done) => {
  if (!Canvas) {
    t.ok(true, "test ignored; not running with the canvas npm package installed");
    done();
    return false;
  }

  return true;
};

exports.delay = ms => new Promise(r => {
  setTimeout(r, ms);
});

exports.createServer = handler => {
  return new Promise(resolve => {
    const server = http.createServer(handler);
    enablePromisifiedServerDestroy(server);
    server.listen(() => resolve(server));
  });
};

exports.createHTTPSServer = handler => {
  return new Promise(resolve => {
    const options = {
      key: fs.readFileSync(path.resolve(__dirname, "api/fixtures/key.pem")),
      cert: fs.readFileSync(path.resolve(__dirname, "api/fixtures/cert.pem"))
    };

    const server = https.createServer(options, handler);
    enablePromisifiedServerDestroy(server);
    server.listen(() => resolve(server));
  });
};

function enablePromisifiedServerDestroy(server) {
  enableDestroy(server);
  const originalDestroy = server.destroy;
  server.destroy = function () {
    return new Promise((resolve, reject) => {
      originalDestroy.call(this, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };
}
