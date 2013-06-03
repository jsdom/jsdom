"use strict";

var env = require("../..").env;
var path = require("path");
var http = require("http");
var fs = require("fs");
var toFileUrl = require("../util").toFileUrl(__dirname);

exports["explicit config.html, full document"] = function (t) {
  env({
    html: "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    url: "http://example.com/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(window.document.innerHTML, "<html><head><title>Hi</title></head><body>Hello</body></html>");
      t.equal(window.location.href, "http://example.com/");
      t.done();
    }
  });
};

exports["explicit config.html, just a string"] = function (t) {
  env({
    html: "Hello",
    url: "http://example.com/",
    done: function (err, window) {
      t.ifError(err);
      t.equal(window.document.innerHTML, "<html><body>Hello</body></html>");
      t.equal(window.location.href, "http://example.com/");
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
      t.equal(window.document.innerHTML, "<html><body>http://example.com/</body></html>");
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
      t.equal(window.document.innerHTML, "<html><body>" + body + "</body></html>");
      t.equal(window.location.href, "http://example.com/");
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
      t.equal(window.document.innerHTML, html);
      t.equal(window.location.href, "http://localhost:8976/");
      t.done();
    }
  });
};

exports["explicit config.url, invalid"] = function (t) {
  env({
    url: "http://localhost:8976",
    done: function (err, window) {
      t.ok(err, 'an error should exist');
      t.strictEqual(window, undefined, 'window should not exist');
      t.done();
    }
  });
};

exports["explicit config.file, valid"] = function (t) {
  var fileName = path.resolve(__dirname, "files/env.html");

  fs.readFile(fileName, 'utf-8', function (err, text) {
    t.ifError(err);
    env({
      file: fileName,
      done: function (err, window) {
        t.ifError(err);
        t.equal(window.document.doctype + window.document.innerHTML, text);
        t.equal(window.location.href, toFileUrl(fileName));
        t.done();
      }
    });
  });
};

exports["explicit config.file, invalid"] = function (t) {
  env({
    file: "__DOES_NOT_EXIST__",
    done: function (err, window) {
      t.ok(err, 'an error should exist');
      t.strictEqual(window, undefined, 'window should not exist');
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
      t.equal(window.document.innerHTML, html);
      t.equal(window.location.href, "http://localhost:8976/");
      t.done();
    }
  );
};

exports["string, parseable as a URL, invalid"] = function (t) {
  env(
    "http://localhost:8976",
    function (err, window) {
      t.ok(err, 'an error should exist');
      t.strictEqual(window, undefined, 'window should not exist');
      t.done();
    }
  );
};

exports["string, for an existing filename"] = function (t) {
  var fileName = path.resolve(__dirname, "files/env.html");

  fs.readFile(fileName, 'utf-8', function (err, text) {
    t.ifError(err);
    env(
      fileName,
      function (err, window) {
        t.ifError(err);
        t.equal(window.document.doctype + window.document.innerHTML, text);
        t.equal(window.location.href, toFileUrl(fileName));
        t.done();
      }
    );
  });
};

exports["string, does not exist as a file"] = function (t) {
  var body = "__DOES_NOT_EXIST__";

  env(
    body,
    function (err, window) {
      t.ifError(err);
      t.equal(window.document.innerHTML, "<html><body>" + body + "</body></html>");
      t.done();
    }
  );
};

exports["string, full HTML document"] = function (t) {
  env(
    "<!DOCTYPE html><html><head><title>Hi</title></head><body>Hello</body></html>",
    function (err, window) {
      t.ifError(err);
      t.equal(window.document.innerHTML, "<html><head><title>Hi</title></head><body>Hello</body></html>");
      t.done();
    }
  );
};
