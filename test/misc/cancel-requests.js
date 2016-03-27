"use strict";
const env = require("../..").env;
const http = require("http");
const portfinder = require("portfinder");

const routes = {
  "/html": "<!DOCTYPE html><html>" +
    "<head><script>window.test = true;</script><script src=\"/js\"></script></head>" +
    "<body></body>" +
    "</html>",
  "/js": "window.testJs = true;",
  "/xhr": "test"
};

exports["aborting env request should stop window creation"] = t => {
  portfinder.getPort((e, port) => {
    if (e) {
      t.ok(false);
      t.done();
      return;
    }
    http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      }, 200);
    })
    .listen(port, () => {
      const req = env({
        url: "http://127.0.0.1:" + port + "/html",
        created(err, window) {
          t.ok(err, "There should be an error");
          t.ok(!window, "the window should not have been created");
          t.done();
        },
        features: {
          FetchExternalResources: ["script"],
          ProcessExternalResources: ["script"]
        }
      });
      req.abort();
    });
  });
};

exports["closing window should close requests"] = t => {
  portfinder.getPort((e, port) => {
    if (e) {
      t.ok(false);
      t.done();
      return;
    }
    http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      }, 200);
    })
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
        created(err, window) {
          t.strictEqual(err, null, "There should be no errors");
          process.nextTick(() => {
            const script = window.document.getElementsByTagName("script")[1];
            script.onload = () => {
              t.ok(false, "the external script onload should not be executed (old)");
            };
            script.addEventListener("load", () => {
              t.ok(false, "the external script onload should not be executed");
            }, false);
            window.close();
            setTimeout(() => {
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
  });
};

exports["closing window should close xhr"] = t => {
  portfinder.getPort((e, port) => {
    if (e) {
      t.ok(false);
      t.done();
      return;
    }
    http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      }, 200);
    })
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
        created(err, window) {
          t.strictEqual(err, null, "There should be no errors");
          process.nextTick(() => {
            const xhr = new window.XMLHttpRequest();
            xhr.open("GET", "/xhr", true);
            xhr.onload = () => {
              t.ok(false, "xhr should not trigger load (old)");
              t.done();
            };
            xhr.addEventListener("load", () => {
              t.ok(false, "xhr should not trigger load");
            }, false);
            xhr.send();
            window.close();
            setTimeout(() => {
              t.done();
            }, 1000);
          });
        }
      });
    });
  });
};


exports["stopping window should close requests and error event should be triggered"] = t => {
  portfinder.getPort((e, port) => {
    if (e) {
      t.ok(false);
      t.done();
      return;
    }
    http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      }, 200);
    })
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
        created(err, window) {
          t.expect(4);
          t.strictEqual(err, null, "There should be no errors");
          process.nextTick(() => {
            const script = window.document.getElementsByTagName("script")[1];
            script.onerror = () => {
              t.ok(true, "the external script onerror should be executed (old)");
            };
            script.addEventListener("error", () => {
              t.ok(true, "the external script onerror should be executed");
            }, false);
            window.stop();
            setTimeout(() => {
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
  });
};


exports["stopping window should close xhr and abort event should be triggered"] = t => {
  portfinder.getPort((e, port) => {
    if (e) {
      t.ok(false);
      t.done();
      return;
    }
    http.createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      }, 200);
    })
    .listen(port, () => {
      env({
        url: "http://127.0.0.1:" + port + "/html",
        created(err, window) {
          t.expect(5);
          t.strictEqual(err, null, "There should be no errors");
          process.nextTick(() => {
            const xhr = new window.XMLHttpRequest();
            xhr.open("GET", "/xhr", true);
            xhr.onreadystatechange = () => {
              t.ok(true, "xhr should trigger change state (old)");
            };
            xhr.addEventListener("readystatechange", () => {
              t.ok(true, "xhr should trigger change state");
            }, false);
            xhr.onload = () => {
              t.ok(false, "xhr should not trigger load (old)");
              t.done();
            };
            xhr.addEventListener("load", () => {
              t.ok(false, "xhr should not trigger load");
              t.done();
            }, false);
            xhr.onabort = () => {
              t.ok(true, "xhr should trigger abort (old)");
            };
            xhr.addEventListener("abort", () => {
              t.ok(true, "xhr should trigger abort");
            }, false);
            xhr.send();
            window.stop();
            setTimeout(() => {
              t.done();
            }, 1000);
          });
        }
      });
    });
  });
};
