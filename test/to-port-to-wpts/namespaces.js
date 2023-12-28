"use strict";
const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");
const { readTestFixture } = require("../util.js");

function testHTMLDocument(document) {
  assert.equal(document.getElementsByTagName("body").length, 1);
  assert.equal(document.getElementsByTagName("p").length, 1);
  assert.equal(document.getElementsByTagName("img").length, 1);

  const p = document.getElementsByTagName("p")[0];
  assert.equal(p.prefix, null, "tag prefixes in html documents should always be null");
  assert.equal(p.localName, "p", "localNames in html documents always equal the tag name");
  assert.equal(
    p.namespaceURI,
    "http://www.w3.org/1999/xhtml",
    "html elements should automatically be assigned the XHTML namespace"
  );

  assert.equal(
    p.getAttribute("xmlns:xlink"),
    "http://www.w3.org/1999/xlink",
    "attributes should be retrievable by their full name"
  );

  const xmlnsAttr = p.attributes["xmlns:xlink"];
  assert.equal(xmlnsAttr.prefix, null, "attribute prefixes should be detected");
  assert.equal(xmlnsAttr.localName, "xmlns:xlink", "attribute localNames should be detected");
  assert.equal(
    xmlnsAttr.namespaceURI,
    null,
    "xmlns: attributes should not automatically be assigned to the xmlns namespace"
  );

  const img = document.getElementsByTagName("img")[0];
  assert.equal(img.prefix, null, "tag prefixes in html documents should always be null");
  assert.equal(img.localName, "img", "localNames in html documents always equal the tag name");
  assert.equal(
    img.namespaceURI,
    "http://www.w3.org/1999/xhtml",
    "html elements should automatically be assigned the XHTML namespace"
  );

  assert.equal(
    img.getAttribute("xlink:href"),
    "#test",
    "attributes should be retrievable by their full name"
  );

  const xlinkAttr = img.attributes["xlink:href"];
  assert.equal(xlinkAttr.prefix, null, "attribute prefixes should be detected");
  assert.equal(xlinkAttr.localName, "xlink:href", "attribute localNames should be detected");
  assert.equal(
    xlinkAttr.namespaceURI,
    null,
    "it shouldn't be possible to create custom namespaces"
  );
}

describe("jsdom/namespaces", () => {
  specify("should set namespaces in HTML documents created by jsdom.env()", () => {
    return readTestFixture("to-port-to-wpts/files/ns-html.html").then(content => {
      const doc = (new JSDOM(content)).window.document;
      testHTMLDocument(doc);
    });
  });

  specify("should set namespace-related properties in HTML documents created by innerHTML", () => {
    return readTestFixture("to-port-to-wpts/files/ns-html.html").then(content => {
      const doc = (new JSDOM()).window.document;
      doc.body.innerHTML = content;
      testHTMLDocument(doc);
    });
  });

  function testDocumentWithSVG(document) {
    assert.equal(document.getElementsByTagName("body").length, 1);
    assert.equal(document.getElementsByTagName("svg").length, 1);
    assert.equal(document.getElementsByTagName("use").length, 1);

    const svg = document.getElementsByTagName("svg")[0];
    assert.equal(svg.prefix, null, "tag prefixes in html documents should always be null");
    assert.equal(svg.localName, "svg", "localNames in html documents always equal the tag name");
    assert.equal(
      svg.namespaceURI,
      "http://www.w3.org/2000/svg",
      "svg elements should automatically be assigned the SVG namespace"
    );

    assert.equal(
      svg.getAttribute("xmlns:xlink"),
      "http://www.w3.org/1999/xlink",
      "attributes should be retrievable by their full name"
    );

    const xmlnsAttr = svg.attributes["xmlns:xlink"];
    assert.equal(xmlnsAttr.prefix, "xmlns", "attribute prefixes should be detected");
    assert.equal(xmlnsAttr.localName, "xlink", "attribute localNames should be detected");
    assert.equal(
      xmlnsAttr.namespaceURI,
      "http://www.w3.org/2000/xmlns/",
      "xmlns: attributes should automatically be assigned to the xmlns namespace"
    );

    const use = document.getElementsByTagName("use")[0];
    assert.equal(use.prefix, null, "tag prefixes in html documents should always be null");
    assert.equal(use.localName, "use", "localNames in html documents always equal the tag name");
    assert.equal(
      use.namespaceURI,
      "http://www.w3.org/2000/svg",
      "svg elements should automatically be assigned the SVG namespace"
    );

    assert.equal(
      use.getAttribute("xlink:href"),
      "#test",
      "attributes should be retrievable by their full name"
    );

    const xlinkAttr = use.attributes["xlink:href"];
    assert.equal(xlinkAttr.prefix, "xlink", "attribute prefixes should be detected");
    assert.equal(xlinkAttr.localName, "href", "attribute localNames should be detected");
    assert.equal(
      xlinkAttr.namespaceURI,
      "http://www.w3.org/1999/xlink",
      "custom defined namespaces should be valid in child elements"
    );
  }

  specify("should set namespace-related properties in HTML-SVG documents created by jsdom.env()", () => {
    return readTestFixture("to-port-to-wpts/files/ns-svg.html").then(content => {
      const doc = (new JSDOM(content)).window.document;
      testDocumentWithSVG(doc);
    });
  });

  specify("should set namespace-related properties in HTML-SVG documents created by innerHTML", () => {
    return readTestFixture("to-port-to-wpts/files/ns-svg.html").then(content => {
      const doc = (new JSDOM()).window.document;
      doc.body.innerHTML = content;
      testDocumentWithSVG(doc);
    });
  });
});
