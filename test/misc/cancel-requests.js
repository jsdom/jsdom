"use strict";
const env = require("../..").env;
const http = require("http");

const routes = {
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
    let win = null;
    const req = env({
      url: "http://127.0.0.1:33333/html",
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
      url: "http://127.0.0.1:33334/html",
      created: function (err, window) {
        process.nextTick(function () {
          const script = window.document.getElementsByTagName("script")[1];
          script.onerror = function () {
            t.ok(false, "the external script onerror should not be executed");
          };
          window.close();
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
      url: "http://127.0.0.1:33335/html",
      created: function (err, window) {
        process.nextTick(function () {
          const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.onreadystatechange = function () {
            t.ok(false, "xhr should not change state");
            t.done();
          };
          xhr.onerror = function () {
            t.ok(false, "xhr should not trigger error");
            t.done();
          };
          xhr.onabort = function () {
            t.ok(false, "xhr should not trigger abort");
            t.done();
          };
          xhr.send();
          window.close();
          setTimeout(function () {
            t.done();
          }, 1000);
        });
      }
    });
  });
};


exports["stopping window should close requests but error event should be triggered"] = function (t) {
  http.createServer(function (req, res) {
    setTimeout(function () {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    }, 200);
  })
  .listen(33339, function () {
    env({
      url: "http://127.0.0.1:33339/html",
      created: function (err, window) {
        t.expect(2);
        process.nextTick(function () {
          const script = window.document.getElementsByTagName("script")[1];
          script.onerror = function () {
            t.ok(true, "the external script onerror should be executed");
          };
          window.stop();
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


exports["stopping window should close xhr but abort event should be triggered"] = function (t) {
  http.createServer(function (req, res) {
    setTimeout(function () {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    }, 200);
  })
  .listen(33340, function () {
    env({
      url: "http://127.0.0.1:33340/html",
      created: function (err, window) {
        t.expect(2);
        process.nextTick(function () {
          const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.onreadystatechange = function () {
            t.ok(true, "xhr should trigger change state");
          };
          xhr.onerror = function () {
            t.ok(false, "xhr should not trigger error");
            t.done();
          };
          xhr.onabort = function () {
            t.ok(true, "xhr should trigger abort");
          };
          xhr.send();
          window.stop();
          setTimeout(function () {
            t.done();
          }, 1000);
        });
      }
    });
  });
};


