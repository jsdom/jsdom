"use strict";
const path = require("path");
const fs = require("fs");
const http = require("http");
const { after } = require("mocha-sugar-free");
const enableDestroy = require("server-destroy");
const { JSDOM } = require("..");
const { Canvas } = require("../lib/jsdom/utils");
const { pathToFileURL } = require("url");

exports.toFileUrl = dirname => {
  return function (relativePath) {
    return pathToFileURL(path.resolve(dirname, relativePath)).href;
  };
};

exports.load = dirname => {
  const fileCache = Object.create(null);

  return function (name, options = {}) {
    const file = path.resolve(dirname, "files/" + name + ".html");

    if (!options.url) {
      options.url = pathToFileURL(path.resolve(dirname, file)).href;
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

exports.injectIFrameWithScript = (document, scriptStr = "") => {
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const scriptTag = iframe.contentWindow.document.createElement("script");
  scriptTag.textContent = scriptStr;
  iframe.contentWindow.document.body.appendChild(scriptTag);

  return iframe;
};

exports.readTestFixture = relativePath => {
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

// Track all created servers for cleanup.
const activeServers = new Set();

exports.createServer = handler => {
  return new Promise(resolve => {
    const server = http.createServer(handler);
    enablePromisifiedServerDestroy(server);
    activeServers.add(server);
    server.listen(() => resolve(server));
  });
};

// Clean up any servers that weren't explicitly destroyed (e.g., due to test timeout).
// This runs once at the very end of all tests.
after(async () => {
  const serversToDestroy = [...activeServers];
  activeServers.clear();
  await Promise.all(serversToDestroy.map(server => server.destroy().catch(() => {})));
});

function enablePromisifiedServerDestroy(server) {
  enableDestroy(server);
  const originalDestroy = server.destroy;
  server.destroy = function () {
    activeServers.delete(this);
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
