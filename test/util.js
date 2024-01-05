"use strict";
const path = require("node:path");
const fs = require("node:fs");
const http = require("node:http");
const https = require("node:https");
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
