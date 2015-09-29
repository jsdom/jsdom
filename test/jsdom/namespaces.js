"use strict";
const fs = require("fs");
const path = require("path");
const jsdom = require("../..");

function testHTMLDocument(t, document) {
  t.strictEqual(document.getElementsByTagName("body").length, 1);
  t.strictEqual(document.getElementsByTagName("p").length, 1);
  t.strictEqual(document.getElementsByTagName("img").length, 1);

  const p = document.getElementsByTagName("p")[0];
  t.strictEqual(p.prefix, null, "tag prefixes in html documents should always be null");
  t.strictEqual(p.localName, "p", "localNames in html documents always equal the tag name");
  t.strictEqual(p.namespaceURI, "http://www.w3.org/1999/xhtml",
    "html elements should automatically be assigned the XHTML namespace");

  t.strictEqual(p.getAttribute("xmlns:xlink"), "http://www.w3.org/1999/xlink",
    "attributes should be retrievable by their full name");

  const xmlnsAttr = p.attributes["xmlns:xlink"];
  t.strictEqual(xmlnsAttr.prefix, null, "attribute prefixes should be detected");
  t.strictEqual(xmlnsAttr.localName, "xmlns:xlink", "attribute localNames should be detected");
  t.strictEqual(xmlnsAttr.namespaceURI, null,
    "xmlns: attributes should not automatically be assigned to the xmlns namespace");

  const img = document.getElementsByTagName("img")[0];
  t.strictEqual(img.prefix, null, "tag prefixes in html documents should always be null");
  t.strictEqual(img.localName, "img", "localNames in html documents always equal the tag name");
  t.strictEqual(img.namespaceURI, "http://www.w3.org/1999/xhtml",
    "html elements should automatically be assigned the XHTML namespace");

  t.strictEqual(img.getAttribute("xlink:href"), "#test",
    "attributes should be retrievable by their full name");

  const xlinkAttr = img.attributes["xlink:href"];
  t.strictEqual(xlinkAttr.prefix, null, "attribute prefixes should be detected");
  t.strictEqual(xlinkAttr.localName, "xlink:href", "attribute localNames should be detected");
  t.strictEqual(xlinkAttr.namespaceURI, null,
    "it shouldn't be possible to create custom namespaces");
}

exports["should set namespaces in HTML documents created by jsdom.env()"] = t => {
  const doc = jsdom.jsdom(fs.readFileSync(path.resolve(__dirname, "files/ns-html.html")));

  testHTMLDocument(t, doc);

  t.done();
};

exports["should set namespace-related properties in HTML documents created by innerHTML"] = t => {
  const doc = jsdom.jsdom();

  doc.body.innerHTML = fs.readFileSync(path.resolve(__dirname, "files/ns-html.html"));
  testHTMLDocument(t, doc);

  t.done();
};

function testDocumentWithSVG(t, document) {
  t.strictEqual(document.getElementsByTagName("body").length, 1);
  t.strictEqual(document.getElementsByTagName("svg").length, 1);
  t.strictEqual(document.getElementsByTagName("use").length, 1);

  const svg = document.getElementsByTagName("svg")[0];
  t.strictEqual(svg.prefix, null, "tag prefixes in html documents should always be null");
  t.strictEqual(svg.localName, "svg", "localNames in html documents always equal the tag name");
  t.strictEqual(svg.namespaceURI, "http://www.w3.org/2000/svg",
    "svg elements should automatically be assigned the SVG namespace");

  t.strictEqual(svg.getAttribute("xmlns:xlink"), "http://www.w3.org/1999/xlink",
    "attributes should be retrievable by their full name");

  const xmlnsAttr = svg.attributes["xmlns:xlink"];
  t.strictEqual(xmlnsAttr.prefix, "xmlns", "attribute prefixes should be detected");
  t.strictEqual(xmlnsAttr.localName, "xlink", "attribute localNames should be detected");
  t.strictEqual(xmlnsAttr.namespaceURI, "http://www.w3.org/2000/xmlns/",
    "xmlns: attributes should automatically be assigned to the xmlns namespace");

  const use = document.getElementsByTagName("use")[0];
  t.strictEqual(use.prefix, null, "tag prefixes in html documents should always be null");
  t.strictEqual(use.localName, "use", "localNames in html documents always equal the tag name");
  t.strictEqual(use.namespaceURI, "http://www.w3.org/2000/svg",
    "svg elements should automatically be assigned the SVG namespace");

  t.strictEqual(use.getAttribute("xlink:href"), "#test",
    "attributes should be retrievable by their full name");

  const xlinkAttr = use.attributes["xlink:href"];
  t.strictEqual(xlinkAttr.prefix, "xlink", "attribute prefixes should be detected");
  t.strictEqual(xlinkAttr.localName, "href", "attribute localNames should be detected");
  t.strictEqual(xlinkAttr.namespaceURI, "http://www.w3.org/1999/xlink",
    "custom defined namespaces should be valid in child elements");
}

exports["should set namespace-related properties in HTML-SVG documents created by jsdom.env()"] = t => {
  const doc = jsdom.jsdom(fs.readFileSync(path.resolve(__dirname, "files/ns-svg.html")));

  testDocumentWithSVG(t, doc);

  t.done();
};

exports["should set namespace-related properties in HTML-SVG documents created by innerHTML"] = t => {
  const doc = jsdom.jsdom();

  doc.body.innerHTML = fs.readFileSync(path.resolve(__dirname, "files/ns-svg.html"));
  testDocumentWithSVG(t, doc);

  t.done();
};
