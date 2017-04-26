"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const jsdom = require("../../lib/old-api.js");
const { readTestFixture } = require("../util.js");

const xmlStringPromise = readTestFixture("to-port-to-wpts/files/xml.xml");

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
});
