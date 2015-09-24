"use strict";
const env = require("../..").env;
const http = require("http");

var routes = {
  "/html": "<!DOCTYPE html><html><head><script src=\"/js\"></script></head><body></body></html>",
  "/js": "var xhr = new window.XMLHttpRequest();" +
          "xhr.open(\"GET\", \"/xhr\", true);" +
          "xhr.send();",
  "/xhr": "test"
};

exports["only one connection should be openned on sequenced calls"] = function (t) {
  t.expect(1);
  http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  })
  .on("connection", function () {
    t.ok(true);
    t.done();
  })
  .listen(33336, function () {
    env({
      url: "http://127.0.0.1:" + 33336 + "/html",
      created: function () {},
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

exports["each call should open a new connection if keepAlive is disabled"] = function (t) {
  t.expect(3);
  var i = 0;
  http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  })
  .on("connection", function () {
    t.ok(true);
    i++;
    if (i === 3) {
      t.done();
    }
  })
  .listen(33337, function () {
    env({
      url: "http://127.0.0.1:" + 33337 + "/html",
      agentOptions: {keepAlive: false},
      created: function () {},
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

exports["each calls should open a new connection if pool is disabled"] = function (t) {
  t.expect(3);
  var i = 0;
  http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  })
  .on("connection", function () {
    t.ok(true);
    i++;
    if (i === 3) {
      t.done();
    }
  })
  .listen(33338, function () {
    env({
      url: "http://127.0.0.1:" + 33338 + "/html",
      pool: false,
      created: function () {},
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

