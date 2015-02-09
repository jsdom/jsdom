"use strict";

var env = require("../..").env;
var path = require("path");
var http = require("http");
var toFileUrl = require("../util").toFileUrl(__dirname);

var serializeDocument = require("../..").serializeDocument;

exports["with invalid arguments"] = function (t) {
  t.throws(function () { env(); });
  t.throws(function () { env({}); });
  t.throws(function () { env({ html: "abc123" }); });
  t.throws(function () { env({ done: function () {} }); });
  t.done();
};

exports["explicit config.html, full document"] = function (t) {
  env({
    html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    url: "http://example.com/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document),
        "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.equal(window.location.origin, "http://example.com");
      t.done();
    }
  });
};

exports["explicit config.html, with overriden config.url"] = function (t) {
  env({
    html: "Hello",
    url: "http://example.com/",
    done: function (err, window) {
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

exports["explicit config.html, with overriden config.url including hash"] = function (t) {
  env({
    html: "Hello",
    url: "http://example.com/#foo",
    done: function (err, window) {
      t.ifError(err);
      t.equal(window.location.hash, "#foo");
      t.done();
    }
  });
};

exports["explicit config.html, with overriden config.url including search and hash"] = function (t) {
  env({
    html: "Hello",
    url: "http://example.com/?foo=bar#baz",
    done: function (err, window) {
      t.ifError(err);
      t.equal(window.location.search, "?foo=bar");
      t.equal(window.location.hash, "#baz");
      t.done();
    }
  });
};

exports["explicit config.html, without a config.url"] = function (t) {
  env({
    html: "<html><head></head><body><p>hello world!</p></body></html>",
    done: function (err, window) {
      t.ifError(err);
      t.notEqual(window.location.href, null);
      t.done();
    }
  });
};

exports["explicit config.html, with poorly formatted HTML"] = function (t) {
  env({
    html: "some poorly<div>formed<b>html</div> fragment",
    done: function (err, window) {
      t.ifError(err);
      t.notEqual(window.location.href, null);
      t.done();
    }
  });
};

exports["explicit config.html, a string that is also a valid URL"] = function (t) {
  env({
    html: "http://example.com/",
    url: "http://example.com/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<html><head></head><body>http://example.com/</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.done();
    }
  });
};

exports["explicit config.html, a string that is also a valid file"] = function (t) {
  var body = path.resolve(__dirname, "files/env.html");
  env({
    html: body,
    url: "http://example.com/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.done();
    }
  });
};

exports["explicit config.html, an empty string"] = function (t) {
  env({
    html: "",
    created: function () {
      t.done();
    }
  });
};

exports["explicit config.url, valid"] = function (t) {
  var html = "<html><head><title>Example URL</title></head><body>Example!</body></html>";
  var responseText = "<!DOCTYPE html>" + html;

  var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": responseText.length });
    res.end(responseText);
    server.close();
  }).listen(8976);

  env({
    url: "http://localhost:8976/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), responseText);
      t.equal(window.location.href, "http://localhost:8976/");
      t.equal(window.location.origin, "http://localhost:8976");
      t.done();
    }
  });
};

exports["explicit config.url, invalid"] = function (t) {
  env({
    url: "http://localhost:8976",
    done: function (err, window) {
      t.ok(err, "an error should exist");
      t.strictEqual(window, undefined, "window should not exist");
      t.done();
    }
  });
};

exports["explicit config.file, valid"] = function (t) {
  var fileName = path.resolve(__dirname, "files/env.html");

  env({
    file: fileName,
    done: function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<!DOCTYPE html><html><head>\n\
    <title>hello, Node.js!</title>\n\
  </head>\n\
  <body>\n\
  \n\
\n\
</body></html>");
      t.equal(window.location.href, toFileUrl(fileName));
      t.done();
    }
  });
};

