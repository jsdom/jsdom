"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");
const { createServer } = require("../util.js");
const { JSDOM } = require("../..");

describe("xhr-requires-server", { skipIfBrowser: true }, () => {
  specify("Getting a non-file URL should not fail for getAllResponseHeaders", t => {
    return createServer((req, res) => {
      res.writeHead(200, [["date", "0"]]);
      res.end("<body></body>");
    }).then(s => {
      const testHost = `http://127.0.0.1:${s.address().port}`;

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
    });
  }, {
    async: true
  });
});
