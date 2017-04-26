"use strict";
const path = require("path");
const http = require("http");
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { env, createVirtualConsole, serializeDocument } = require("../../lib/old-api.js");
const toFileUrl = require("../util.js").toFileUrl(__dirname);

describe("jsdom/env", () => {
  specify("with invalid arguments", () => {
    assert.throws(() => env());
    assert.throws(() => env({}));
    assert.throws(() => env({ html: "abc123" }));
    assert.throws(() => env({ done() { /* doesn't matter */ } }));
  });

  specify("explicit config.html, full document", { async: true }, t => {
    env({
      html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      url: "http://example.com/",
      done(err, window) {
        assert.ifError(err);
        assert.equal(serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        assert.equal(window.location.href, "http://example.com/");
        assert.equal(window.location.origin, "http://example.com");
        t.done();
      }
    });
  });

  specify("explicit config.html, with overridden config.url", { async: true }, t => {
    env({
      html: "Hello",
      url: "http://example.com/",
      done(err, window) {
        assert.ifError(err);
        assert.equal(serializeDocument(window.document), "<html><head></head><body>Hello</body></html>");
        assert.equal(window.location.href, "http://example.com/");
        assert.equal(window.location.origin, "http://example.com");
        assert.equal(window.location.search, "");
        assert.equal(window.location.hash, "");
        t.done();
      }
    });
  });

  specify("explicit config.html, with overridden config.url including hash", { async: true }, t => {
    env({
      html: "Hello",
      url: "http://example.com/#foo",
      done(err, window) {
        assert.ifError(err);
        assert.equal(window.location.hash, "#foo");
        t.done();
      }
    });
  });

  specify("explicit config.html, with overridden config.url including search and hash", { async: true }, t => {
    env({
      html: "Hello",
      url: "http://example.com/?foo=bar#baz",
      done(err, window) {
        assert.ifError(err);
        assert.equal(window.location.search, "?foo=bar");
        assert.equal(window.location.hash, "#baz");
        t.done();
      }
    });
  });

  specify("explicit config.html, without a config.url", { async: true }, t => {
    env({
      html: "<html><head></head><body><p>hello world!</p></body></html>",
      done(err, window) {
        assert.ifError(err);
        assert.notEqual(window.location.href, null);
        t.done();
      }
    });
  });

  specify("explicit config.html, with poorly formatted HTML", { async: true }, t => {
    env({
      html: "some poorly<div>formed<b>html</div> fragment",
      done(err, window) {
        assert.ifError(err);
        assert.notEqual(window.location.href, null);
        t.done();
      }
    });
  });

  specify("explicit config.html, with a relative frame URL but no document URL (GH-1277)", { async: true }, t => {
    env({
      html: `<iframe src="/ads/728x90.html"></iframe>`,
      done(err, window) {
        assert.ifError(err);

        // Unresolvable URLs (in this case a relative URL against about:blank) should create windows for about:blank.
        assert.equal(window.document.querySelector("iframe").src, "/ads/728x90.html");
        assert.equal(window.document.querySelector("iframe").contentWindow.document.URL, "about:blank");

        t.done();
      }
    });
  });

  specify("explicit config.html, a string that is also a valid URL", { async: true }, t => {
    env({
      html: "http://example.com/",
      url: "http://example.com/",
      done(err, window) {
        assert.ifError(err);
        assert.equal(serializeDocument(window.document), "<html><head></head><body>http://example.com/</body></html>");
        assert.equal(window.location.href, "http://example.com/");
        t.done();
      }
    });
  });

  specify("explicit config.html, an empty string", { async: true }, t => {
    env({
      html: "",
      created() {
        t.done();
      }
    });
  });

  specify("string, full HTML document", { async: true }, t => {
    env(
      "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
      (err, window) => {
        assert.ifError(err);
        assert.equal(serializeDocument(window.document),
          "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
        t.done();
      }
    );
  });

  specify("string, HTML content with a null byte", { async: true }, t => {
    env(
      "<div>\0</div>",
      (err, window) => {
        assert.ifError(err);
        assert.ok(window.document.querySelector("div") !== null, "div was parsed");
        t.done();
      }
    );
  });

  specify("with src", { async: true }, t => {
    env({
      html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
      src: "window.attachedHere = 123;",
      done(err, window) {
        assert.ifError(err);
        assert.ok(window.location.href);
        assert.equal(window.attachedHere, 123);
        assert.equal(window.document.getElementsByTagName("p").item(0).innerHTML, "hello world!");
        t.done();
      }
    });
  });

  specify("with document referrer", { async: true }, t => {
    env({
      html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
      document: { referrer: "https://github.com/tmpvar/jsdom" },
      done(err, window) {
        assert.ifError(err);
        assert.equal(window.document.referrer, "https://github.com/tmpvar/jsdom");
        t.done();
      }
    });
  });

  specify("should call callbacks correctly", { async: true }, t => {
    env({
      html: "<!DOCTYPE html><html><head><script>window.isExecuted = true;" +
            "window.wasCreatedSet = window.isCreated;</script></head><body></body></html>",
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      },
      created(err, window) {
        assert.ifError(err);

        assert.notEqual(window.isExecuted, true);
        assert.strictEqual(window.wasCreatedSet, undefined);
        window.isCreated = true;
      },
      onload(window) {
        assert.strictEqual(window.isCreated, true);
        assert.strictEqual(window.isExecuted, true);
        assert.strictEqual(window.wasCreatedSet, true);
      },
      done(err, window) {
        assert.ifError(err);

        assert.strictEqual(window.isCreated, true);
        assert.strictEqual(window.isExecuted, true);
        assert.strictEqual(window.wasCreatedSet, true);

        t.done();
      }
    });
  });

  specify("with configurable resource loader", { async: true }, t => {
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
        assert.ifError(err);
        assert.strictEqual(window.resourceLoaderWasOverridden, true);
        t.done();
      }
    });
  });

  specify("with configurable resource loader and iframe", { async: true }, t => {
    const routes = {
      "/iframe.html": "<html><head><script src='foo.js'></script></head><body></body></html>",
      "/foo.js": "window.resourceLoaderWasOverridden = true;"
    };

    env({
      html: "<html><head></head><body><iframe name='bar' src='http://localhost/iframe.html'></iframe></body></html>",
      resourceLoader(resource, callback) {
        const response = routes[resource.url.path];
        assert.ok(response, `Not found: ${resource.url.path}`);
        callback(null, response);
      },
      features: {
        FetchExternalResources: ["script", "iframe"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      },
      done(err, window) {
        assert.ifError(err);
        assert.strictEqual(window.frames.bar.resourceLoaderWasOverridden, true);
        t.done();
      }
    });
  });

  specify("done should be called only once, after all src scripts have executed", { async: true }, t => {
    const script = "window.a = (typeof window.a !== 'undefined') ? window.a + 1 : 0;";
    let doneCounter = 0;

    env({
      html: "<div></div>",
      src: [script, script, script],
      ProcessExternalResources: ["script"],
      done(err, window) {
        assert.ifError(err);

        ++doneCounter;

        assert.strictEqual(window.a, 2);
        assert.strictEqual(doneCounter, 1);
        t.done();
      }
    });
  });

  specify("window instances should be initialized when provided to callbacks", { async: true }, t => {
    env({
      html: "<div></div>",
      features: {
        ProcessExternalResources: ["script"]
      },
      created(err, window) {
        assert.ifError(err);
        assert.notEqual(window.Array, undefined);
      },
      onload(window) {
        assert.notEqual(window.Array, undefined);
      },
      done(err, window) {
        assert.ifError(err);
        assert.notEqual(window.Array, undefined);
        t.done();
      }
    });
  });

  specify("window instances provided to callbacks always refer to the same object", { async: true }, t => {
    const instances = [];

    function finish() {
      for (let i = 0; i < instances.length; ++i) {
        for (let j = 0; j < i; ++j) {
          assert.strictEqual(instances[i], instances[j], `instances ${i} and ${j} should be equal`);
        }
      }
      t.done();
    }

    env({
      html: "<div></div>",
      features: {
        ProcessExternalResources: ["script"]
      },
      created(err, window) {
        assert.ifError(err);
        instances.push(window);
      },
      onload(window) {
        instances.push(window);
      },
      done(err, window) {
        assert.ifError(err);
        instances.push(window);
        finish();
      }
    });
  });

  specify("explicit config.url, invalid", { async: true }, t => {
    env({
      // Use 0.0.0.0 because it will always fail, and without a timeout
      // (which would slow down the test suite)
      url: "http://0.0.0.0:8976",
      done(err, window) {
        assert.ok(err, "an error should exist");
        assert.strictEqual(window, undefined, "window should not exist");
        t.done();
      }
    });
  });

  specify("string, parseable as a URL, invalid", { async: true }, t => {
    env(
      "http://0.0.0.0:8976",
      (err, window) => {
        assert.ok(err, "an error should exist");
        assert.strictEqual(window, undefined, "window should not exist");
        t.done();
      }
    );
  });

  specify("script loading errors show up as jsdomErrors in the virtual console", { async: true }, t => {
    const virtualConsole = createVirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, `Could not load script: "http://0.0.0.0:12345/script.js"`);
      assert.ok(error.detail);
    });

    env({
      html: "",
      scripts: ["http://0.0.0.0:12345/script.js"],
      virtualConsole,
      done(err, window) {
        assert.equal(err, null);
        assert.ok(window);
        t.done();
      }
    });
  });

  describe("node specific tests", { skipIfBrowser: true }, () => {
    specify("explicit config.html, a string that is also a valid file", { async: true }, t => {
      const body = path.resolve(__dirname, "files/env.html");
      env({
        html: body,
        url: "http://example.com/",
        done(err, window) {
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
          assert.equal(window.location.href, "http://example.com/");
          t.done();
        }
      });
    });

    specify("explicit config.url, valid", { async: true }, t => {
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
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), responseText);
          assert.equal(window.location.href, "http://localhost:8976/");
          assert.equal(window.location.origin, "http://localhost:8976");
          t.done();
        }
      });
    });

    specify("explicit config.url, custom agent, valid", { async: true }, t => {
      const html = "<html><head><title>Example URL</title></head><body>Example!</body></html>";
      const responseText = "<!DOCTYPE html>" + html;

      const server = http.createServer((req, res) => {
        res.writeHead(200, { "Content-Length": responseText.length });
        res.end(responseText);
        server.close();
      }).listen(8976);

      env({
        url: "http://localhost:8976/",
        agent: new http.Agent(),
        done(err, window) {
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), responseText);
          assert.equal(window.location.href, "http://localhost:8976/");
          assert.equal(window.location.origin, "http://localhost:8976");
          t.done();
        }
      });
    });

    specify("explicit config.url, custom agentClass, valid", { async: true }, t => {
      const html = "<html><head><title>Example URL</title></head><body>Example!</body></html>";
      const responseText = "<!DOCTYPE html>" + html;

      const server = http.createServer((req, res) => {
        res.writeHead(200, { "Content-Length": responseText.length });
        res.end(responseText);
        server.close();
      }).listen(8976);

      env({
        url: "http://localhost:8976/",
        agentClass: http.Agent,
        done(err, window) {
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), responseText);
          assert.equal(window.location.href, "http://localhost:8976/");
          assert.equal(window.location.origin, "http://localhost:8976");
          t.done();
        }
      });
    });

    specify("explicit config.file, valid", { async: true }, t => {
      const fileName = path.resolve(__dirname, "files/env.html");

      env({
        file: fileName,
        done(err, window) {
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), `<!DOCTYPE html><html><head>
    <title>hello, Node.js!</title>
  </head>
  <body>\n  \n\n</body></html>`);
          assert.equal(window.location.href, toFileUrl(fileName));
          t.done();
        }
      });
    });

    specify("explicit config.file, invalid", { async: true }, t => {
      env({
        file: "__DOES_NOT_EXIST__",
        done(err, window) {
          assert.ok(err, "an error should exist");
          assert.strictEqual(window, undefined, "window should not exist");
          t.done();
        }
      });
    });

    specify("explicit config.file, with a script", { async: true }, t => {
      env({
        file: path.resolve(__dirname, "files/env.html"),
        scripts: [path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.2.js")],
        done(err, window) {
          assert.ifError(err);

          const $ = window.jQuery;
          const text = "Let's Rock!";

          $("body").text(text);

          assert.equal($("body").text(), text);
          t.done();
        }
      });
    });

    specify("explicit config.file, with spaces in the file name", { async: true }, t => {
      const fileName = path.resolve(__dirname, "files/folder space/space.html");

      env({
        file: fileName,
        done(err) {
          assert.ifError(err);
          t.done();
        }
      });
    });

    specify("string, parseable as a URL, valid", { async: true }, t => {
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
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), responseText);
          assert.equal(window.location.href, "http://localhost:8976/");
          assert.equal(window.location.origin, "http://localhost:8976");
          t.done();
        }
      );
    });

    specify("string, for an existing filename", { async: true }, t => {
      const fileName = path.resolve(__dirname, "files/env.html");

      env(
        fileName,
        (err, window) => {
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), `<!DOCTYPE html><html><head>
    <title>hello, Node.js!</title>
  </head>
  <body>\n  \n\n</body></html>`);
          assert.equal(window.location.href, toFileUrl(fileName));
          t.done();
        }
      );
    });

    specify("string, does not exist as a file", { async: true }, t => {
      const body = "__DOES_NOT_EXIST__";

      env(
        body,
        (err, window) => {
          assert.ifError(err);
          assert.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
          t.done();
        }
      );
    });

    specify("with a nonexistent script", { async: true }, t => {
      env({
        html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
        scripts: ["path/to/invalid.js", "another/invalid.js"],
        done(err, window) {
          assert.equal(err, null);
          assert.ok(window.location.href);
          t.done();
        }
      });
    });

    specify("with document cookie", { async: true }, t => {
      const cookie = "key=value";
      const time = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const setcookie = cookie + "; expires=" + time.toGMTString() + "; path=/";
      const routes = {
        "/js": "",
        "/html": "<!DOCTYPE html><html><head><script src=\"/js\"></script></head><body></body></html>"
      };
      const server = http.createServer((req, res) => {
        if (req.url === "/js") {
          assert.equal(req.headers.cookie, cookie);
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
            assert.ifError(err);
            assert.equal(window.document.cookie, cookie);
            t.done();
          },
          features: {
            FetchExternalResources: ["script"]
          }
        });
      });
    });

    specify("with scripts and content retrieved from URLs", { async: true }, t => {
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

            assert.ifError(err);
            assert.equal(window.location.href, "http://127.0.0.1:64000/html");
            assert.equal(window.location.origin, "http://127.0.0.1:64000");
            assert.equal(window.attachedHere, 123);
            assert.equal(window.document.getElementsByTagName("a").item(0).innerHTML, "World");
            t.done();
          }
        });
      });
    });

    specify("with configurable resource loader modifying routes and content",
      { async: true },
      t => {
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
              assert.ok(typeof resource === "object");
              assert.ok(typeof resource.url === "object");
              assert.equal(resource.cookie, "key=value");
              assert.equal(resource.baseUrl, "http://127.0.0.1:64001/html");
              assert.ok(typeof resource.defaultFetch === "function");
              assert.ok(typeof callback === "function");
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
              assert.ifError(err);
              assert.ok(window.modifiedRoute);
              assert.ok(window.modifiedContent);
              t.done();
            },
            features: {
              FetchExternalResources: ["script"],
              ProcessExternalResources: ["script"],
              SkipExternalResources: false
            }
          });
        });
      });
  });

  describe("browser specific tests", { skipUnlessBrowser: true }, () => {
    /* global location */
    // location is a Location or WorkerLocation
    const testServerLocation = typeof location !== "undefined" && location.origin;

    specify("should be able to fetch a html document", { async: true }, t => {
      env({
        url: testServerLocation + "/base/test/to-port-to-wpts/files/reddit.html",
        done(err, window) {
          assert.ifError(err);
          assert.strictEqual(window.document.getElementById("header-bottom-left").nodeName, "DIV");
          t.done();
        }
      });
    });
  });
});
