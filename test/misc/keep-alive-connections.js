"use strict";
const env = require("../..").env;
const http = require("http");

const routes = {
  "/html": "<!DOCTYPE html><html><head><script src=\"/js\"></script></head><body></body></html>",
  "/js": `const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.send();`,
  "/xhr": "test"
};

exports["only one connection should be opened on sequenced calls"] = t => {
  t.expect(1);
  http.createServer((req, res) => {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  })
  .on("connection", () => {
    t.ok(true);
    t.done();
  })
  .listen(33336, () => {
    env({
      url: "http://127.0.0.1:33336/html",
      created: () => {},
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

exports["each call should open a new connection if keepAlive is disabled"] = t => {
  t.expect(3);
  let i = 0;
  http.createServer((req, res) => {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  })
  .on("connection", () => {
    t.ok(true);
    i++;
    if (i === 3) {
      t.done();
    }
  })
  .listen(33337, () => {
    env({
      url: "http://127.0.0.1:33337/html",
      agentOptions: { keepAlive: false },
      created: () => {},
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

exports["each calls should open a new connection if pool is disabled"] = t => {
  t.expect(3);
  let i = 0;
  http.createServer((req, res) => {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  })
  .on("connection", () => {
    t.ok(true);
    i++;
    if (i === 3) {
      t.done();
    }
  })
  .listen(33338, () => {
    env({
      url: "http://127.0.0.1:33338/html",
      pool: false,
      created: () => {},
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

