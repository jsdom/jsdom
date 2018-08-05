"use strict";
const { describe, it, beforeEach, afterEach } = require("mocha-sugar-free");
const { createServer } = require("../util.js");

const { JSDOM } = require("../..");

const routes = {
  "/html": `<!DOCTYPE html><html><head><script src="/js"></script></head><body></body></html>`,
  "/js": `const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr");
          xhr.onload = () => {
            window.done();
          };
          xhr.send();`,
  "/xhr": "test"
};

describe("Connection keep-alive", { skipIfBrowser: true }, () => {
  let server;
  let host;

  beforeEach(() => {
    return createServer((req, res) => {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    }).then(s => {
      server = s;
      host = `http://127.0.0.1:${s.address().port}`;
    });
  });

  afterEach(() => {
    return server.destroy();
  });

  it("should only open one connection on sequenced calls", () => {
    const connectionPromise = new Promise(resolve => {
      server.on("connection", () => {
        resolve();
      });
    });

    return JSDOM.fromURL(host + "/html", { resources: "usable", runScripts: "dangerously" }).then(({ window }) => {
      return Promise.all([connectionPromise, xhrDonePromise(window)]);
    });
  });

  it("should open a new connection for each fetch if keepAlive is disabled", () => {
    const connectionPromise = new Promise(resolve => {
      let connections = 0;
      server.on("connection", () => {
        ++connections;
        if (connections === 3) {
          resolve();
        }
      });
    });

    return JSDOM.fromURL(host + "/html", {
      resources: "usable",
      runScripts: "dangerously",
      agentOptions: { keepAlive: false }
    }).then(({ window }) => {
      return Promise.all([connectionPromise, xhrDonePromise(window)]);
    });
  });

  it("should open a new connection for each fetch if pool is disabled", () => {
    const connectionPromise = new Promise(resolve => {
      let connections = 0;
      server.on("connection", () => {
        ++connections;
        if (connections === 3) {
          resolve();
        }
      });
    });

    return JSDOM.fromURL(host + "/html", {
      resources: "usable",
      runScripts: "dangerously",
      pool: false
    }).then(({ window }) => {
      return Promise.all([connectionPromise, xhrDonePromise(window)]);
    });
  });
});

// This avoids "socket hang up" errors for when we stop the test (and thus kill the server) without waiting for the
// XHR to finish.
function xhrDonePromise(window) {
  return new Promise(resolve => {
    window.done = resolve;
  });
}
