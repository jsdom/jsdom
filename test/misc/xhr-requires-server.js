"use strict";
const jsdom = require("../..");
const http = require("http");
const portfinder = require("portfinder");

let testHost = null;

exports.setUp = function (done) {
  portfinder.getPort(function (err, port) {
    http.createServer(function (req, res) {
      res.writeHead(200, [["date", "0"]]);
      res.end("<body></body>");
    })
    .listen(port);

    testHost = "http://127.0.0.1:" + port;
    done();
  });
};

exports["Getting a non-file URL should not fail for getAllResponseHeaders"] = function (t) {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: testHost + "/TestPath/get-headers" }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = function () {
    t.doesNotThrow(function () {
      t.strictEqual(xhr.getAllResponseHeaders(), "date: 0\r\nconnection: close\r\ntransfer-encoding: chunked");
    });
    t.done();
  };

  xhr.open("GET", testHost + "/TestPath/get-headers", true);
  xhr.send();
};
