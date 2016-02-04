"use strict";

const t = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const it = require("mocha-sugar-free").it;

const env = require("../..").env;
const createVirtualConsole = require("../..").createVirtualConsole;
const serializeDocument = require("../..").serializeDocument;
const path = require("path");
const http = require("http");
const toFileUrl = require("../util").toFileUrl(__dirname);

describe("jsdom/env", () => {
  it("with invalid arguments", () => {
    t.throws(() => env());
    t.throws(() => env({}));
    t.throws(() => env({ html: "abc123" }));
    t.throws(() => env({ done() {} }));
  });

  it("explicit config.html, full document", { async: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      url: "http://example.com/",
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        t.equal(window.location.href, "http://example.com/");
        t.equal(window.location.origin, "http://example.com");
        testCase.done();
      }
    });
  });

  it("explicit config.html, with overridden config.url", { async: true }, testCase => {
    env({
      html: "Hello",
      url: "http://example.com/",
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document), "<html><head></head><body>Hello</body></html>");
        t.equal(window.location.href, "http://example.com/");
        t.equal(window.location.origin, "http://example.com");
        t.equal(window.location.search, "");
        t.equal(window.location.hash, "");
        testCase.done();
      }
    });
  });

  it("explicit config.html, with overridden config.url including hash", { async: true }, testCase => {
    env({
      html: "Hello",
      url: "http://example.com/#foo",
      done(err, window) {
        t.ifError(err);
        t.equal(window.location.hash, "#foo");
        testCase.done();
      }
    });
  });

  it("explicit config.html, with overridden config.url including search and hash", { async: true }, testCase => {
    env({
      html: "Hello",
      url: "http://example.com/?foo=bar#baz",
      done(err, window) {
        t.ifError(err);
        t.equal(window.location.search, "?foo=bar");
        t.equal(window.location.hash, "#baz");
        testCase.done();
      }
    });
  });

  it("explicit config.html, without a config.url", { async: true }, testCase => {
    env({
      html: "<html><head></head><body><p>hello world!</p></body></html>",
      done(err, window) {
        t.ifError(err);
        t.notEqual(window.location.href, null);
        testCase.done();
      }
    });
  });

  it("explicit config.html, with poorly formatted HTML", { async: true }, testCase => {
    env({
      html: "some poorly<div>formed<b>html</div> fragment",
      done(err, window) {
        t.ifError(err);
        t.notEqual(window.location.href, null);
        testCase.done();
      }
    });
  });

  it("explicit config.html, with a relative frame URL but no document URL (GH-1277)", { async: true }, testCase => {
    env({
      html: `<iframe src="/ads/728x90.html"></iframe>`,
      done(err, window) {
        t.ifError(err);

        // Unresolvable URLs (in this case a relative URL against about:blank) should create windows for about:blank.
        t.equal(window.document.querySelector("iframe").src, "/ads/728x90.html");
        t.equal(window.document.querySelector("iframe").contentWindow.document.URL, "about:blank");

        testCase.done();
      }
    });
  });

  it("explicit config.html, a string that is also a valid URL", { async: true }, testCase => {
    env({
      html: "http://example.com/",
      url: "http://example.com/",
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document), "<html><head></head><body>http://example.com/</body></html>");
        t.equal(window.location.href, "http://example.com/");
        testCase.done();
      }
    });
  });

  it("explicit config.html, a string that is also a valid file", { async: true, skipIfBrowser: true }, testCase => {
    const body = path.resolve(__dirname, "files/env.html");
    env({
      html: body,
      url: "http://example.com/",
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
        t.equal(window.location.href, "http://example.com/");
        testCase.done();
      }
    });
  });

  it("explicit config.html, an empty string", { async: true }, testCase => {
    env({
      html: "",
      created() {
        testCase.done();
      }
    });
  });

  it("explicit config.url, valid", { async: true, skipIfBrowser: true }, testCase => {
    const html = "<html><head><title>Example URL</title></head><body>Example!</body></html>";
    const responseText = "<!DOCTYPE html>" + html;

    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Length": responseText.length });
      res.end(responseText);
      server.close();
    }).listen(8976);

    env({
      url: "http://localhost:8976/",
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document), responseText);
        t.equal(window.location.href, "http://localhost:8976/");
        t.equal(window.location.origin, "http://localhost:8976");
        testCase.done();
      }
    });
  });

  it("explicit config.url, invalid", { async: true, skipIfBrowser: true }, testCase => {
    env({
      url: "http://localhost:8976",
      done(err, window) {
        t.ok(err, "an error should exist");
        t.strictEqual(window, undefined, "window should not exist");
        testCase.done();
      }
    });
  });

  it("explicit config.file, valid", { async: true, skipIfBrowser: true }, testCase => {
    const fileName = path.resolve(__dirname, "files/env.html");

    env({
      file: fileName,
      done(err, window) {
        t.ifError(err);
        t.equal(serializeDocument(window.document), `<!DOCTYPE html><html><head>
    <title>hello, Node.js!</title>
  </head>
  <body>\n  \n\n</body></html>`);
        t.equal(window.location.href, toFileUrl(fileName));
        testCase.done();
      }
    });
  });

  it("explicit config.file, invalid", { async: true, skipIfBrowser: true }, testCase => {
    env({
      file: "__DOES_NOT_EXIST__",
      done(err, window) {
        t.ok(err, "an error should exist");
        t.strictEqual(window, undefined, "window should not exist");
        testCase.done();
      }
    });
  });

  it("explicit config.file, with a script", { async: true, skipIfBrowser: true }, testCase => {
    env({
      file: path.resolve(__dirname, "files/env.html"),
      scripts: [path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.2.js")],
      done(err, window) {
        t.ifError(err);

        const $ = window.jQuery;
        const text = "Let's Rock!";

        $("body").text(text);

        t.equal($("body").text(), text);
        testCase.done();
      }
    });
  });

  it("explicit config.file, with spaces in the file name", { async: true, skipIfBrowser: true }, testCase => {
    const fileName = path.resolve(__dirname, "files/folder space/space.html");

    env({
      file: fileName,
      done(err) {
        t.ifError(err);
        testCase.done();
      }
    });
  });

  it("string, parseable as a URL, valid", { async: true, skipIfBrowser: true }, testCase => {
    const html = "<html><head><title>Example URL</title></head><body>Example!</body></html>";
    const responseText = "<!DOCTYPE html>" + html;

    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Length": responseText.length });
      res.end(responseText);
      server.close();
    }).listen(8976);

    env(
      "http://localhost:8976/",
      (err, window) => {
        t.ifError(err);
        t.equal(serializeDocument(window.document), responseText);
        t.equal(window.location.href, "http://localhost:8976/");
        t.equal(window.location.origin, "http://localhost:8976");
        testCase.done();
      }
    );
  });

  it("string, parseable as a URL, invalid", { async: true, skipIfBrowser: true }, testCase => {
    env(
      "http://localhost:8976",
      (err, window) => {
        t.ok(err, "an error should exist");
        t.strictEqual(window, undefined, "window should not exist");
        testCase.done();
      }
    );
  });

  it("string, for an existing filename", { async: true, skipIfBrowser: true }, testCase => {
    const fileName = path.resolve(__dirname, "files/env.html");

    env(
      fileName,
      (err, window) => {
        t.ifError(err);
        t.equal(serializeDocument(window.document), `<!DOCTYPE html><html><head>
    <title>hello, Node.js!</title>
  </head>
  <body>\n  \n\n</body></html>`);
        t.equal(window.location.href, toFileUrl(fileName));
        testCase.done();
      }
    );
  });

  it("string, does not exist as a file", { async: true, skipIfBrowser: true }, testCase => {
    const body = "__DOES_NOT_EXIST__";

    env(
      body,
      (err, window) => {
        t.ifError(err);
        t.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
        testCase.done();
      }
    );
  });

  it("string, full HTML document", { async: true }, testCase => {
    env(
      "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      (err, window) => {
        t.ifError(err);
        t.equal(serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        testCase.done();
      }
    );
  });

  it("string, HTML content with a null byte", { async: true }, testCase => {
    env(
      "<div>\0</div>",
      (err, window) => {
        t.ifError(err);
        t.ok(window.document.querySelector("div") !== null, "div was parsed");
        testCase.done();
      }
    );
  });

  it("with a nonexistant script", { async: true, skipIfBrowser: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
      scripts: ["path/to/invalid.js", "another/invalid.js"],
      done(err, window) {
        t.equal(err, null);
        t.ok(window.location.href);
        testCase.done();
      }
    });
  });

  it("with src", { async: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
      src: "window.attachedHere = 123;",
      done(err, window) {
        t.ifError(err);
        t.ok(window.location.href);
        t.equal(window.attachedHere, 123);
        t.equal(window.document.getElementsByTagName("p").item(0).innerHTML, "hello world!");
        testCase.done();
      }
    });
  });

  it("with document referrer", { async: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
      document: { referrer: "https://github.com/tmpvar/jsdom" },
      done(err, window) {
        t.ifError(err);
        t.equal(window.document.referrer, "https://github.com/tmpvar/jsdom");
        testCase.done();
      }
    });
  });

  it("with document cookie", { async: true, skipIfBrowser: true }, testCase => {
    const cookie = "key=value";
    const time = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const setcookie = cookie + "; expires=" + time.toGMTString() + "; path=/";
    const routes = {
      "/js": "",
      "/html": "<!DOCTYPE html><html><head><script src=\"/js\"></script></head><body></body></html>"
    };
    const server = http.createServer((req, res) => {
      if (req.url === "/js") {
        t.equal(req.headers.cookie, cookie);
      }

      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    });

    server.listen(63999, "127.0.0.1", () => {
      env({
        url: "http://127.0.0.1:63999/html",
        document: { cookie: setcookie },
        done(err, window) {
          server.close();
          t.ifError(err);
          t.equal(window.document.cookie, cookie);
          testCase.done();
        },
        features: {
          FetchExternalResources: ["script"]
        }
      });
    });
  });

  it("with scripts and content retrieved from URLs", { async: true, skipIfBrowser: true }, testCase => {
    const routes = {
      "/js": "window.attachedHere = 123;",
      "/html": "<a href='/path/to/hello'>World</a>"
    };

    const server = http.createServer((req, res) => {
      res.writeHead(200, { "Content-Length": routes[req.url].length });
      res.end(routes[req.url]);
    });

    server.listen(64000, "127.0.0.1", () => {
      env({
        url: "http://127.0.0.1:64000/html",
        scripts: "http://127.0.0.1:64000/js",
        done(err, window) {
          server.close();

          t.ifError(err);
          t.equal(window.location.href, "http://127.0.0.1:64000/html");
          t.equal(window.location.origin, "http://127.0.0.1:64000");
          t.equal(window.attachedHere, 123);
          t.equal(window.document.getElementsByTagName("a").item(0).innerHTML, "World");
          testCase.done();
        }
      });
    });
  });

  it("should call callbacks correctly", { async: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head><script>window.isExecuted = true;" +
            "window.wasCreatedSet = window.isCreated;</script></head><body></body></html>",
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      },
      created(err, window) {
        t.ifError(err);

        t.notEqual(window.isExecuted, true);
        t.strictEqual(window.wasCreatedSet, undefined);
        window.isCreated = true;
      },
      onload(window) {
        t.strictEqual(window.isCreated, true);
        t.strictEqual(window.isExecuted, true);
        t.strictEqual(window.wasCreatedSet, true);
      },
      done(err, window) {
        t.ifError(err);

        t.strictEqual(window.isCreated, true);
        t.strictEqual(window.isExecuted, true);
        t.strictEqual(window.wasCreatedSet, true);

        testCase.done();
      }
    });
  });

  it("with configurable resource loader", { async: true }, testCase => {
    env({
      html: "<!DOCTYPE html><html><head><script src='foo.js'></script></head><body></body></html>",
      resourceLoader(resource, callback) {
        callback(null, "window.resourceLoaderWasOverridden = true;");
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      },
      done(err, window) {
        t.ifError(err);
        t.strictEqual(window.resourceLoaderWasOverridden, true);
        testCase.done();
      }
    });
  });

  it("with configurable resource loader and iframe", { async: true }, testCase => {
    const routes = {
      "/iframe.html": "<html><head><script src='foo.js'></script></head><body></body></html>",
      "/foo.js": "window.resourceLoaderWasOverridden = true;"
    };

    env({
      html: "<html><head></head><body><iframe id='bar' src='http://localhost/iframe.html'></iframe></body></html>",
      resourceLoader(resource, callback) {
        const response = routes[resource.url.path];
        t.ok(response, `Not found: ${resource.url.path}`);
        callback(null, response);
      },
      features: {
        FetchExternalResources: ["script", "iframe"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      },
      done(err, window) {
        t.ifError(err);
        t.strictEqual(window.frames.bar.resourceLoaderWasOverridden, true);
        testCase.done();
      }
    });
  });

  it("with configurable resource loader modifying routes and content",
    { async: true, skipIfBrowser: true },
    testCase => {
      const routes = {
        "/js/dir/test.js": "window.modifiedRoute = true;",
        "/html": "<!DOCTYPE html><html><head><script src='./test.js'></script></head><body></body></html>"
      };

      const server = http.createServer((req, res) => {
        res.writeHead(200, { "Content-Length": routes[req.url].length });
        res.end(routes[req.url]);
      });

      const time = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const cookie = "key=value; expires=" + time.toGMTString() + "; path=/";

      server.listen(64001, "127.0.0.1", () => {
        env({
          document: { cookie },
          url: "http://127.0.0.1:64001/html",
          resourceLoader(resource, callback) {
            t.ok(typeof resource === "object");
            t.ok(typeof resource.url === "object");
            t.equal(resource.cookie, "key=value");
            t.equal(resource.baseUrl, "http://127.0.0.1:64001/html");
            t.ok(typeof resource.defaultFetch === "function");
            t.ok(typeof callback === "function");
            if (/\.js$/.test(resource.url.path)) {
              resource.url.path = "/js/dir" + resource.url.path;
              resource.defaultFetch((err, body) => {
                if (err) {
                  callback(err);
                } else {
                  callback(null, body + "\nwindow.modifiedContent = true;");
                }
              });
            } else {
              resource.defaultFetch(callback);
            }
          },
          done(err, window) {
            server.close();
            t.ifError(err);
            t.ok(window.modifiedRoute);
            t.ok(window.modifiedContent);
            testCase.done();
          },
          features: {
            FetchExternalResources: ["script"],
            ProcessExternalResources: ["script"],
            SkipExternalResources: false
          }
        });
      });
    });

  it("script loading errors show up as jsdomErrors in the virtual console",
    { async: true, skipIfBrowser: true },
    testCase => {
      const virtualConsole = createVirtualConsole();
      virtualConsole.on("jsdomError", error => {
        t.ok(error instanceof Error);
        t.equal(error.message, `Could not load script: "http://localhost:12345/script.js"`);
        t.ok(error.detail);
      });

      env({
        html: "",
        scripts: ["http://localhost:12345/script.js"],
        virtualConsole,
        done(err, window) {
          t.equal(err, null);
          t.ok(window);
          testCase.done();
        }
      });
    });

  it("done should be called only once, after all src scripts have executed", { async: true }, testCase => {
    const script = "window.a = (typeof window.a !== 'undefined') ? window.a + 1 : 0;";
    let doneCounter = 0;

    env({
      html: "<div></div>",
      src: [script, script, script],
      ProcessExternalResources: ["script"],
      done(err, window) {
        t.ifError(err);

        ++doneCounter;

        t.strictEqual(window.a, 2);
        t.strictEqual(doneCounter, 1);
        testCase.done();
      }
    });
  });

  it("window instances should be initialized when provided to callbacks", { async: true }, testCase => {
    env({
      html: "<div></div>",
      features: {
        ProcessExternalResources: ["script"]
      },
      created(err, window) {
        t.ifError(err);
        t.notEqual(window.Array, undefined);
      },
      onload(window) {
        t.notEqual(window.Array, undefined);
      },
      done(err, window) {
        t.ifError(err);
        t.notEqual(window.Array, undefined);
        testCase.done();
      }
    });
  });

  it("window instances provided to callbacks always refer to the same object", { async: true }, testCase => {
    const instances = [];

    function finish() {
      for (let i = 0; i < instances.length; ++i) {
        for (let j = 0; j < i; ++j) {
          t.strictEqual(instances[i], instances[j], `instances ${i} and ${j} should be equal`);
        }
      }
      testCase.done();
    }

    env({
      html: "<div></div>",
      features: {
        ProcessExternalResources: ["script"]
      },
      created(err, window) {
        t.ifError(err);
        instances.push(window);
      },
      onload(window) {
        instances.push(window);
      },
      done(err, window) {
        t.ifError(err);
        instances.push(window);
        finish();
      }
    });
  });
});
