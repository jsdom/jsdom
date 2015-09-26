"use strict";
const jsdom = require("../..");
const URL = require("whatwg-url-compat").createURLConstructor();
const path = require("path");
const http = require("http");
const querystring = require("querystring");

const jQueryFile = path.resolve(__dirname, "../jquery-fixtures/jquery-1.6.4.min.js");

exports["making a JSONP request from a jsdom window using jQuery"] = t => {
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
        t.ifError(err);

        window.jQuery.getJSON("http://localhost:43213?jsoncallback=?", data => {
          t.equal(data.message, "jsonp works!");
          server.close();
          t.done();
        });
      }
    });
  });
};