exports["explicit config.file, invalid"] = function (t) {
  env({
    file: "__DOES_NOT_EXIST__",
    done: function (err, window) {
      t.ok(err, "an error should exist");
      t.strictEqual(window, undefined, "window should not exist");
      t.done();
    }
  });
};

exports["explicit config.file, with a script"] = function (t) {
  env({
    file: path.resolve(__dirname, "files/env.html"),
    scripts: [path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.2.js")],
    done: function (err, window) {
      t.ifError(err);

      var $ = window.jQuery;
      var text = "Let's Rock!";

      $("body").text(text);

      t.equal($("body").text(), text);
      t.done();
    }
  });
};

exports["explicit config.file, with spaces in the file name"] = function (t) {
  var fileName = path.resolve(__dirname, "files/folder space/space.html");

  env({
    file: fileName,
    done: function (err) {
      t.ifError(err);
      t.done();
    }
  });
};

exports["string, parseable as a URL, valid"] = function (t) {
  var html = "<html><head><title>Example URL</title></head><body>Example!</body></html>";
  var responseText = "<!DOCTYPE html>" + html;

  var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": responseText.length });
    res.end(responseText);
    server.close();
  }).listen(8976);

  env(
    "http://localhost:8976/",
    function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), responseText);
      t.equal(window.location.href, "http://localhost:8976/");
      t.equal(window.location.origin, "http://localhost:8976");
      t.done();
    }
  );
};

exports["string, parseable as a URL, invalid"] = function (t) {
  env(
    "http://localhost:8976",
    function (err, window) {
      t.ok(err, "an error should exist");
      t.strictEqual(window, undefined, "window should not exist");
      t.done();
    }
  );
};

exports["string, for an existing filename"] = function (t) {
  var fileName = path.resolve(__dirname, "files/env.html");

  env(
    fileName,
    function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<!DOCTYPE html><html><head>\n\
    <title>hello, Node.js!</title>\n\
  </head>\n\
  <body>\n\
  \n\
\n\
</body></html>");
      t.equal(window.location.href, toFileUrl(fileName));
      t.done();
    }
  );
};

exports["string, does not exist as a file"] = function (t) {
  var body = "__DOES_NOT_EXIST__";

  env(
    body,
    function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document), "<html><head></head><body>" + body + "</body></html>");
      t.done();
    }
  );
};

exports["string, full HTML document"] = function (t) {
  env(
    "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    function (err, window) {
      t.ifError(err);
      t.equal(serializeDocument(window.document),
        "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>");
      t.done();
    }
  );
};

exports["string, HTML content with a null byte"] = function (t) {
  env(
    "<div>\0</div>",
    function (errors, window) {
      t.ifError(errors);
      t.ok(window.document.querySelector("div") !== null, "div was parsed");
      t.done();
    }
  );
};

exports["with a nonexistant script"] = function (t) {
  env({
    html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
    scripts: ["path/to/invalid.js", "another/invalid.js"],
    done: function (err, window) {
      t.ok(err);
      t.equal(err.length, 2);
      t.ok(window.location.href);
      t.done();
    }
  });
};

exports["with src"] = function (t) {
  env({
    html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
    src: "window.attachedHere = 123;",
    done: function (err, window) {
      t.ifError(err);
      t.ok(window.location.href);
      t.equal(window.attachedHere, 123);
      t.equal(window.document.getElementsByTagName("p").item(0).innerHTML, "hello world!");
      t.done();
    }
  });
};

exports["with document referrer"] = function (t) {
  env({
    html: "<!DOCTYPE html><html><head></head><body><p>hello world!</p></body></html>",
    document: { referrer: "https://github.com/tmpvar/jsdom" },
    done: function (err, window) {
      t.ifError(err);
      t.equal(window.document.referrer, "https://github.com/tmpvar/jsdom");
      t.done();
    }
  });
};

