"use strict";

const env = require("../..").env;
const createVirtualConsole = require("../..").createVirtualConsole;
const serializeDocument = require("../..").serializeDocument;
const path = require("path");
const http = require("http");
const toFileUrl = require("../util").toFileUrl(__dirname);

exports["with invalid arguments"] = t => {
  t.throws(() => env());
  t.throws(() => env({}));
  t.throws(() => env({ html: "abc123" }));
  t.throws(() => env({ done() {} }));
  t.done();
};

exports["explicit config.html, full document"] = t => {
  env({
    html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    url: "http://example.com/",
    done(err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document),
        "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.equal(window.location.origin, "http://example.com");
      t.done();
    }
  });
};

exports["explicit config.html, with overriden config.url"] = t => {
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
      t.done();
    }
  });
};

exports["explicit config.html, with overriden config.url including hash"] = t => {
  env({
    html: "Hello",
    url: "http://example.com/#foo",
    done(err, window) {
      t.ifError(err);
      t.equal(window.location.hash, "#foo");
      t.done();
    }
  });
};

exports["explicit config.html, with overriden config.url including search and hash"] = t => {
  env({
    html: "Hello",
    url: "http://example.com/?foo=bar#baz",
    done(err, window) {
      t.ifError(err);
      t.equal(window.location.search, "?foo=bar");
      t.equal(window.location.hash, "#baz");
      t.done();
    }
  });
};

exports["explicit config.html, without a config.url"] = t => {
  env({
    html: "<html><head></head><body><p>hello world!</p></body></html>",
    done(err, window) {
      t.ifError(err);
      t.notEqual(window.location.href, null);
      t.done();
    }
  });
};

exports["explicit config.html, with poorly formatted HTML"] = t => {
  env({
    html: "some poorly<div>formed<b>html</div> fragment",
    done(err, window) {
      t.ifError(err);
      t.notEqual(window.location.href, null);
      t.done();
    }
  });
};

exports["explicit config.html, a string that is also a valid URL"] = t => {
  env({
    html: "http://example.com/",
    url: "http://example.com/",
    done(err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<html><head></head><body>http://example.com/</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.done();
    }
  });
};

exports["explicit config.html, a string that is also a valid file"] = t => {
  const body = path.resolve(__dirname, "files/env.html");
  env({
    html: body,
    url: "http://example.com/",
    done(err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.done();
    }
  });
};

exports["explicit config.html, an empty string"] = t => {
  env({
    html: "",
    created() {
      t.done();
    }
  });
};

exports["explicit config.url, valid"] = t => {
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
      t.done();
    }
  });
};

exports["explicit config.url, invalid"] = t => {
  env({
    url: "http://localhost:8976",
    done(err, window) {
      t.ok(err, "an error should exist");
      t.strictEqual(window, undefined, "window should not exist");
      t.done();
    }
  });
};

exports["explicit config.file, valid"] = t => {
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
      t.done();
    }
  });
};

exports["explicit config.file, invalid"] = t => {
  env({
    file: "__DOES_NOT_EXIST__",
    done(err, window) {
      t.ok(err, "an error should exist");
      t.strictEqual(window, undefined, "window should not exist");
      t.done();
    }
  });
};

exports["explicit config.file, with a script"] = t => {
  env({
    file: path.resolve(__dirname, "files/env.html"),
    scripts: [path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.2.js")],
    done(err, window) {
      t.ifError(err);

      const $ = window.jQuery;
      const text = "Let's Rock!";

      $("body").text(text);

      t.equal($("body").text(), text);
      t.done();
    }
  });
};

exports["explicit config.file, with spaces in the file name"] = t => {
  const fileName = path.resolve(__dirname, "files/folder space/space.html");

  env({
    file: fileName,
    done(err) {
      t.ifError(err);
      t.done();
    }
  });
};

exports["string, parseable as a URL, valid"] = t => {
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
      t.done();
    }
  );
};

exports["string, parseable as a URL, invalid"] = t => {
  env(
    "http://localhost:8976",
    (err, window) => {
      t.ok(err, "an error should exist");
      t.strictEqual(window, undefined, "window should not exist");
      t.done();
    }
  );
};

exports["string, for an existing filename"] = t => {
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
      t.done();
    }
  );
};

exports["string, does not exist as a file"] = t => {
  const body = "__DOES_NOT_EXIST__";

  env(
    body,
    (err, window) => {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
      t.done();
    }
  );
};

exports["string, full HTML document"] = t => {
  env(
    "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    (err, window) => {
      t.ifError(err);
      t.equal(serializeDocument(window.document),
        "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
      t.done();
    }
  );
};

exports["string, HTML content with a null byte"] = t => {
  env(
    "<div>\0</div>",
    (err, window) => {
      t.ifError(err);
      t.ok(window.document.querySelector("div") !== null, "div was parsed");
      t.done();
    }
  );
};

exports["with a nonexistant script"] = t => {
  env({
    html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
    scripts: ["path/to/invalid.js", "another/invalid.js"],
    done(err, window) {
      t.equal(err, null);
      t.ok(window.location.href);
      t.done();
    }
  });
};

exports["with src"] = t => {
  env({
    html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
    src: "window.attachedHere = 123;",
    done(err, window) {
      t.ifError(err);
      t.ok(window.location.href);
      t.equal(window.attachedHere, 123);
      t.equal(window.document.getElementsByTagName("p").item(0).innerHTML, "hello world!");
      t.done();
    }
  });
};

exports["with document referrer"] = t => {
  env({
    html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
    document: { referrer: "https://github.com/tmpvar/jsdom" },
    done(err, window) {
      t.ifError(err);
      t.equal(window.document.referrer, "https://github.com/tmpvar/jsdom");
      t.done();
    }
  });
};

exports["with document cookie"] = t => {
  t.expect(3);
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
        t.done();
      },
      features: {
        FetchExternalResources: ["script"]
      }
    });
  });
};

exports["with scripts and content retrieved from URLs"] = t => {
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
        t.done();
      }
    });
  });
};


exports["should call callbacks correctly"] = t => {
  t.expect(10);

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

      t.done();
    }
  });
};

exports["with configurable resource loader"] = t => {
  t.expect(2);

  env({
    html: "<!DOCTYPE html><html><head><script src='foo.js'></script></head><body></body></html>",
    resourceLoader(resource, callback) {
      callback(null, "window.resourceLoaderWasOverriden = true;");
    },
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources: ["script"],
      SkipExternalResources: false
    },
    done(err, window) {
      t.ifError(err);
      t.strictEqual(window.resourceLoaderWasOverriden, true);
      t.done();
    }
  });
};

exports["with configurable resource loader modifying routes and content"] = t => {
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
        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"],
        SkipExternalResources: false
      }
    });
  });
};

exports["script loading errors show up as jsdomErrors in the virtual console"] = t => {
  t.expect(5);

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
      t.done();
    }
  });
};

exports["done should be called only once, after all src scripts have executed"] = t => {
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
      t.done();
    }
  });
};

exports["window instances should be initialized when provided to callbacks"] = t => {
  t.expect(5);

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
      t.done();
    }
  });
};

exports["window instances provided to callbacks always refer to the same object"] = t => {
  t.expect(3 + 2);

  const instances = [];

  function finish() {
    for (let i = 0; i < instances.length; ++i) {
      for (let j = 0; j < i; ++j) {
        t.strictEqual(instances[i], instances[j], `instances ${i} and ${j} should be equal`);
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
};
