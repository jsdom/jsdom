"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");
const URL = require("whatwg-url").URL;
const path = require("path");
const http = require("http");
const querystring = require("querystring");

const jQueryFile = path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.4.min.js");

describe("jsonp/jsonp", () => {
  specify(
    "making a JSONP request from a jsdom window using jQuery",
    { async: true, skipIfBrowser: true },
    t => {
      const server = http.createServer((req, res) => {
        const url = new URL("http://example.com" + req.url);
        const query = querystring.parse(url.search.substring(1));

        res.writeHead(200);
        res.write(query.jsoncallback + `({"message":"jsonp works!"});`);
        res.end();
      });

      server.listen(43213, "127.0.0.1", () => {
        jsdom.env({
          html: "<!DOCTYPE html><html><head></head><body></body></html>",
          scripts: [jQueryFile],
          features: {
            FetchExternalResources: ["script"],
            ProcessExternalResources: ["script"]
          },
          done(err, window) {
            assert.ifError(err);

            window.jQuery.getJSON("http://localhost:43213?jsoncallback=?", data => {
              assert.equal(data.message, "jsonp works!");
              server.close();
              t.done();
            });
          }
        });
      });
    }
  );
});
