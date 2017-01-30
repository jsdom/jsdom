"use strict";
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;
const beforeEach = require("mocha-sugar-free").beforeEach;
const afterEach = require("mocha-sugar-free").afterEach;
const createServer = require("../util.js").createServer;

const jsdom = require("../..");

const routes = {
  "/html": `<!DOCTYPE html><html><head><script src="/js"></script></head><body></body></html>`,
  "/js": `const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.send();`,
  "/xhr": "test"
};

describe("jsdom/keep-alive-connections", { skipIfBrowser: true }, () => {
  let server;
  let host;

  beforeEach(() => {
    return createServer((req, res) => {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    })
    .then(s => {
      server = s;
      host = `http://127.0.0.1:${s.address().port}`;
    });
  });

  afterEach(() => {
    return server.destroy();
  });

  specify("only one connection should be opened on sequenced calls", { async: true }, t => {
    server.on("connection", () => {
      t.done();
    });

    jsdom.env({
      url: host + "/html",
      created() {
        // required by jsdom, but actually what we're testing is on the server side
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("each call should open a new connection if keepAlive is disabled", { async: true }, t => {
    let connections = 0;
    server.on("connection", () => {
      ++connections;
      if (connections === 3) {
        t.done();
      }
    });

    jsdom.env({
      url: host + "/html",
      agentOptions: { keepAlive: false },
      created() {
        // required by jsdom, but actually what we're testing is on the server side
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("each call should open a new connection if pool is disabled", { async: true }, t => {
    let connections = 0;
    server.on("connection", () => {
      ++connections;
      if (connections === 3) {
        t.done();
      }
    });

    jsdom.env({
      url: host + "/html",
      pool: false,
      created() {
        // required by jsdom, but actually what we're testing is on the server side
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
});
