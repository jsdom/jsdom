"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const { readTestFixture } = require("../util.js");

const xmlStringPromise = readTestFixture("to-port-to-wpts/files/xml.xml");

function isParsedAsXml(document) {
  return document.getElementsByTagName("CUSTOMTAG")[0].innerHTML.trim() === "";
}

describe("jsdom/xml", () => {
  specify("should ignore self-closing of tags in html docs", () => {
    return xmlStringPromise.then(xmlString => {
      const { window } = new JSDOM(xmlString);

      assert.ok(!isParsedAsXml(window.document));
    });
  });

  specify("should handle self-closing tags properly in xml docs", () => {
    return xmlStringPromise.then(xmlString => {
      const { window } = new JSDOM(xmlString, { contentType: "application/xml" });

      assert.ok(isParsedAsXml(window.document));
    });
  });

  specify("parsing XML keeps tag casing (GH-393)", () => {
    const { window } = new JSDOM(`<foo><bar/></foo>`, { contentType: "application/xml" });
    const elem = window.document.getElementsByTagName("foo")[0];
    assert.strictEqual(elem.tagName, "foo");
  });

  specify("attributes are case-sensitive in XML mode (GH-651)", () => {
    const xml = `<foo caseSensitive='abc' casesensitive='def'><bar/></foo>`;
    const { window } = new JSDOM(xml, { contentType: "application/xml" });
    const elem = window.document.getElementsByTagName("foo")[0];
    assert.strictEqual(elem.getAttribute("caseSensitive"), "abc");
    assert.strictEqual(elem.getAttribute("casesensitive"), "def");
  });

  specify("XML mode makes directives accessible (GH-415)", () => {
    const xml = `<?xml-stylesheet version='1.0'?><foo caseSensitive='abc' casesensitive='def'><bar/></foo>`;
    const { window } = new JSDOM(xml, { contentType: "application/xml" });
    assert.strictEqual(window.document.firstChild.nodeName, "xml-stylesheet");
    assert.strictEqual(window.document.firstChild.data, "version='1.0'");
  });

  specify("parse5 can somewhat serialize XML docs", () => {
    const source = `<foo xmlns:foo="http://example.org/bar"><foo:bar/></foo>`;
    const dom = new JSDOM(source, { contentType: "application/xml" });
    assert.strictEqual(dom.serialize(), source);
  });

  specify("xml parser recognizes built-in schemas (GH-1276)", () => {
    const { window } = new JSDOM("<element xml:lang='uk'></element>", { contentType: "application/xml" });

    const xmlns = "http://www.w3.org/XML/1998/namespace";
    const lang = window.document.documentElement.getAttributeNS(xmlns, "lang");
    assert.strictEqual(lang, "uk");
  });
});
