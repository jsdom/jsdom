"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;
const before = require("mocha-sugar-free").before;
const after = require("mocha-sugar-free").after;

const fs = require("fs");
const path = require("path");
const http = require("http");
const portfinder = require("portfinder");
const jsdom = require("../..");

describe("jsdom/encoding", { skipIfBrowser: true }, () => {
  let server;
  let testHost;

  before(() => {
    return new Promise((done, rej) => {
      portfinder.getPort((err, port) => {
        if (err) {
          return rej(err);
        }

        server = http.createServer((req, res) => {
          switch (req.url) {
            case "/utf8":
              res.writeHead(200, { "Content-Type": "text/plain;charset=UTF-8" });
              fs.createReadStream(__dirname + "/files/encoding/utf8.html").pipe(res);
              break;
            case "/iso88591":
              res.writeHead(200, { "Content-Type": "text/plain;charset=ISO-8859-1" });
              fs.createReadStream(__dirname + "/files/encoding/iso88591.html").pipe(res);
              break;
            case "/utf16be":
              res.writeHead(200, { "Content-Type": "text/plain;charset=UTF-16BE" });
              fs.createReadStream(__dirname + "/files/encoding/utf16be.html").pipe(res);
              break;
            case "/utf16le":
              res.writeHead(200, { "Content-Type": "text/plain;charset=UTF-16LE" });
              fs.createReadStream(__dirname + "/files/encoding/utf16le.html").pipe(res);
              break;
            case "/script-utf8.js":
              res.writeHead(200);
              fs.createReadStream(__dirname + "/files/encoding/script-utf8.js").pipe(res);
              break;
            case "/script-iso88591.js":
              res.writeHead(200);
              fs.createReadStream(__dirname + "/files/encoding/script-iso88591.js").pipe(res);
              break;
            case "/bom-utf8":
              res.writeHead(200, { "Content-Type": "text/plain;charset=ISO-8859-1" });
              res.write(new Buffer([0xEF, 0xBB, 0xBF]));
              fs.createReadStream(__dirname + "/files/encoding/utf8.html").pipe(res);
              break;
            case "/bom-utf16be":
              res.writeHead(200, { "Content-Type": "text/plain;charset=ISO-8859-1" });
              res.write(new Buffer([0xFE, 0xFF]));
              fs.createReadStream(__dirname + "/files/encoding/utf16be.html").pipe(res);
              break;
            case "/bom-utf16le":
              res.writeHead(200, { "Content-Type": "text/plain;charset=ISO-8859-1" });
              res.write(new Buffer([0xFF, 0xFE]));
              fs.createReadStream(__dirname + "/files/encoding/utf16le.html").pipe(res);
              break;
            case "/meta-content-type-charset":
              res.writeHead(200, { "Content-Type": "text/plain;charset=ISO-8859-8" });
              res.end(`<!DOCTYPE html>
              <html>
                  <head>
                      <meta charset="ISO-8859-5">
                  </head>
                  <body></body>
              </html>`);
              break;
            case "/meta-content-type-charset-bom":
              res.writeHead(200, { "Content-Type": "text/plain;charset=ISO-8859-8" });
              res.write(new Buffer([0xEF, 0xBB, 0xBF]));
              res.end(`<!DOCTYPE html>
              <html>
                  <head>
                      <meta charset="ISO-8859-5">
                  </head>
                  <body></body>
              </html>`);
              break;
          }
        });

        server.listen(port, () => done());
        testHost = "http://127.0.0.1:" + port;
      });
    });
  });

  after(() => {
    return new Promise((done, rej) => {
      server.close();
      done();
    });
  });

  specify("UTF-8", { async: true }, t => {
    jsdom.env({
      url: testHost + "/utf8",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "UTF-8", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("ISO-8859-1", { async: true }, t => {
    jsdom.env({
      url: testHost + "/iso88591",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "windows-1252", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("UTF-16BE", { async: true }, t => {
    jsdom.env({
      url: testHost + "/utf16be",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "UTF-16BE", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("UTF-16LE", { async: true }, t => {
    jsdom.env({
      url: testHost + "/utf16le",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "UTF-16LE", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("BOM UTF-8", { async: true }, t => {
    jsdom.env({
      url: testHost + "/bom-utf8",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "UTF-8", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("BOM UTF-16BE", { async: true }, t => {
    jsdom.env({
      url: testHost + "/bom-utf16be",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "UTF-16BE", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("BOM UTF-16LE", { async: true }, t => {
    jsdom.env({
      url: testHost + "/bom-utf16le",
      done(err, window) {
        assert.ifError(err);

        assert.equal(window.document.characterSet, "UTF-16LE", "document.characterSet");
        assert.equal(window.document.body.textContent.trim(), "©");
        assert.equal(window.testutf8, "©");
        assert.equal(window.testiso88591, "©");

        t.done();
      },
      features: {
        FetchExternalResources: ["script"],
        ProcessExternalResources: ["script"]
      }
    });
  });

  specify("content-type with charset + meta", { async: true }, t => {
    jsdom.env({
      url: testHost + "/meta-content-type-charset",
      done(err, window) {
        assert.ifError(err);
        assert.equal(window.document.characterSet, "ISO-8859-8", "document.characterSet");
        t.done();
      }
    });
  });

  specify("bom + content-type with charset + meta", { async: true }, t => {
    jsdom.env({
      url: testHost + "/meta-content-type-charset-bom",
      done(err, window) {
        assert.ifError(err);
        assert.equal(window.document.characterSet, "UTF-8", "document.characterSet");
        t.done();
      }
    });
  });
});
