"use strict";
const env = require("../..").env;
const http = require("http");

var routes = {
  "/html": "<!DOCTYPE html><html>" +
    "<head><script>window.test = true;</script><script src=\"/js\"></script></head>" +
    "<body></body>" +
    "</html>",
  "/js": "window.testJs = true;",
  "/xhr": "test"
};

exports["aborting env request should stop window creation"] = function (t) {

  http.createServer(function (req, res) {
    setTimeout(function () {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    }, 200);
  })
  .listen(33333, function () {
    var win = null;
    var req = env({
      url: "http://127.0.0.1:" + 33333 + "/html",
      created: function (err, window) {
        win = window;
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
    req.abort();
    setTimeout(function () {
      t.ok(!win, "the window should not have been created");
      t.done();
    }, 1000);
  });

};

exports["closing window should close requests"] = function (t) {
  http.createServer(function (req, res) {
    setTimeout(function () {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    }, 200);
  })
  .listen(33334, function () {
    env({
      url: "http://127.0.0.1:" + 33334 + "/html",
      created: function (err, window) {
        process.nextTick(function () {

          var requestManager = window.document._requestManager;

          t.ok(requestManager.size() === 1, "the external script should be loading");

          window.close();

          t.ok(requestManager.size() === 0, "the external script should not be loading after close");

          setTimeout(function () {
            t.ok(!window.testJs, "the external script should not execute");
            t.done();
          }, 1000);
        });
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });
};

exports["closing window should close xhr"] = function (t) {
  http.createServer(function (req, res) {
    setTimeout(function () {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    }, 200);
  })
  .listen(33335, function () {
    env({
      url: "http://127.0.0.1:" + 33335 + "/html",
      created: function (err, window) {
        process.nextTick(function () {
          var requestManager = window.document._requestManager;

          const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.send();

          t.ok(requestManager.size() === 1, "the XMLHttpRequest should be loading");

          window.close();

          t.ok(requestManager.size() === 0, "the XMLHttpRequest should not be loading");

          t.done();
        });
      }
    });
  });
};
