"use strict";
const env = require("../..").env;
const http = require("http");
const portfinder = require("portfinder");

const routes = {
  "/html": "<!DOCTYPE html><html><head><script src=\"/js\"></script></head><body></body></html>",
  "/js": `const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.send();`,
  "/xhr": "test"
};

exports["only one connection should be opened on sequenced calls"] = t => {
  portfinder.getPort((err, port) => {
    if (err) {
      t.ok(false);
      t.done();
      return;
    }
    t.expect(1);
    http.createServer((req, res) => {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    })
    .on("connection", () => {
      t.ok(true);
      t.done();
    })
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
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
};

exports["each call should open a new connection if keepAlive is disabled"] = t => {
  portfinder.getPort((err, port) => {
    if (err) {
      t.ok(false);
      t.done();
      return;
    }
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
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
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
  });
};

exports["each calls should open a new connection if pool is disabled"] = t => {
  portfinder.getPort((err, port) => {
    if (err) {
      t.ok(false);
      t.done();
      return;
    }
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
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
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
};

