"use strict";
const http = require("http");

const { assert } = require("chai");
const { beforeEach, describe, specify } = require("mocha-sugar-free");
const portfinder = require("portfinder");

const { JSDOM } = require("../..");

describe("xhr-requires-server", { skipIfBrowser: true }, () => {
  let testHost = null;

  beforeEach(() => {
    return new Promise((resolve, reject) => {
      portfinder.getPort((err, port) => {
        if (err) {
          reject(err);
          return;
        }

        http.createServer((req, res) => {
          res.writeHead(200, [["date", "0"]]);
          res.end("<body></body>");
        })
          .listen(port);

        testHost = "http://127.0.0.1:" + port;
        resolve();
      });
    });
  });

  specify("Getting a non-file URL should not fail for getAllResponseHeaders", t => {
    // From https://github.com/tmpvar/jsdom/pull/1183
    const { window } = new JSDOM(``, { url: testHost + "/TestPath/get-headers" });

    const xhr = new window.XMLHttpRequest();
    xhr.onload = () => {
      assert.doesNotThrow(() => {
        assert.strictEqual(
          xhr.getAllResponseHeaders(),
          "date: 0\r\nconnection: keep-alive\r\ntransfer-encoding: chunked"
        );
      });
      t.done();
    };

    xhr.open("GET", testHost + "/TestPath/get-headers", true);
    xhr.send();
  }, {
    async: true
  });
});