exports["with document cookie"] = function (t) {
  t.expect(3);
  var cookie = "key=value";
  var time = new Date(Date.now() + 24 * 60 * 60 * 1000);
  var setcookie = cookie + "; expires=" + time.toGMTString() + "; path=/";
  var routes = {
    "/js": "",
    "/html": "<!DOCTYPE html><html><head><script src=\"/js\"></script></head><body></body></html>"
  };
  var server = http.createServer(function (req, res) {
    if (req.url === "/js") { t.equal(req.headers.cookie, cookie); }
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  });

  server.listen(63999, "127.0.0.1", function () {
    env({
      url: "http://127.0.0.1:63999/html",
      document: { cookie: setcookie },
      done: function (err, window) {
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

exports["with scripts and content retrieved from URLs"] = function (t) {
  var routes = {
    "/js": "window.attachedHere = 123;",
    "/html": "<a href='/path/to/hello'>World</a>"
  };

  var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  });

  server.listen(64000, "127.0.0.1", function () {
    env({
      url: "http://127.0.0.1:64000/html",
      scripts: "http://127.0.0.1:64000/js",
      done: function (err, window) {
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


exports["should call callbacks correctly"] = function (t) {
  t.expect(11);

  env({
    html: "<!DOCTYPE html><html><head><script>window.isExecuted = true;" +
          "window.wasCreatedSet = window.isCreated;</script></head><body></body></html>",
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources: ["script"],
      SkipExternalResources: false
    },
    created: function (err, window) {
      t.ifError(err);

      t.notEqual(window.isExecuted, true);
      t.strictEqual(window.wasCreatedSet, undefined);
      window.isCreated = true;
    },
    loaded: function (err, window) {
      t.ifError(err);

      t.strictEqual(window.isCreated, true);
      t.strictEqual(window.isExecuted, true);
      t.strictEqual(window.wasCreatedSet, true);
    },
    done: function (err, window) {
      t.ifError(err);

      t.strictEqual(window.isCreated, true);
      t.strictEqual(window.isExecuted, true);
      t.strictEqual(window.wasCreatedSet, true);

      t.done();
    }
  });
};

exports["with configurable resource loader"] = function (t) {
  t.expect(2);

  env({
    html: "<!DOCTYPE html><html><head><script src='foo.js'></script></head><body></body></html>",
    resourceLoader: function(resource, callback) {
      callback(null, "window.resourceLoaderWasOverriden = true;");
    },
    features: {
      FetchExternalResources: ["script"],
      ProcessExternalResources: ["script"],
      SkipExternalResources: false
    },
    done: function (err, window) {
      t.ifError(err);
      t.strictEqual(window.resourceLoaderWasOverriden, true);
      t.done();
    }
  });
};

exports["with configurable resource loader modifying routes and content"] = function (t) {
  var routes = {
    "/js/dir/test.js": "window.modifiedRoute = true;",
    "/html": "<!DOCTYPE html><html><head><script src='./test.js'></script></head><body></body></html>"
  };

  var server = http.createServer(function (req, res) {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  });

  var time = new Date(Date.now() + 24 * 60 * 60 * 1000);
  var cookie = "key=value; expires=" + time.toGMTString() + "; path=/";

  server.listen(64001, "127.0.0.1", function () {
    env({
      document: {
        cookie: cookie
      },
      url: "http://127.0.0.1:64001/html",
      resourceLoader: function(resource, callback) {
        t.ok(typeof resource === "object");
        t.ok(typeof resource.url === "object");
        t.equal(resource.cookie, "key=value");
        t.equal(resource.cookieDomain, "127.0.0.1");
        t.equal(resource.baseUrl, "http://127.0.0.1:64001/html");
        t.ok(typeof resource.defaultFetch === "function");
        t.ok(typeof callback === "function");
        if (/\.js$/.test(resource.url.pathname)) {
          resource.url.pathname = "/js/dir" + resource.url.pathname;
          resource.defaultFetch(function(err, body) {
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
      done: function (err, window) {
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
