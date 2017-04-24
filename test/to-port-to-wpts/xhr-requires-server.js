"use strict";
const http = require("http");
const portfinder = require("portfinder");
const jsdom = require("../../lib/old-api.js");

let testHost = null;

exports.setUp = done => {
  portfinder.getPort((err, port) => {
    if (err) {
      done(err);
      return;
    }

    http.createServer((req, res) => {
      res.writeHead(200, [["date", "0"]]);
      res.end("<body></body>");
    })
    .listen(port);

    testHost = "http://127.0.0.1:" + port;
    done();
  });
};

exports["Getting a non-file URL should not fail for getAllResponseHeaders"] = t => {
  // From https://github.com/tmpvar/jsdom/pull/1183
  const window = jsdom.jsdom(undefined, { url: testHost + "/TestPath/get-headers" }).defaultView;

  const xhr = new window.XMLHttpRequest();
  xhr.onload = () => {
    t.doesNotThrow(() => {
      t.strictEqual(xhr.getAllResponseHeaders(), "date: 0\r\nConnection: keep-alive\r\nTransfer-Encoding: chunked");
    });
    t.done();
  };

  xhr.open("GET", testHost + "/TestPath/get-headers", true);
  xhr.send();
};
