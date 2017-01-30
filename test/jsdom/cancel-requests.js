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
  "/js": "window.testJs = true;",
  "/xhr": "test"
};

describe("jsdom/cancel-requests", { skipIfBrowser: true }, () => {
  let server;
  let host;

  before(() => {
    return createServer((req, res) => {
      setTimeout(() => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      }, 200);
    })
    .then(s => {
      server = s;
      host = `http://127.0.0.1:${s.address().port}`;
    });
  });

  after(() => {
    return server.destroy();
  });

  specify("aborting env request should stop window creation", { async: true }, t => {
    const req = jsdom.env({
      url: host + "/html",
      created(err, window) {
        assert.ok(err, "There should be an error");
        assert.notOk(window, "the window should not have been created");
        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
    req.abort();
  });

  specify("closing window should close requests", { async: true }, t => {
    jsdom.env({
      url: host + "/html",
      created(err, window) {
        assert.ifError(err, "There should be no errors");
        process.nextTick(() => {
          const script = window.document.getElementsByTagName("script")[1];
          script.onload = () => {
            assert.ok(false, "the external script onload should not be executed (old)");
          };
          script.addEventListener("load", () => {
            assert.ok(false, "the external script onload should not be executed");
          }, false);

          window.close();

          setTimeout(() => {
            assert.notOk(window.testJs, "the external script should not execute");
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

  specify("closing window should close XHR", { async: true }, t => {
    jsdom.env({
      url: host + "/html",
      created(err, window) {
        assert.ifError(err, "There should be no errors");
        process.nextTick(() => {
          const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.onload = () => {
            assert.ok(false, "xhr should not trigger load (old)");
            t.done();
          };
          xhr.addEventListener("load", () => {
            assert.ok(false, "xhr should not trigger load");
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

  specify("stopping window should close requests and error event should be triggered", { async: true }, t => {
    jsdom.env({
      url: host + "/html",
      created(err, window) {
        assert.ifError(err, "There should be no errors");
        process.nextTick(() => {
          const script = window.document.getElementsByTagName("script")[1];
          script.onerror = () => {
            assert.ok(false, "the external script onerror should not be executed (old)");
          };
          script.addEventListener("error", () => {
            assert.ok(false, "the external script onerror should not be executed");
          });
          window.stop();
          setTimeout(() => {
            assert.ok(!window.testJs, "the external script should not execute");
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

  specify("stopping window should close xhr and abort event should be triggered", { async: true }, t => {
    jsdom.env({
      url: host + "/html",
      created(err, window) {
        assert.ifError(err, "There should be no errors");
        process.nextTick(() => {
          const xhr = new window.XMLHttpRequest();
          xhr.open("GET", "/xhr", true);
          xhr.onreadystatechange = () => {
            assert.ok(true, "xhr should trigger change state (old)");
          };
          xhr.addEventListener("readystatechange", () => {
            assert.ok(true, "xhr should trigger change state");
          }, false);
          xhr.onload = () => {
            assert.ok(false, "xhr should not trigger load (old)");
            t.done();
          };
          xhr.addEventListener("load", () => {
            assert.ok(false, "xhr should not trigger load");
            t.done();
          }, false);
          xhr.onabort = () => {
            assert.ok(true, "xhr should trigger abort (old)");
          };
          xhr.addEventListener("abort", () => {
            assert.ok(true, "xhr should trigger abort");
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
