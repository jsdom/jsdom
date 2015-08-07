"use strict";
const fs = require("fs");
const jsdom = require("../..");
const http = require("http");
const portfinder = require("portfinder");
const toFileUrl = require("../util").toFileUrl(__dirname);

var server = [];
var testHost = null;

exports.setUp = function (done) {
  portfinder.getPort(function (err, port) {
    server = http.createServer(function (req, res) {
      res.writeHead(200, [["date", "0"]]);
      res.end("<body></body>");
    });

    server.listen(port);
    testHost = "http://127.0.0.1:" + port;
    done();
  });
};

exports["Getting a file URL should work (from the same file URL)"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1180
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.equal(xhr.responseText, fs.readFileSync(__filename));
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a file URL should have valid response"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.equal(xhr.response, fs.readFileSync(__filename));
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a file URL should not throw for getResponseHeader"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1180
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.doesNotThrow(function () {
      t.strictEqual(xhr.getResponseHeader("Blahblahblah"), null);
    });
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a file URL should not throw for getAllResponseHeaders"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: toFileUrl(__filename) }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.doesNotThrow(function () {
      t.strictEqual(xhr.getAllResponseHeaders(), null);
    });
    t.done();
  };

  xhr.open("GET", toFileUrl(__filename), true);
  xhr.send();
};

exports["Getting a non-file URL should not fail for getAllResponseHeaders"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: testHost + "/TestPath/get-headers" }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.doesNotThrow(function () {
      t.strictEqual(xhr.getAllResponseHeaders(), "date: 0\r\nconnection: close\r\ntransfer-encoding: chunked");
    })
    t.done();
  };

  xhr.open("GET", testHost + "/TestPath/get-headers", true);
  xhr.send();
};
