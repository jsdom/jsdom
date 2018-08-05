"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");
const { createServer } = require("../util.js");

const { JSDOM } = require("../..");
const { URL } = require("whatwg-url");
const path = require("path");

const jQueryFile = path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.4.min.js");

describe("jsonp/jsonp", () => {
  specify("making a JSONP request from a jsdom window using jQuery", { skipIfBrowser: true }, () => {
    return createServer((req, res) => {
      const url = new URL("http://example.com" + req.url);

      res.writeHead(200);
      res.write(url.searchParams.get("jsoncallback") + `({"message":"jsonp works!"});`);
      res.end();
    }).then(s => {
      const host = `http://127.0.0.1:${s.address().port}`;
      const options = { resources: "usable", runScripts: "dangerously" };
      const { window } = new JSDOM(`<script src="file://${jQueryFile}"></script>`, options);

      return new Promise(resolve => {
        window.onload = () => {
          window.jQuery.getJSON(host + "?jsoncallback=?", data => {
            assert.equal(data.message, "jsonp works!");
            s.close();
            resolve();
          });
        };
      });
    });
  });
});
