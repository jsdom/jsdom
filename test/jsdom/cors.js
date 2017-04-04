"use strict";
const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;
const before = require("mocha-sugar-free").before;
const after = require("mocha-sugar-free").after;
const createServer = require("../util.js").createServer;

const jsdom = require("../..");

const routes = {
  "/html": `<!DOCTYPE html><html>
    <head><script>window.test = true;</script><script src="/js"></script></head>
    <body></body>
    </html>`,
  "/cors": "test"
};

function createCORSServer() {
  return createServer((req, res) => {
    setTimeout(() => {
      if (req.method === "OPTIONS") {
        res.writeHead(200, {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": ["GET", "PUT", "DELETE", "POST", "OPTIONS"].join(", "),
          "Access-Control-Allow-Headers": ["content-range", "authorization", "accept"].join(", ")
        });
        res.end();
      } else {
        const length = routes.hasOwnProperty(req.url) ? routes[req.url].length : 0;
        res.writeHead(200, { "Content-Length": length });
        res.end(routes[req.url]);
      }
    }, 200);
  }, { host: "localhost", port: 0 });
}

function createBaseServer() {
  return createServer((req, res) => {
    setTimeout(() => {
      const length = routes.hasOwnProperty(req.url) ? routes[req.url].length : 0;
      res.writeHead(200, { "Content-Length": length });
      res.end(routes[req.url]);
    }, 200);
  });
}

describe("jsdom/cors", { skipIfBrowser: true }, () => {
  let server;
  let corsServer;
  let host;
  let corsHost;

  before(() => {
    return Promise.all([createBaseServer(), createCORSServer()])
      .then(servers => {
        server = servers[0];
        corsServer = servers[1];
        host = `http://127.0.0.1:${server.address().port}`;
        corsHost = `http://localhost:${corsServer.address().port}`;
      });
  });

  after(() => {
    return Promise.all([server.destroy(), corsServer.destroy()]);
  });

  specify("preflight response headers should be forwarded", { async: true }, t => {
    jsdom.env({
      url: host + "/html",
      created(err, window) {
        assert.ifError(err, "There should be no errors");
        process.nextTick(() => {
          const xhr = new window.XMLHttpRequest();
          xhr.onload = () => assert.equal(xhr.response, "test");
          xhr.onerror = () => t.done(new TypeError("Network request failed (error)"));
          xhr.ontimeout = () => t.done(new TypeError("Network request failed (timeout)"));

          xhr.open("GET", `${corsHost}/cors`, true);
          xhr.setRequestHeader("Authorization", "Basic dGVzdGluZzpwYXNzd29yZA==");
          xhr.send();

          setTimeout(() => {
            window.stop();
            t.done();
          }, 1000);
        });
      }
    });
  });
});
