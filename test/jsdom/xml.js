"use strict";

const assert = require("chai").assert;
const describe = require("mocha-sugar-free").describe;
const specify = require("mocha-sugar-free").specify;

const readTestFixture = require("../util").readTestFixture;
const http = require("http");
const path = require("path");
const jsdom = require("../..");

const xmlStringPromise = readTestFixture("jsdom/files/xml.xml");

function isParsedAsXml(document) {
  return document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim() === "";
}

describe("jsdom/xml", () => {
  specify("should not throw if no parser is given", () => {
    jsdom.jsdom("<!DOCTYPE html><html></html>");
  });

  specify("should not throw if invalid html document is given", () => {
    jsdom.jsdom("<!DOCTYPE html><html</html>");
  });

  specify("should ignore self-closing of tags in html docs", () => {
    return xmlStringPromise.then(xmlString => {
      const document = jsdom.jsdom(xmlString, { parsingMode: "html" });

      const window = document.defaultView;
      assert.ok(!isParsedAsXml(window.document));
    });
  });

  specify("should handle self-closing tags properly in xml docs (in .jsdom)", () => {
    return xmlStringPromise.then(xmlString => {
      const document = jsdom.jsdom(xmlString, { parsingMode: "xml" });

      const window = document.defaultView;
      assert.ok(isParsedAsXml(window.document));
    });
  });

  specify("should handle self-closing tags properly in xml docs (in .env)", { async: true }, t => {
    xmlStringPromise.then(xmlString => {
      jsdom.env({
        html: xmlString,
        parsingMode: "xml",
        done(err, window) {
          assert.ifError(err);
          assert.ok(isParsedAsXml(window.document));

          t.done();
        }
      });
    });
  });

  specify("parsing XML keeps tag casing (GH-393)", { async: true }, t => {
    jsdom.env({
      html: "<foo><bar/></foo>",
      parsingMode: "xml",
      done(err, window) {
        assert.ifError(err);
        const elem = window.document.getElementsByTagName("foo")[0];
        assert.strictEqual(elem.tagName, "foo");

        t.done();
      }
    });
  });

  specify("attributes are case-sensitive in XML mode (GH-651)", { async: true }, t => {
    jsdom.env({
      html: "<foo caseSensitive='abc' casesensitive='def'><bar/></foo>",
      parsingMode: "xml",
      done(err, window) {
        assert.ifError(err);
        const elem = window.document.getElementsByTagName("foo")[0];
        assert.strictEqual(elem.getAttribute("caseSensitive"), "abc");
        assert.strictEqual(elem.getAttribute("casesensitive"), "def");

        t.done();
      }
    });
  });

  specify("XML mode makes directives accessible (GH-415)", { async: true }, t => {
    jsdom.env({
      html: "<?xml-stylesheet version='1.0'?><foo caseSensitive='abc' casesensitive='def'><bar/></foo>",
      parsingMode: "xml",
      done(err, window) {
        assert.ifError(err);
        assert.strictEqual(window.document.firstChild.nodeName, "xml-stylesheet");
        assert.strictEqual(window.document.firstChild.data, "version='1.0'");

        t.done();
      }
    });
  });

  specify("parse5 can somewhat serialize XML docs", { async: true }, t => {
    const source = `<foo xmlns:foo="http://example.org/bar"><foo:bar></foo:bar></foo>`;
    jsdom.env({
      html: source,
      parsingMode: "xml",
      done(err, window) {
        assert.ifError(err);
        assert.strictEqual(jsdom.serializeDocument(window.document), source);
        t.done();
      }
    });
  });

  specify("xml parser recognizes built-in schemas (GH-1276)", { async: true }, t => {
    const doc = jsdom.jsdom("<element xml:lang='uk'></element>", {
      parsingMode: "xml"
    });

    const xmlns = "http://www.w3.org/XML/1998/namespace";
    const lang = doc.documentElement.getAttributeNS(xmlns, "lang");
    assert.strictEqual(lang, "uk");
    t.done();
  });

  describe("node specific tests", { skipIfBrowser: true }, () => {
    specify("should auto-detect XML documents based on .xml extension", { async: true }, t => {
      jsdom.env({
        file: path.resolve(__dirname, "files/xml.xml"),
        done(err, window) {
          assert.ifError(err);
          assert.ok(isParsedAsXml(window.document));

          t.done();
        }
      });
    });

    specify("parsingMode option should take precendence over .xml extension detection", { async: true }, t => {
      jsdom.env({
        file: path.resolve(__dirname, "files/xml.xml"),
        parsingMode: "html",
        done(err, window) {
          assert.ifError(err);
          assert.ok(!isParsedAsXml(window.document));

          t.done();
        }
      });
    });

    specify("should auto-detect HTML documents based on header", { async: true }, t => {
      const server = http.createServer((req, res) => {
        xmlStringPromise.then(xmlString => {
          res.setHeader("Content-Type", "text/html");
          res.end(xmlString);
        });
      });

      server.listen(0, () => {
        jsdom.env({
          url: "http://127.0.0.1:" + server.address().port + "/",
          done(err, window) {
            assert.ifError(err);
            assert.ok(!isParsedAsXml(window.document));

            t.done();
          }
        });
      });
    });

    specify("should auto-detect XML documents based on application/xml header", { async: true }, t => {
      const server = http.createServer((req, res) => {
        xmlStringPromise.then(xmlString => {
          res.setHeader("Content-Type", "application/xml");
          res.end(xmlString);
        });
      });

      server.listen(0, () => {
        jsdom.env({
          url: "http://127.0.0.1:" + server.address().port + "/",
          done(err, window) {
            assert.ifError(err);
            assert.ok(isParsedAsXml(window.document));

            t.done();
          }
        });
      });
    });

    specify("should auto-detect XML documents based on text/xml header", { async: true }, t => {
      const server = http.createServer((req, res) => {
        xmlStringPromise.then(xmlString => {
          res.setHeader("Content-Type", "text/xml");
          res.end(xmlString);
        });
      });

      server.listen(0, () => {
        jsdom.env({
          url: "http://127.0.0.1:" + server.address().port + "/",
          done(err, window) {
            assert.ifError(err);
            assert.ok(isParsedAsXml(window.document));

            t.done();
          }
        });
      });
    });

    specify("should auto-detect XML documents based on application/xhtml+xml header", { async: true }, t => {
      const server = http.createServer((req, res) => {
        xmlStringPromise.then(xmlString => {
          res.setHeader("Content-Type", "application/xhtml+xml");
          res.end(xmlString);
        });
      });

      server.listen(0, () => {
        jsdom.env({
          url: "http://127.0.0.1:" + server.address().port + "/",
          done(err, window) {
            assert.ifError(err);
            assert.ok(isParsedAsXml(window.document));

            t.done();
          }
        });
      });
    });

    specify("parsingMode should take precedence over text/xml header", { async: true }, t => {
      const server = http.createServer((req, res) => {
        xmlStringPromise.then(xmlString => {
          res.setHeader("Content-Type", "text/xml");
          res.end(xmlString);
        });
      });

      server.listen(0, () => {
        jsdom.env({
          url: "http://127.0.0.1:" + server.address().port + "/",
          parsingMode: "html",
          done(err, window) {
            assert.ifError(err);
            assert.ok(!isParsedAsXml(window.document));

            t.done();
          }
        });
      });
    });
  });
});
