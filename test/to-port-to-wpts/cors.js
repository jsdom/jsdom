"use strict";
const { assert } = require("chai");
const { describe, specify, before, after } = require("mocha-sugar-free");
const { createServer } = require("../util.js");

const { JSDOM } = require("../..");

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
      } else if (Object.prototype.hasOwnProperty.call(routes, req.url)) {
        const route = routes[req.url];
        res.writeHead(200, {
          "Content-Length": route.length,
          "Access-Control-Allow-Origin": "*"
        });
        res.end(route);
      } else {
        res.writeHead(200, {
          "Content-Length": 0,
          "Access-Control-Allow-Origin": "*"
        });
        res.end();
      }
    }, 200);
  });
}

function createBaseServer() {
  return createServer((req, res) => {
    setTimeout(() => {
      if (Object.prototype.hasOwnProperty.call(routes, req.url)) {
        const route = routes[req.url];
        res.writeHead(200, { "Content-Length": route.length });
        res.end(route);
      } else {
        res.writeHead(200, { "Content-Length": 0 });
        res.end();
      }
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
        corsHost = `http://127.0.0.1:${corsServer.address().port}`;
      });
  });

  after(() => {
    return Promise.all([server.destroy(), corsServer.destroy()]);
  });

  specify("preflight response headers should be forwarded", () => {
    return JSDOM.fromURL(host + "/html").then(({ window }) => {
      return new Promise((resolve, reject) => {
        const xhr = new window.XMLHttpRequest();
        xhr.onload = () => {
          assert.equal(xhr.response, "test");
          resolve();
        };
        xhr.onerror = () => reject(new Error("Network request failed (error)"));
        xhr.ontimeout = () => reject(new Error("Network request failed (timeout)"));

        xhr.open("GET", `${corsHost}/cors`, true);
        xhr.setRequestHeader("Authorization", "Basic dGVzdGluZzpwYXNzd29yZA==");
        xhr.send();
      });
    });
  });
});
